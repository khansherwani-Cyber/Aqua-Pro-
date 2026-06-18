import { useState } from 'react';
import { wallets } from '../config/wallets';
import { plans } from '../data/plans';
import { useStore } from '../store/useStore';
import { addDeposit } from '../services/kvService';
import { logActivity } from '../services/activityService';
import { QRCodeSVG } from 'qrcode.react';
import Toast from '../components/Toast';
import { IconDeposit } from '../components/PremiumIcons';

const Deposit = () => {
  const { user, showNotification } = useStore();
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [network, setNetwork] = useState('BEP20');
  const [txHash, setTxHash] = useState('');
  const [amount, setAmount] = useState(selectedPlan.minDeposit);
  const [submitting, setSubmitting] = useState(false);

  const wallet = wallets[network];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!txHash.trim()) {
      showNotification('Transaction hash required', 'error');
      return;
    }
    if (parseFloat(amount) < selectedPlan.minDeposit) {
      showNotification(`Minimum deposit $${selectedPlan.minDeposit}`, 'error');
      return;
    }
    setSubmitting(true);
    try {
      await addDeposit({
        userId: user.id,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amount: parseFloat(amount),
        network,
        txHash,
      });
      // Log activity INSIDE async function
      await logActivity(user.id, 'deposit', { amount: parseFloat(amount), plan: selectedPlan.name });
      showNotification('Deposit submitted! Awaiting admin approval.', 'success');
      setTxHash('');
    } catch (error) {
      showNotification('Failed to submit deposit', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Toast />
      <h1 className="text-3xl font-heading text-platinum mb-6 flex items-center gap-3">
        <IconDeposit className="w-8 h-8" />
        Deploy a Turbine
      </h1>
      <p className="text-pearl/40">Choose a plan and send USDT to the address below.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <button
            key={plan.id}
            onClick={() => { setSelectedPlan(plan); setAmount(plan.minDeposit); }}
            className={`glass-sm text-left transition-all ${
              selectedPlan.id === plan.id ? 'border-platinum ring-2 ring-platinum/30' : 'border-transparent'
            }`}
          >
            <span className="text-2xl">{plan.icon}</span>
            <h3 className="font-bold mt-1">{plan.name}</h3>
            <p className="text-xs text-pearl/40">{plan.dailyYield}% daily · {plan.days}d</p>
            <p className="text-xs text-rosegold mt-1">ROI {plan.roi}%</p>
          </button>
        ))}
      </div>

      <div className="glass flex flex-wrap items-center gap-4">
        <span className="text-pearl/60 font-medium">Network:</span>
        {Object.keys(wallets).map(n => (
          <button key={n} onClick={() => setNetwork(n)} className={`px-4 py-2 rounded-full text-sm ${network === n ? 'bg-platinum text-sapphire font-bold' : 'bg-sapphire-light text-pearl/60'}`}>{n}</button>
        ))}
      </div>

      <div className="glass flex flex-col md:flex-row items-center gap-6">
        <div className="bg-white p-3 rounded-xl"><QRCodeSVG value={wallet} size={160} bgColor="#ffffff" fgColor="#0A0E27" /></div>
        <div className="flex-1">
          <p className="text-sm text-pearl/40">Send <strong className="text-pearl">${amount} USDT</strong> to:</p>
          <div className="bg-sapphire-light p-2 rounded mt-1 break-all text-xs font-mono text-pearl/60">{wallet}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass space-y-4">
        <div>
          <label className="block text-sm text-pearl/40 mb-1">Amount (min ${selectedPlan.minDeposit})</label>
          <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3 text-pearl" required />
        </div>
        <div>
          <label className="block text-sm text-pearl/40 mb-1">Transaction Hash</label>
          <input type="text" value={txHash} onChange={e => setTxHash(e.target.value)} placeholder="Paste TX hash from wallet" className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3 text-pearl" required />
        </div>
        <button disabled={submitting} className="btn-premium w-full">
          {submitting ? 'Submitting...' : 'Submit Deposit'}
        </button>
      </form>
    </div>
  );
};

export default Deposit;
