import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getUserByEmail } from '../services/kvService';
import { exchangeTokens } from '../services/advancedService';
import Toast from '../components/Toast';
import { IconExchange } from '../components/PremiumIcons';

const Exchange = () => {
  const { user, showNotification } = useStore();
  const [balance, setBalance] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState('tokens_to_usdt');

  useEffect(() => {
    if (user) getUserByEmail(user.email).then(u => {
      setBalance(u.balance);
      setTokens(u.currentTokens);
    });
  }, [user]);

  const handleExchange = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return showNotification('Enter an amount', 'error');
    const result = await exchangeTokens(user.id, amt, direction);
    if (result.success) {
      showNotification(result.message, 'success');
      const u = await getUserByEmail(user.email);
      setBalance(u.balance);
      setTokens(u.currentTokens);
    } else {
      showNotification(result.message, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Toast />
      <h1 className="text-3xl font-heading text-platinum mb-6 flex items-center gap-3">
        <IconExchange className="w-8 h-8" />
        Exchange
      </h1>
      <div className="premium-card mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-pearl/60">USDT Balance</span>
          <span className="text-rosegold">${balance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-pearl/60">Current Tokens</span>
          <span className="text-platinum">{tokens.toFixed(4)}</span>
        </div>
      </div>
      <div className="glass space-y-4">
        <div className="flex rounded-full bg-sapphire-light p-1">
          <button
            onClick={() => setDirection('tokens_to_usdt')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              direction === 'tokens_to_usdt' ? 'bg-velvet text-white' : 'text-pearl/60'
            }`}
          >
            Tokens → USDT
          </button>
          <button
            onClick={() => setDirection('usdt_to_tokens')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              direction === 'usdt_to_tokens' ? 'bg-velvet text-white' : 'text-pearl/60'
            }`}
          >
            USDT → Tokens
          </button>
        </div>
        <input
          type="number"
          step="0.0001"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder={direction === 'tokens_to_usdt' ? 'Token amount' : 'USDT amount'}
          className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3 text-pearl"
        />
        <p className="text-xs text-pearl/40 text-center">Rate: 1 Token = 0.95 USDT</p>
        <button onClick={handleExchange} className="btn-premium w-full">
          Exchange Now
        </button>
      </div>
    </div>
  );
};

export default Exchange;
