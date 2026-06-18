import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: '◇', label: 'Home' },
  { to: '/deposit', icon: '⬇', label: 'Deposit' },
  { to: '/farm', icon: '⚡', label: 'Farm' },
  { to: '/harvest', icon: '♦', label: 'Harvest' },
  { to: '/team', icon: '◈', label: 'Team' },
];

const BottomNav = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-sapphire/95 backdrop-blur-md border-t border-platinum/10 flex justify-around py-2 z-50">
      {navItems.map(item => {
        const active = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center text-xs transition ${active ? 'text-platinum scale-110' : 'text-pearl/40 hover:text-pearl/60'}`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
export default BottomNav;
