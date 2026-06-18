import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getUserActivity } from '../services/activityService';
import Spinner from '../components/Spinner';
import { IconHistory } from '../components/PremiumIcons';

const ActivityLog = () => {
  const { user } = useStore();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) getUserActivity(user.id).then(d => { setActivities(d); setLoading(false); });
  }, [user]);

  const labels = {
    deposit: 'Deposit submitted', deposit_approved: 'Deposit approved',
    harvest: 'Harvested', withdraw: 'Withdrawal requested',
    withdraw_paid: 'Withdrawal paid', reinvest: 'Reinvested',
    stake: 'Staked', stake_claim: 'Staking claimed',
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-heading text-platinum mb-6 flex items-center gap-3"><IconHistory className="w-8 h-8" />Activity</h1>
      <div className="glass space-y-3">
        {activities.length === 0 ? <p className="text-pearl/40 text-center py-4">No activity yet.</p> : (
          activities.map(act => (
            <div key={act.id} className="flex justify-between text-sm border-b border-platinum/10 pb-2 last:border-0">
              <span>{labels[act.type] || act.type} {act.details.amount && <span className="text-platinum">${parseFloat(act.details.amount).toFixed(2)}</span>}</span>
              <span className="text-pearl/20 text-xs">{new Date(act.timestamp).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ActivityLog;
