import { useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import GlobalStyles from '@/styles/GlobalStyles';
import router from '@/routes/Routers';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import useAuthStore from '@/store/AuthContext';
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const auth = useMemo(() => getAuth(), []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth, setUser]);

  return (
    <>
      <GlobalStyles />
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </>
  );
}

export default App;
