import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getUserByEmail, addWithdrawal, getWithdrawals, updateUser } from '../services/kvService';

const Withdraw = () => {
  const { user, setUser } = useStore();
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('BEP20');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(null);

  useEffect(() => {
    if (user) {
      getUserByEmail(user.email).then(u => setBalance(u.balance));
      getWithdrawals().then(wds => {
        const pend = wds.find(w => w.userId === user.id && w.status === 'pending');
        setPending(pend);
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt < 5) return setMessage('Minimum $5');
    if (amt > balance) return setMessage('Insufficient balance');
    if (!wallet.trim()) return setMessage('Enter wallet address');
    if (pending) return setMessage('You already have a pending withdrawal');
    await addWithdrawal({ userId: user.id, amount: amt, wallet, network, status: 'pending' });
    const newBalance = balance - amt;
    await updateUser(user.id, { balance: newBalance });
    setBalance(newBalance);
    setUser({ ...user, balance: newBalance });
    setMessage('Withdrawal request submitted. Processing within 6 hours.');
    setAmount('');
    setWallet('');
    setPending({ amount: amt }); // fake pending indicator
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-heading text-cyan mb-6">Withdraw USDT</h1>
      <div className="glass mb-6 flex justify-between items-center">
        <span className="text-gray-400">Available</span>
        <span className="text-2xl font-bold text-gold">${balance.toFixed(2)}</span>
      </div>
      {pending && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg p-3 mb-4 text-sm">
          Pending withdrawal: ${pending.amount} – awaiting admin
        </div>
      )}
      <form onSubmit={handleSubmit} className="glass space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Network</label>
          <select value={network} onChange={e => setNetwork(e.target.value)} className="w-full bg-navy border border-cyan/30 rounded-lg p-3">
            <option value="BEP20">BEP20 (BSC)</option>
            <option value="TRC20">TRC20 (TRON)</option>
            <option value="ERC20">ERC20 (Ethereum)</option>
          </select>
        </div>
        <input type="text" placeholder="Your USDT wallet address" value={wallet} onChange={e => setWallet(e.target.value)} className="w-full bg-navy border border-cyan/30 rounded-lg p-3" required />
        <input type="number" step="0.01" placeholder="Amount (min $5)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-navy border border-cyan/30 rounded-lg p-3" required />
        <button className="w-full bg-cyan text-navy font-bold py-3 rounded-full hover:bg-gold transition">Request Withdrawal</button>
      </form>
      {message && <p className="mt-4 text-center text-cyan text-sm">{message}</p>}
    </div>
  );
};
export default Withdraw;
