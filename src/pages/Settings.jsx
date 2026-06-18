import { useState } from 'react';
import { useStore } from '../store/useStore';
import { updateUser } from '../services/kvService';

const Settings = () => {
  const { user, setUser } = useStore();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const changePassword = async (e) => {
    e.preventDefault();
    if (oldPassword !== user.password) return setMessage('Old password incorrect');
    await updateUser(user.id, { password: newPassword });
    setUser({ ...user, password: newPassword });
    setMessage('Password updated.');
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-heading text-cyan">Settings</h1>
      <div className="glass">
        <h2 className="text-lg font-semibold mb-3">Change Password</h2>
        <form onSubmit={changePassword} className="space-y-3">
          <input type="password" placeholder="Old password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full bg-navy border border-cyan/30 rounded-lg p-2" required />
          <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-navy border border-cyan/30 rounded-lg p-2" required />
          <button className="w-full bg-cyan text-navy py-2 rounded-full font-bold">Update Password</button>
        </form>
        {message && <p className="text-green-400 text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
};
export default Settings;
