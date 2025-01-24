import { useEffect} from 'react';
import { RouterProvider } from 'react-router-dom';
import GlobalStyles from '@/styles/GlobalStyles';
import router from '@/routes/Routers';
import { onAuthStateChanged} from 'firebase/auth';
import { auth } from '@/api/firebaseApp'; 
import useAuthStore from '@/store/AuthContext';

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
