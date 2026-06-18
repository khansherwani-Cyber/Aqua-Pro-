import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getDeposits, getWithdrawals, getPlanList } from '../services/kvService';

const History = () => {
  const { user } = useStore();
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (user) {
      getDeposits().then(d => setDeposits(d.filter(d => d.userId === user.id)));
      getWithdrawals().then(w => setWithdrawals(w.filter(w => w.userId === user.id)));
      getPlanList().then(p => setPlans(p.filter(p => p.userId === user.id)));
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-cyan">Transaction History</h1>
      <section>
        <h2 className="text-xl font-semibold text-gold mb-2">Deposits</h2>
        {deposits.length === 0 ? <p className="text-gray-400">No deposits</p> : (
          <div className="space-y-2">
            {deposits.map(d => (
              <div key={d.id} className="glass-sm flex justify-between text-sm">
                <div>
                  <span className="font-medium">{d.planName}</span> · ${d.amount}
                  <p className="text-xs text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`font-semibold ${d.status === 'approved' ? 'text-green-400' : d.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>{d.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gold mb-2">Withdrawals</h2>
        {withdrawals.length === 0 ? <p className="text-gray-400">No withdrawals</p> : (
          <div className="space-y-2">
            {withdrawals.map(w => (
              <div key={w.id} className="glass-sm flex justify-between text-sm">
                <div><span className="font-medium">${w.amount}</span> to {w.wallet.slice(0,6)}...{w.wallet.slice(-4)}</div>
                <span className={`font-semibold ${w.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>{w.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gold mb-2">Active Plans</h2>
        {plans.filter(p => p.active).length === 0 ? <p className="text-gray-400">None</p> : (
          <div className="space-y-2">
            {plans.filter(p => p.active).map(p => (
              <div key={p.id} className="glass-sm flex justify-between text-sm">
                <span>{p.planName} · ${p.amount}</span>
                <span className="text-cyan">{p.dailyYield}% daily</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
export default History;
