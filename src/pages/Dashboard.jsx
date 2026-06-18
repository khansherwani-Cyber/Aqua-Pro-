import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getUserByEmail, getUserActivePlans, calculateEarnedTokens } from '../services/kvService';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { IconDashboard, IconHarvest } from '../components/PremiumIcons';

const Dashboard = () => {
  const { user } = useStore();
  const [balance, setBalance] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const fresh = await getUserByEmail(user.email);
      setBalance(fresh.balance);
      setTokens(fresh.currentTokens);
      setPlans(await getUserActivePlans(user.id));
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass"><span className="text-pearl/40 text-sm">USDT Balance</span><p className="text-3xl font-heading text-platinum">${balance.toFixed(2)}</p></div>
        <div className="glass"><span className="text-pearl/40 text-sm">Current Tokens</span><p className="text-3xl font-heading text-rosegold">{tokens.toFixed(4)}</p></div>
        <div className="glass"><span className="text-pearl/40 text-sm">Active Turbines</span><p className="text-3xl font-heading text-platinum">{plans.length}</p></div>
      </div>

      <h2 className="text-xl font-heading text-platinum">Active Turbines</h2>
      {plans.length === 0 ? (
        <div className="glass text-center py-10">
          <p className="text-pearl/40 mb-2">No active turbines.</p>
          <Link to="/deposit" className="text-platinum underline">Deploy your first</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {plans.map(plan => {
            const earned = calculateEarnedTokens(plan);
            const max = plan.amount * (plan.roi / 100);
            const progress = Math.min((earned / max) * 100, 100);
            return (
              <div key={plan.id} className="glass">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{plan.planName}</p>
                    <p className="text-sm text-pearl/40">${plan.amount} · {plan.dailyYield}% daily</p>
                  </div>
                  <span className="text-platinum">${earned.toFixed(2)}</span>
                </div>
                <div className="mt-2 bg-sapphire rounded-full h-2">
                  <div className="bg-gradient-to-r from-platinum to-velvet h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-4">
        <Link to="/harvest" className="btn-premium flex-1 text-center">Harvest</Link>
        <Link to="/reinvest" className="btn-outline-premium flex-1 text-center">Reinvest</Link>
      </div>
    </div>
  );
};
export default Dashboard;
