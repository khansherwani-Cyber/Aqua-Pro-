import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getReferralCounts, getReferralsByUser, getUsers } from '../services/kvService';

const Team = () => {
  const { user } = useStore();
  const [counts, setCounts] = useState({ l1: 0, l2: 0 });
  const [referrals, setReferrals] = useState([]);
  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`;

  useEffect(() => {
    if (user) {
      getReferralCounts(user.id).then(setCounts);
      getReferralsByUser(user.id).then(async (refs) => {
        // Attach user emails
        const users = await getUsers();
        const enriched = refs.map(r => ({
          ...r,
          email: users.find(u => u.id === r.userId)?.email || r.userId,
        }));
        setReferrals(enriched);
      });
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-cyan">Referral Program</h1>
      <div className="glass flex flex-col items-center">
        <p className="text-gray-400 mb-2">Your Referral Link</p>
        <div className="flex w-full max-w-md gap-2">
          <input readOnly value={referralLink} className="flex-1 bg-navy border border-cyan/30 rounded-lg p-2 text-sm" />
          <button onClick={() => navigator.clipboard.writeText(referralLink)} className="bg-cyan text-navy px-4 rounded-lg font-medium text-sm">Copy</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="glass text-center">
          <p className="text-gray-400">Level 1</p>
          <p className="text-3xl font-heading text-cyan">{counts.l1}</p>
          <p className="text-xs text-gray-500 mt-1">5% commission</p>
        </div>
        <div className="glass text-center">
          <p className="text-gray-400">Level 2</p>
          <p className="text-3xl font-heading text-cyan">{counts.l2}</p>
          <p className="text-xs text-gray-500 mt-1">2% commission</p>
        </div>
      </div>

      <div className="glass">
        <h3 className="text-lg font-semibold mb-3">Your Referrals</h3>
        {referrals.length === 0 ? (
          <p className="text-gray-400 text-sm">No referrals yet. Share your link!</p>
        ) : (
          <div className="space-y-2">
            {referrals.map(ref => (
              <div key={ref.id} className="flex justify-between items-center text-sm bg-navy/30 p-2 rounded">
                <div>
                  <p className="text-white">{ref.email}</p>
                  <p className="text-xs text-gray-500">Level {ref.level} · {new Date(ref.timestamp).toLocaleDateString()}</p>
                </div>
                <span className="text-cyan text-xs">+5%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
