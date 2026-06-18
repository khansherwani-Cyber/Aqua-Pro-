import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getUserByEmail } from '../services/kvService';
import { stakeUSDT, getUserStakes, claimStakingReward } from '../services/advancedService';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
import { IconStaking } from '../components/PremiumIcons';

const Staking = () => {
  const { user, showNotification } = useStore();
  const [balance, setBalance] = useState(0);
  const [stakes, setStakes] = useState([]);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserByEmail(user.email).then(u => setBalance(u.balance));
      getUserStakes(user.id).then(s => { setStakes(s); setLoading(false); });
    }
  }, [user]);

  const handleStake = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return showNotification('Enter an amount', 'error');
    const result = await stakeUSDT(user.id, amt, duration);
    if (result.success) {
      showNotification(result.message, 'success');
      setAmount('');
      const u = await getUserByEmail(user.email);
      setBalance(u.balance);
      setStakes(await getUserStakes(user.id));
    } else {
      showNotification(result.message, 'error');
    }
  };

  const handleClaim = async (stakeId) => {
    const result = await claimStakingReward(user.id, stakeId);
    if (result.success) {
      showNotification(`Claimed $${result.totalReturn.toFixed(2)}!`, 'success');
      setStakes(await getUserStakes(user.id));
    } else {
      showNotification(result.message, 'error');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <Toast />
      <h1 className="text-3xl font-heading text-platinum mb-6 flex items-center gap-3">
        <IconStaking className="w-8 h-8" />
        Staking
      </h1>
      <div className="premium-card mb-6">
        <p className="text-pearl/60">Available Balance</p>
        <p className="text-2xl font-heading text-rosegold">${balance.toFixed(2)}</p>
      </div>

      <div className="glass mb-6 space-y-4">
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="USDT amount to stake" className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3" />
        <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3 text-pearl">
          <option value={30}>30 days - 12% APY</option>
          <option value={90}>90 days - 24% APY</option>
          <option value={180}>180 days - 48% APY</option>
          <option value={365}>365 days - 100% APY</option>
        </select>
        <button onClick={handleStake} className="btn-premium w-full">Stake USDT</button>
      </div>

      <h2 className="text-xl font-heading text-platinum mb-4">Active Stakes</h2>
      {stakes.length === 0 ? (
        <p className="text-pearl/40">No active stakes</p>
      ) : (
        <div className="space-y-4">
          {stakes.map(stake => {
            const endDate = new Date(stake.endDate);
            const now = new Date();
            const completed = now >= endDate;
            return (
              <div key={stake.id} className="glass flex justify-between items-center">
                <div>
                  <p className="font-semibold">${stake.amount}</p>
                  <p className="text-sm text-pearl/60">{stake.apy}% APY · Ends {endDate.toLocaleDateString()}</p>
                </div>
                {completed ? (
                  <button onClick={() => handleClaim(stake.id)} className="btn-premium text-sm px-4 py-2">
                    Claim ${(stake.amount * (1 + stake.apy/100)).toFixed(2)}
                  </button>
                ) : (
                  <span className="text-platinum text-sm animate-pulse">Staking...</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Staking;
