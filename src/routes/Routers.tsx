import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import Signin from '@/pages/Signin';
import Write from '@/pages/Write';
import Detail from '@/pages/Detail';
import Edit from '@/pages/Edit';
import Layout from '@/layouts/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
    children: [
      { path: '', element: <Home /> }, 
      { path: 'signin', element: <Signin /> }, 
      { path: 'write', element: <Write /> },
      { path: 'detail/:id', element: <Detail /> }, 
      { path: 'edit/:id', element: <Edit /> }, 
    ],
  },
]);

export default router;
