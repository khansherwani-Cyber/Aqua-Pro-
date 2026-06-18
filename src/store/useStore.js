import { create } from 'zustand';
import { getUserByEmail, createUser } from '../services/kvService';

export const useStore = create((set, get) => ({
  user: null,
  isAdmin: false,
  notification: null,

  showNotification: (msg, type = 'info') => set({ notification: { msg, type } }),
  clearNotification: () => set({ notification: null }),

  login: async (email, password) => {
    const user = await getUserByEmail(email);
    if (!user) return { success: false, message: 'No account found' };
    if (user.password !== password) return { success: false, message: 'Incorrect password' };
    set({ user, isAdmin: email === 'admin@aquavault.com' });
    return { success: true };
  },

  register: async (name, email, password, refCode) => {
    const exists = await getUserByEmail(email);
    if (exists) return { success: false, message: 'Email already registered' };
    let referredBy = null;
    if (refCode) {
      const { getUsers } = await import('../services/kvService');
      const users = await getUsers();
      const refUser = users.find(u => u.referralCode === refCode);
      if (refUser) referredBy = refUser.id;
    }
    const newUser = await createUser({ name, email, password, referredBy });
    if (!newUser) return { success: false, message: 'Registration failed' };
    set({ user: newUser, isAdmin: email === 'admin@aquavault.com' });
    return { success: true };
  },

  logout: () => set({ user: null, isAdmin: false }),
  refreshUser: async () => {
    const { user } = get();
    if (!user) return;
    const fresh = await getUserByEmail(user.email);
    if (fresh) set({ user: fresh, isAdmin: fresh.email === 'admin@aquavault.com' });
  },
  setUser: (user) => set({ user, isAdmin: user?.email === 'admin@aquavault.com' }),
}));
