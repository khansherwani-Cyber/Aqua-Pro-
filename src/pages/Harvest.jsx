import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getUserByEmail, updateUser } from '../services/kvService';
import { logActivity } from '../services/activityService';
import Toast from '../components/Toast';
import { IconHarvest } from '../components/PremiumIcons';

const Harvest = () => {
  const { user, setUser, showNotification } = useStore();
  const [tokens, setTokens] = useState(0);
  const [harvesting, setHarvesting] = useState(false);

  useEffect(() => {
    if (user) {
      getUserByEmail(user.email).then(u => setTokens(u.currentTokens || 0));
    }
  }, [user]);

  const handleHarvest = async () => {
    if (tokens <= 0) return;
    setHarvesting(true);
    
    try {
      const u = await getUserByEmail(user.email);
      const newBalance = u.balance + tokens;
      const newTotalHarvested = (u.totalHarvested || 0) + tokens;
      
      await updateUser(user.id, {
        balance: newBalance,
        currentTokens: 0,
        totalHarvested: newTotalHarvested,
      });
      
      // Log activity INSIDE the async function, not at top level
      await logActivity(user.id, 'harvest', { amount: tokens });
      
      setUser({ ...u, balance: newBalance, currentTokens: 0, totalHarvested: newTotalHarvested });
      setTokens(0);
      showNotification(`Harvested $${tokens.toFixed(2)} USDT!`, 'success');
    } catch (error) {
      showNotification('Harvest failed. Please try again.', 'error');
    } finally {
      setHarvesting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <Toast />
      <h1 className="text-3xl font-heading text-platinum mb-6 flex items-center justify-center gap-3">
        <IconHarvest className="w-8 h-8" />
        Harvest Tokens
      </h1>
      <div className="glass mb-6">
        <p className="text-pearl/40 text-lg">Available Current Tokens</p>
        <p className="text-6xl font-heading text-platinum mt-3">{tokens.toFixed(4)}</p>
      </div>
      <button
        onClick={handleHarvest}
        disabled={tokens <= 0 || harvesting}
        className="btn-premium w-full text-xl py-4 disabled:opacity-50"
      >
        {harvesting ? 'Harvesting...' : 'Harvest All → USDT'}
      </button>
      <p className="text-pearl/20 text-sm mt-4">1 Current Token = $1 USDT</p>
    </div>
  );
};

export default Harvest;
