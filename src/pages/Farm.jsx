import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getUserActivePlans, calculateEarnedTokens, updateUser, getPlanList } from '../services/kvService';

const Farm = () => {
  const { user, refreshUser } = useStore();
  const [plans, setPlans] = useState([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) getUserActivePlans(user.id).then(setPlans);
  }, [user]);

  useEffect(() => {
    const accrue = async () => {
      if (!user) return;
      const active = await getUserActivePlans(user.id);
      for (let plan of active) {
        const earned = calculateEarnedTokens(plan);
        const prev = plan.earnedTokens || 0;
        const diff = earned - prev;
        if (diff > 0) {
          const fresh = await (await import('../services/kvService')).getUserByEmail(user.email);
          await updateUser(user.id, { currentTokens: (fresh.currentTokens || 0) + diff });
          const plans = await getPlanList();
          const idx = plans.findIndex(p => p.id === plan.id);
          if (idx !== -1) {
            plans[idx].earnedTokens = earned;
            await (await import('../services/kvService')).dbSet('plans', plans);
          }
          refreshUser();
        }
      }
    };
    const interval = setInterval(accrue, 60000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-heading text-cyan mb-6">Live Farm</h1>
      {plans.length === 0 ? (
        <div className="glass text-center py-10"><p className="text-gray-400">No turbines deployed.</p><a href="/deposit" className="text-cyan">Deploy one</a></div>
      ) : (
        <div className="space-y-6">
          {plans.map(plan => {
            const earned = calculateEarnedTokens(plan);
            const max = plan.amount * (plan.roi / 100);
            const progress = Math.min((earned / max) * 100, 100);
            return (
              <div key={plan.id} className="glass animate-pulse-cyan">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-heading text-lg">{plan.planName}</h3>
                    <p className="text-sm text-gray-400">${plan.amount} invested</p>
                  </div>
                  <span className="text-2xl font-bold text-cyan">{earned.toFixed(4)}</span>
                </div>
                <div className="mt-2 bg-gray-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-cyan to-blue-500 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{progress.toFixed(1)}% complete</span>
                  <span>Max: ${max.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Farm;
