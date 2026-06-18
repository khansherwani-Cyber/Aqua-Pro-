import { dbGet, dbSet, getUsers } from './kvService';

const nowISO = () => new Date().toISOString();

export async function logActivity(userId, type, details = {}) {
  const logs = await dbGet('activity_log') || [];
  logs.unshift({ id: Date.now().toString(), userId, type, details, timestamp: nowISO() });
  if (logs.length > 500) logs.length = 500;
  await dbSet('activity_log', logs);
}

export async function getUserActivity(userId, limit = 50) {
  const logs = await dbGet('activity_log') || [];
  return logs.filter(l => l.userId === userId).slice(0, limit);
}

export async function getAllActivity(limit = 100) {
  const logs = await dbGet('activity_log') || [];
  return logs.slice(0, limit);
}

export async function getLeaderboard() {
  const users = await getUsers();
  return users
    .filter(u => u.email !== 'admin@aquavault.com')
    .map(u => ({
      id: u.id, name: u.name, email: u.email,
      totalDeposited: u.totalDeposited || 0, totalHarvested: u.totalHarvested || 0, balance: u.balance || 0,
      score: (u.totalDeposited || 0) + (u.totalHarvested || 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}
