import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/activityService';
import Spinner from '../components/Spinner';
import { IconLeaderboard } from '../components/PremiumIcons';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getLeaderboard().then(d => { setLeaders(d); setLoading(false); }); }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-heading text-platinum mb-6 flex items-center gap-3"><IconLeaderboard className="w-8 h-8" />Leaderboard</h1>
      <div className="glass">
        {leaders.length === 0 ? <p className="text-pearl/40 text-center py-4">No data yet.</p> : (
          <div className="space-y-3">
            {leaders.map((user, i) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-platinum/10 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-display text-rosegold w-8 text-center">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-pearl/40">{user.email}</p>
                  </div>
                </div>
                <p className="text-platinum">${user.score.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Leaderboard;
