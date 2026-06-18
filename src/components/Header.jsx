import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Header = () => {
  const { user, logout } = useStore();
  return (
    <header className="fixed top-0 left-0 right-0 bg-sapphire/80 backdrop-blur-md border-b border-platinum/10 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <span className="text-xl font-display font-bold text-platinum">AQUA VAULT</span>
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-pearl/60 hidden sm:block">{user.email}</span>
            <button onClick={logout} className="text-xs text-pearl/40 hover:text-rosegold transition">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
