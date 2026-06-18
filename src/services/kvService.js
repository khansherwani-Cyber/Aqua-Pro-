import { Redis } from '@upstash/redis';

let redis = null;
function getRedis() {
  if (redis) return redis;
  const url = import.meta.env.VITE_UPSTASH_REDIS_URL;
  const token = import.meta.env.VITE_UPSTASH_REDIS_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

function getLocal(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function setLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export async function dbGet(key) {
  const r = getRedis();
  if (r) {
    try { const data = await r.get(key); return data ?? []; } catch { return getLocal(key) || []; }
  }
  return getLocal(key) || [];
}

export async function dbSet(key, value) {
  const r = getRedis();
  if (r) {
    try { await r.set(key, JSON.stringify(value)); return; } catch {}
  }
  setLocal(key, value);
}

const nowISO = () => new Date().toISOString();

export async function getUsers() { return await dbGet('users'); }
export async function getUserByEmail(email) { const users = await getUsers(); return users.find(u => u.email === email) || null; }
export async function getUserById(id) { const users = await getUsers(); return users.find(u => u.id === id) || null; }

export async function createUser({ name, email, password, referredBy = null }) {
  const users = await getUsers();
  if (users.find(u => u.email === email)) return null;
  const newUser = {
    id: Date.now().toString(), name, email, password,
    balance: 0, totalDeposited: 0, totalHarvested: 0, currentTokens: 0,
    referralCode: Date.now().toString().slice(-8),
    referredBy, referralEarnings: 0, level2Earnings: 0,
    bonusesClaimed: [], settings: { autoHarvest: false }, createdAt: nowISO(),
  };
  users.push(newUser);
  await dbSet('users', users);
  if (referredBy) {
    const refs = await dbGet('referrals');
    refs.push({ id: Date.now().toString(), referrerId: referredBy, userId: newUser.id, level: 1, timestamp: nowISO() });
    await dbSet('referrals', refs);
  }
  if (!(await getUserByEmail('admin@aquavault.com'))) {
    await createUser({ name: 'Admin', email: 'admin@aquavault.com', password: 'admin123' });
  }
  return newUser;
}

export async function updateUser(id, updates) {
  const users = await getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx !== -1) { users[idx] = { ...users[idx], ...updates }; await dbSet('users', users); }
}

export async function processReferralRewards(userId, depositAmount) {
  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  if (!user?.referredBy) return;
  const ref1 = users.find(u => u.id === user.referredBy);
  if (ref1) {
    const reward1 = depositAmount * 0.05;
    ref1.balance += reward1;
    ref1.referralEarnings = (ref1.referralEarnings || 0) + reward1;
    if (ref1.referredBy) {
      const ref2 = users.find(u => u.id === ref1.referredBy);
      if (ref2) {
        const reward2 = depositAmount * 0.02;
        ref2.balance += reward2;
        ref2.level2Earnings = (ref2.level2Earnings || 0) + reward2;
      }
    }
  }
  await dbSet('users', users);
}

export async function getDeposits() { return await dbGet('deposits'); }
export async function addDeposit(d) {
  const deposits = await getDeposits();
  const newD = { ...d, id: Date.now().toString(), status: 'pending', createdAt: nowISO() };
  deposits.push(newD);
  await dbSet('deposits', deposits);
  return newD;
}
export async function updateDepositStatus(id, status) {
  const deposits = await getDeposits();
  await dbSet('deposits', deposits.map(d => d.id === id ? { ...d, status } : d));
}

export async function getUserActivePlans(userId) { const plans = await dbGet('plans'); return plans.filter(p => p.userId === userId && p.active); }
export async function getPlanList() { return await dbGet('plans'); }
export async function addUserPlan(plan) {
  const plans = await getPlanList();
  plans.push({ ...plan, id: Date.now().toString(), startDate: nowISO(), earnedTokens: 0, active: true });
  await dbSet('plans', plans);
}

export async function getWithdrawals() { return await dbGet('withdrawals'); }
export async function addWithdrawal(w) {
  const withdrawals = await getWithdrawals();
  withdrawals.push({ ...w, id: Date.now().toString(), status: 'pending', requestedAt: nowISO() });
  await dbSet('withdrawals', withdrawals);
}
export async function updateWithdrawalStatus(id, status) {
  const withdrawals = await getWithdrawals();
  await dbSet('withdrawals', withdrawals.map(w => w.id === id ? { ...w, status } : w));
}

export async function getReferralCounts(userId) {
  const refs = await dbGet('referrals');
  return { l1: refs.filter(r => r.referrerId === userId && r.level === 1).length, l2: refs.filter(r => r.referrerId === userId && r.level === 2).length };
}
export async function getReferralsByUser(userId) {
  const refs = await dbGet('referrals');
  return refs.filter(r => r.referrerId === userId);
}

export async function claimBonus(userId, bonusId) {
  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  if (user && !user.bonusesClaimed.includes(bonusId)) {
    user.bonusesClaimed.push(bonusId);
    await dbSet('users', users);
    return true;
  }
  return false;
}

export function calculateEarnedTokens(plan) {
  const days = (new Date() - new Date(plan.startDate)) / 86400000;
  if (days >= plan.days) return plan.amount * (plan.roi / 100);
  return plan.amount * (plan.dailyYield / 100) * Math.floor(days);
}
