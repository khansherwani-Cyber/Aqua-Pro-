import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};
export default ProtectedRoute;
