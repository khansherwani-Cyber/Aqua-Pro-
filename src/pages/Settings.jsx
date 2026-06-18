import { useState } from 'react';
import { useStore } from '../store/useStore';
import { updateUser } from '../services/kvService';
import Toast from '../components/Toast';

const Settings = () => {
  const { user, setUser, showNotification } = useStore();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const changePassword = async (e) => {
    e.preventDefault();
    if (oldPassword !== user.password) return showNotification('Old password incorrect', 'error');
    await updateUser(user.id, { password: newPassword });
    setUser({ ...user, password: newPassword });
    showNotification('Password updated', 'success');
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Toast />
      <h1 className="text-3xl font-heading text-platinum">Settings</h1>
      <div className="glass">
        <h2 className="text-lg font-semibold mb-3">Change Password</h2>
        <form onSubmit={changePassword} className="space-y-3">
          <input type="password" placeholder="Old password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3" required />
          <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-sapphire border border-platinum/20 rounded-xl p-3" required />
          <button className="btn-premium w-full">Update Password</button>
        </form>
      </div>
    </div>
  );
};
export default Settings;
