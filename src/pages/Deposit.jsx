import { useState } from 'react';
import { wallets } from '../config/wallets';
import { plans } from '../data/plans';
import { useStore } from '../store/useStore';
import { addDeposit } from '../services/kvService';
import { QRCodeSVG } from 'qrcode.react';
import Toast from '../components/Toast';

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
    await addDeposit({
      userId: user.id,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      amount: parseFloat(amount),
      network,
      txHash,
    });
    setSubmitting(false);
    showNotification('Deposit submitted! Awaiting admin approval.', 'success');
    setTxHash('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Toast />
      <h1 className="text-3xl font-heading text-cyan">Deploy a Turbine</h1>
      <p className="text-gray-400">Choose a plan and send USDT to the address below.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <button
            key={plan.id}
            onClick={() => { setSelectedPlan(plan); setAmount(plan.minDeposit); }}
            className={`glass-sm text-left transition-all ${
              selectedPlan.id === plan.id ? 'border-cyan ring-2 ring-cyan/30' : 'border-transparent'
            }`}
          >
            <span className="text-2xl">{plan.icon}</span>
            <h3 className="font-bold mt-1">{plan.name}</h3>
            <p className="text-xs text-gray-400">{plan.dailyYield}% daily · {plan.days}d</p>
            <p className="text-xs text-gold mt-1">ROI {plan.roi}%</p>
          </button>
        ))}
      </div>

      <div className="glass flex flex-wrap items-center gap-4">
        <span className="text-gray-300 font-medium">Network:</span>
        {Object.keys(wallets).map(n => (
          <button key={n} onClick={() => setNetwork(n)} className={`px-4 py-2 rounded-full text-sm ${network === n ? 'bg-cyan text-navy font-bold' : 'bg-gray-700'}`}>{n}</button>
        ))}
      </div>

      <div className="glass flex flex-col md:flex-row items-center gap-6">
        <div className="bg-white p-3 rounded-xl"><QRCodeSVG value={wallet} size={160} bgColor="#ffffff" fgColor="#0A0F2C" /></div>
        <div className="flex-1">
          <p className="text-sm text-gray-400">Send <strong className="text-white">${amount} USDT</strong> to:</p>
          <div className="bg-gray-800 p-2 rounded mt-1 break-all text-xs font-mono">{wallet}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Amount (min ${selectedPlan.minDeposit})</label>
          <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-navy border border-cyan/30 rounded-lg p-3" required />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Transaction Hash</label>
          <input type="text" value={txHash} onChange={e => setTxHash(e.target.value)} placeholder="Paste TX hash from wallet" className="w-full bg-navy border border-cyan/30 rounded-lg p-3" required />
        </div>
        <button disabled={submitting} className="w-full bg-cyan text-navy font-bold py-3 rounded-full hover:bg-gold transition disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit Deposit'}
        </button>
      </form>
    </div>
  );
};
export default Deposit;
