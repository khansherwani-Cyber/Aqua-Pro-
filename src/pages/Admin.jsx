import { useState, useEffect } from 'react';
import {
  getDeposits,
  getWithdrawals,
  getUsers,
  updateDepositStatus,
  updateWithdrawalStatus,
  addUserPlan,
  updateUser,
  processReferralRewards,
  getReferralsByUser,
} from '../services/kvService';
import { getAllActivity, logActivity } from '../services/activityService';
import { plans } from '../data/plans';
import Toast from '../components/Toast';
import { IconAdmin } from '../components/PremiumIcons';

const Admin = () => {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [balanceAdj, setBalanceAdj] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setDeposits(await getDeposits());
    setWithdrawals(await getWithdrawals());
    setUsers(await getUsers());
    setActivity(await getAllActivity(30));
  };

  const approveDeposit = async (dep) => {
    await updateDepositStatus(dep.id, 'approved');
    const planDef = plans.find(p => p.id === dep.planId);
    if (planDef) {
      await addUserPlan({
        userId: dep.userId,
        planId: dep.planId,
        planName: dep.planName,
        amount: dep.amount,
        dailyYield: planDef.dailyYield,
        roi: planDef.roi,
        days: planDef.days,
      });
    }
    const user = users.find(u => u.id === dep.userId);
    if (user) await updateUser(dep.userId, { totalDeposited: (user.totalDeposited || 0) + dep.amount });
    await processReferralRewards(dep.userId, dep.amount);
    await logActivity(dep.userId, 'deposit_approved', { amount: dep.amount, plan: dep.planName });
    loadData();
  };

  const approveWithdrawal = async (w) => {
    await updateWithdrawalStatus(w.id, 'paid');
    await logActivity(w.userId, 'withdraw_paid', { amount: w.amount });
    loadData();
  };

  const adjustBalance = async (userId, adjAmount) => {
    const amt = parseFloat(adjAmount);
    if (!amt || isNaN(amt)) return;
    const user = users.find(u => u.id === userId);
    if (user) {
      await updateUser(userId, { balance: (user.balance || 0) + amt });
      await logActivity(userId, 'balance_adjust', { amount: amt, by: 'admin' });
      loadData();
    }
  };

  const viewReferralTree = async (userId) => {
    const refs = await getReferralsByUser(userId);
    setSelectedUser({ userId, refs });
  };

  return (
    <div className="space-y-8">
      <Toast />
      <h1 className="text-3xl font-heading text-rosegold mb-6 flex items-center gap-3">
        <IconAdmin className="w-8 h-8" />
        Admin Panel
      </h1>

      <section>
        <h2 className="text-xl text-platinum mb-3">Recent Activity</h2>
        <div className="glass-sm max-h-40 overflow-y-auto space-y-2">
          {activity.slice(0, 10).map(a => (
            <div key={a.id} className="text-xs flex justify-between">
              <span className="text-pearl/60">{a.type} - {a.userId}</span>
              <span className="text-pearl/20">{new Date(a.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl text-platinum mb-3">Pending Deposits</h2>
        {deposits.filter(d => d.status === 'pending').length === 0 && <p className="text-pearl/40">None</p>}
        {deposits.filter(d => d.status === 'pending').map(d => (
          <div key={d.id} className="glass-sm flex flex-col md:flex-row justify-between gap-2 mb-2">
            <div>
              <p className="text-pearl"><strong>{d.userId}</strong> · {d.planName} · ${d.amount}</p>
              <p className="text-xs text-pearl/40 break-all">TX: {d.txHash}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => approveDeposit(d)} className="bg-green-500/80 text-white px-3 py-1 rounded text-sm">Approve</button>
              <button onClick={() => { updateDepositStatus(d.id, 'rejected'); loadData(); }} className="bg-red-500/80 text-white px-3 py-1 rounded text-sm">Reject</button>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl text-platinum mb-3">Pending Withdrawals</h2>
        {withdrawals.filter(w => w.status === 'pending').length === 0 && <p className="text-pearl/40">None</p>}
        {withdrawals.filter(w => w.status === 'pending').map(w => (
          <div key={w.id} className="glass-sm flex justify-between items-center mb-2">
            <div>
              <p className="text-pearl">{w.userId} · ${w.amount} · {w.wallet?.slice(0, 8)}...</p>
            </div>
            <button onClick={() => approveWithdrawal(w)} className="bg-blue-500/80 text-white px-3 py-1 rounded text-sm">Mark Paid</button>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl text-platinum mb-3">Users ({users.length})</h2>
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="glass-sm flex flex-col md:flex-row justify-between items-start md:items-center text-sm gap-2">
              <div className="flex-1">
                <p className="font-medium text-pearl">{u.email}</p>
                <p className="text-pearl/60">Bal: ${u.balance?.toFixed(2)} | Tokens: {u.currentTokens?.toFixed(4)} | Deposited: ${(u.totalDeposited || 0).toFixed(2)}</p>
                <button onClick={() => viewReferralTree(u.id)} className="text-xs text-platinum underline mt-1">View Referrals</button>
              </div>
              <div className="flex gap-1 items-center">
                <input
                  type="number"
                  step="0.01"
                  className="w-24 bg-sapphire border border-platinum/20 rounded p-1 text-xs text-pearl"
                  placeholder="+/-"
                  onChange={e => setBalanceAdj(prev => ({ ...prev, [u.id]: e.target.value }))}
                />
                <button onClick={() => adjustBalance(u.id, balanceAdj[u.id])} className="bg-platinum text-sapphire px-2 py-1 rounded text-xs font-bold">Adjust</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="glass max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl text-platinum font-heading">Referral Tree</h3>
              <button onClick={() => setSelectedUser(null)} className="text-pearl/40 hover:text-pearl">✕</button>
            </div>
            {selectedUser.refs.length === 0 ? (
              <p className="text-pearl/40">No referrals.</p>
            ) : (
              <ul className="space-y-2">
                {selectedUser.refs.map(r => (
                  <li key={r.id} className="flex justify-between text-sm bg-sapphire/50 p-2 rounded">
                    <span className="text-pearl">{r.userId} (L{r.level})</span>
                    <span className="text-pearl/40">{new Date(r.timestamp).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
