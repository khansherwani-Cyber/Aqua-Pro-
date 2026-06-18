import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getReferralCounts } from '../services/kvService';

const Team = () => {
  const { user } = useStore();
  const [counts, setCounts] = useState({ l1: 0, l2: 0 });
  const link = `${window.location.origin}/register?ref=${user.referralCode}`;

  useEffect(() => {
    if (user) getReferralCounts(user.id).then(setCounts);
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-platinum">Referral Team</h1>
      <div className="glass">
        <p className="text-pearl/40 mb-2">Your Link</p>
        <div className="flex gap-2">
          <input readOnly value={link} className="flex-1 bg-sapphire border border-platinum/20 rounded-xl p-2 text-sm" />
          <button onClick={() => navigator.clipboard.writeText(link)} className="btn-premium text-sm px-4">Copy</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="glass text-center">
          <p className="text-pearl/40">Level 1</p>
          <p className="text-3xl font-heading text-platinum">{counts.l1}</p>
        </div>
        <div className="glass text-center">
          <p className="text-pearl/40">Level 2</p>
          <p className="text-3xl font-heading text-platinum">{counts.l2}</p>
        </div>
      </div>
    </div>
  );
};
export default Team;
