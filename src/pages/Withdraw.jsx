import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getUserByEmail, addWithdrawal, getWithdrawals, updateUser } from '../services/kvService';
import Toast from '../components/Toast';

const Withdraw = () => {
  const { user, setUser, showNotification } = useStore();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');

  useEffect(() => {
    if (user) getUserByEmail(user.email).then(u => setBalance(u.balance));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt < 5) return showNotification('Minimum $5', 'error');
    if (amt > balance) return showNotification('Insufficient balance', 'error');
    if (!wallet.trim()) return showNotification('Enter wallet address', 'error');
    await addWithdrawal({ userId: user.id, amount: amt, wallet });
    await updateUser(user.id, { balance: balance - amt });
    setUser({ ...user, balance: balance - amt });
    showNotification('Withdrawal submitted', 'success');
  };

  return (
    <div className="max-w-md mx-auto">
      <Toast />
      <h1 className="text-3xl font-heading text-platinum mb-6">Withdraw</h1>
      <div className="glass mb-6">
        <p className="text-pearl/40">Available</p>
        <p className="text-2xl font-bold text-platinum">${balance.toFixed(2)}</p>
      </div>
      <form onSubmit={handleSubmit} className="glass space-y-4">
        <input type="text" placeholder="Wallet address" value={wallet} onChange={e => setWallet(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3" required />
        <input type="number" step="0.01" placeholder="Amount (min $5)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3" required />
        <button className="btn-premium w-full">Request Withdrawal</button>
      </form>
    </div>
  );
};
export default Withdraw;
