import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Farm from './pages/Farm';
import Harvest from './pages/Harvest';
import Withdraw from './pages/Withdraw';
import Reinvest from './pages/Reinvest';
import Team from './pages/Team';
import Bonuses from './pages/Bonuses';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Leaderboard from './pages/Leaderboard';
import ActivityLog from './pages/ActivityLog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
          <Route path="farm" element={<ProtectedRoute><Farm /></ProtectedRoute>} />
          <Route path="harvest" element={<ProtectedRoute><Harvest /></ProtectedRoute>} />
          <Route path="withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path="reinvest" element={<ProtectedRoute><Reinvest /></ProtectedRoute>} />
          <Route path="team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
          <Route path="bonuses" element={<ProtectedRoute><Bonuses /></ProtectedRoute>} />
          <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="activity" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
