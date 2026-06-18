import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getUserByEmail, addUserPlan, updateUser } from '../services/kvService';
import { plans } from '../data/plans';
import Toast from '../components/Toast';

const Reinvest = () => {
  const { user, refreshUser, showNotification } = useStore();
  const [balance, setBalance] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [amount, setAmount] = useState(plans[0].minDeposit);

  useEffect(() => {
    if (user) getUserByEmail(user.email).then(u => setBalance(u.balance));
  }, [user]);

  const handleReinvest = async () => {
    const amt = parseFloat(amount);
    if (amt < selectedPlan.minDeposit) {
      showNotification(`Minimum $${selectedPlan.minDeposit}`, 'error');
      return;
    }
    if (amt > balance) {
      showNotification('Insufficient balance', 'error');
      return;
    }
    const u = await getUserByEmail(user.email);
    await updateUser(user.id, { balance: u.balance - amt });
    await addUserPlan({
      userId: user.id,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      amount: amt,
      dailyYield: selectedPlan.dailyYield,
      roi: selectedPlan.roi,
      days: selectedPlan.days,
    });
    refreshUser();
    showNotification(`Reinvested $${amt} into ${selectedPlan.name}`, 'success');
  };

  return (
    <div className="max-w-xl mx-auto">
      <Toast />
      <h1 className="text-3xl font-heading text-cyan mb-6">Reinvest USDT</h1>
      <div className="glass mb-6">
        <p className="text-gray-400">Available Balance</p>
        <p className="text-2xl font-bold text-gold">${balance.toFixed(2)}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {plans.map(plan => (
          <button
            key={plan.id}
            onClick={() => { setSelectedPlan(plan); setAmount(plan.minDeposit); }}
            className={`glass-sm text-left ${selectedPlan.id === plan.id ? 'ring-2 ring-cyan' : ''}`}
          >
            <span className="text-2xl">{plan.icon}</span>
            <h3 className="font-bold">{plan.name}</h3>
            <p className="text-xs text-gray-400">{plan.dailyYield}% daily</p>
          </button>
        ))}
      </div>
      <div className="glass space-y-4">
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full bg-navy border border-cyan/30 rounded-lg p-3"
        />
        <button
          onClick={handleReinvest}
          className="w-full bg-cyan text-navy font-bold py-3 rounded-full hover:bg-gold transition"
        >
          Reinvest Now
        </button>
      </div>
    </div>
  );
};
export default Reinvest;
