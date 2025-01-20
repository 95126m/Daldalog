import { Outlet } from 'react-router-dom';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
