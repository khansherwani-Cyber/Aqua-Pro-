import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useStore();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-heading text-platinum">Profile</h1>
      <div className="glass space-y-3">
        <div className="flex justify-between"><span className="text-pearl/40">Name</span><span>{user.name}</span></div>
        <div className="flex justify-between"><span className="text-pearl/40">Email</span><span>{user.email}</span></div>
        <div className="flex justify-between"><span className="text-pearl/40">Referral Code</span><span className="font-mono text-platinum">{user.referralCode}</span></div>
        <div className="flex justify-between"><span className="text-pearl/40">Total Deposited</span><span>${(user.totalDeposited || 0).toFixed(2)}</span></div>
      </div>
      <Link to="/settings" className="block glass text-center py-3 text-platinum hover:bg-platinum/5">Settings</Link>
      {user.email === 'admin@aquavault.com' && (
        <Link to="/admin" className="block w-full bg-rosegold text-sapphire text-center py-3 rounded-full font-bold">Admin Panel</Link>
      )}
      <button onClick={logout} className="w-full bg-red-500/20 text-red-400 py-3 rounded-full hover:bg-red-500/30">Logout</button>
    </div>
  );
};
export default Profile;
