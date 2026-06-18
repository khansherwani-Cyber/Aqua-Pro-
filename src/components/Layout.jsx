import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout = () => (
  <div className="min-h-screen bg-sapphire">
    <Header />
    <div className="container max-w-7xl mx-auto px-4 pt-20 pb-24">
      <Outlet />
    </div>
    <BottomNav />
  </div>
);
export default Layout;
