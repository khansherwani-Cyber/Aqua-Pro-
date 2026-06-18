import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Toast from '../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useStore(s => s.login);
  const showNotification = useStore(s => s.showNotification);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else showNotification(result.message, 'error');
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Toast />
      <div className="glass">
        <h1 className="text-3xl font-heading text-platinum mb-6 text-center">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3 text-pearl outline-none" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3 text-pearl outline-none" required />
          <button type="submit" disabled={loading} className="btn-premium w-full">{loading ? 'Signing in...' : 'Login'}</button>
          <p className="text-center text-pearl/40 text-sm">No account? <Link to="/register" className="text-platinum hover:underline">Register</Link></p>
          <p className="text-center text-pearl/20 text-xs">Demo: admin@aquavault.com / admin123</p>
        </form>
      </div>
    </div>
  );
};
export default Login;
