import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getDeposits, claimBonus, addUserPlan } from '../services/kvService';
import { bonusDefinitions } from '../data/bonuses';
import BonusCard from '../components/BonusCard';
import Toast from '../components/Toast';

const Bonuses = () => {
  const { user, refreshUser, showNotification } = useStore();
  const [bonuses, setBonuses] = useState([]);

  useEffect(() => {
    if (user) {
      const load = async () => {
        const deposits = await getDeposits();
        const approved = deposits.filter(d => d.userId === user.id && d.status === 'approved');
        const totalDeposits = approved.reduce((s, d) => s + d.amount, 0);
        const harvests = user.totalHarvested || 0;
        const claimedList = user.bonusesClaimed || [];
        const evaluated = bonusDefinitions.map(b => ({
          ...b,
          eligible: b.condition(user, totalDeposits, harvests),
          claimed: claimedList.includes(b.id),
        }));
        setBonuses(evaluated);
      };
      load();
    }
  }, [user]);

  const handleClaim = async (bonus) => {
    if (bonus.id === 'first-wave') {
      await addUserPlan({
        userId: user.id,
        planId: 'starter',
        planName: 'First Wave Bonus',
        amount: 80,
        dailyYield: 1.5,
        roi: 21,
        days: 15,
      });
      await claimBonus(user.id, bonus.id);
      refreshUser();
      showNotification('Free 15-day Coastal Turbine activated!', 'success');
    } else if (bonus.id === 'power-surge') {
      await claimBonus(user.id, bonus.id);
      refreshUser();
      showNotification('2% reinvest bonus unlocked!', 'success');
    } else if (bonus.id === 'deep-dive') {
      const users = await (await import('../services/kvService')).getUsers();
      const u = users.find(u => u.id === user.id);
      if (u) {
        u.balance += 10;
        await (await import('../services/kvService')).updateUser(user.id, { balance: u.balance });
      }
      await claimBonus(user.id, bonus.id);
      refreshUser();
      showNotification('$10 bonus added to your balance!', 'success');
    }
  };

  return (
    <div>
      <Toast />
      <h1 className="text-3xl font-heading text-platinum mb-6">Ocean Bonuses</h1>
      <p className="text-pearl/40 mb-6">Unlock special rewards by reaching milestones.</p>
      <div className="space-y-4">
        {bonuses.map(bonus => (
          <BonusCard
            key={bonus.id}
            bonus={bonus}
            claimed={bonus.claimed}
            onClaim={() => handleClaim(bonus)}
          />
        ))}
      </div>
    </div>
  );
};
export default Bonuses;
