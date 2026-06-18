import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Toast from '../components/Toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [searchParams] = useSearchParams();
  const [refCode, setRefCode] = useState(searchParams.get('ref') || '');
  const [loading, setLoading] = useState(false);
  const register = useStore(s => s.register);
  const showNotification = useStore(s => s.showNotification);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return showNotification('Passwords do not match', 'error');
    if (password.length < 6) return showNotification('Password must be 6+ chars', 'error');
    setLoading(true);
    const result = await register(name, email, password, refCode);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else showNotification(result.message, 'error');
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Toast />
      <div className="glass">
        <h1 className="text-3xl font-heading text-platinum mb-6 text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3" required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3" required />
          <input type="password" placeholder="Password (min 6)" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3" required />
          <input type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3" required />
          <input type="text" placeholder="Referral Code (optional)" value={refCode} onChange={e => setRefCode(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3" />
          <button type="submit" disabled={loading} className="btn-premium w-full">{loading ? 'Creating...' : 'Register'}</button>
          <p className="text-center text-pearl/40 text-sm">Have an account? <Link to="/login" className="text-platinum hover:underline">Login</Link></p>
        </form>
      </div>
    </div>
  );
};
export default Register;
