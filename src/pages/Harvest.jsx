import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getUserByEmail, updateUser } from '../services/kvService';
import Toast from '../components/Toast';
import { logActivity } from '../services/activityService';
// inside handleHarvest after update:
await logActivity(user.id, 'harvest', { amount: tokens });

const Harvest = () => {
  const { user, setUser, showNotification } = useStore();
  const [tokens, setTokens] = useState(0);
  const [harvesting, setHarvesting] = useState(false);

  useEffect(() => {
    if (user) getUserByEmail(user.email).then(u => setTokens(u.currentTokens || 0));
  }, [user]);

  const handleHarvest = async () => {
    if (tokens <= 0) return;
    setHarvesting(true);
    const u = await getUserByEmail(user.email);
    const newBalance = u.balance + tokens;
    const newTotalHarvested = (u.totalHarvested || 0) + tokens;
    await updateUser(user.id, {
      balance: newBalance,
      currentTokens: 0,
      totalHarvested: newTotalHarvested,
    });
    setUser({ ...u, balance: newBalance, currentTokens: 0, totalHarvested: newTotalHarvested });
    setTokens(0);
    setHarvesting(false);
    showNotification(`Harvested $${tokens.toFixed(2)} USDT!`, 'success');
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <Toast />
      <h1 className="text-3xl font-heading text-cyan mb-6">Harvest Tokens</h1>
      <div className="glass mb-6">
        <p className="text-gray-400 text-lg">Available Current Tokens</p>
        <p className="text-6xl font-heading text-cyan mt-3">{tokens.toFixed(4)}</p>
      </div>
      <button
        onClick={handleHarvest}
        disabled={tokens <= 0 || harvesting}
        className="w-full bg-gradient-to-r from-cyan to-blue-500 text-navy font-bold py-4 rounded-full text-xl hover:scale-105 transition disabled:opacity-50"
      >
        {harvesting ? 'Harvesting...' : 'Harvest All → USDT'}
      </button>
      <p className="text-gray-500 text-sm mt-4">1 Current Token = $1 USDT</p>
    </div>
  );
};
export default Harvest;
