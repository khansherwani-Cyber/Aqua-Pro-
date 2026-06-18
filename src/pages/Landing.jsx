import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const stats = [
  { label: 'Total Deposits', value: 12456789, prefix: '$' },
  { label: 'Active Turbines', value: 4823, prefix: '' },
  { label: 'USDT Paid Out', value: 1234567, prefix: '$' },
];

const Landing = () => {
  const [animated, setAnimated] = useState(stats.map(s => ({ ...s, current: 0 })));

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimated(prev => prev.map((s, i) => ({
        ...s,
        current: Math.min(s.current + Math.ceil(stats[i].value / 50), stats[i].value),
      })));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 min-h-screen">
      <h1 className="text-6xl md:text-8xl font-display font-black text-platinum animate-float-slow mb-6">
        AQUA VAULT
      </h1>
      <p className="text-xl text-pearl/60 mb-8 max-w-2xl">
        Premium ocean-powered earnings. Deposit USDT, deploy turbines, harvest up to <span className="text-rosegold font-semibold">2.2% daily</span>.
      </p>
      <div className="flex gap-4 mb-16">
        <Link to="/register" className="btn-premium text-lg px-10">Start Earning</Link>
        <Link to="/login" className="btn-outline-premium text-lg px-10">Login</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-20">
        {animated.map(stat => (
          <div key={stat.label} className="glass text-center">
            <span className="text-4xl font-heading text-platinum">{stat.prefix}{stat.current.toLocaleString()}</span>
            <p className="text-pearl/40 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mb-20">
        <h2 className="text-3xl font-heading text-platinum mb-8">Premium Bonuses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass text-center">
            <span className="text-4xl">🎁</span>
            <h3 className="text-xl font-semibold mt-2">First Wave</h3>
            <p className="text-pearl/40 text-sm mt-1">Free 15-day plan with $50+ deposit</p>
          </div>
          <div className="glass text-center">
            <span className="text-4xl">⚡</span>
            <h3 className="text-xl font-semibold mt-2">Power Surge</h3>
            <p className="text-pearl/40 text-sm mt-1">2% extra when reinvesting</p>
          </div>
          <div className="glass text-center">
            <span className="text-4xl">👥</span>
            <h3 className="text-xl font-semibold mt-2">Fleet Builder</h3>
            <p className="text-pearl/40 text-sm mt-1">5% + 2% referral commissions</p>
          </div>
        </div>
      </div>

      <p className="text-pearl/20 text-sm pb-8">© 2025 Aqua Vault. All rights reserved.</p>
    </div>
  );
};
export default Landing;
