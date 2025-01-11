import { createBrowserRouter} from 'react-router-dom';
import { path } from '@/constants/path';
import Signin from '@/pages/Signin';
import Home from '@/pages/Home';

const router = createBrowserRouter([
  {
    path: path.root,
    element: <Home />,
  },
  {path: path.signin, element: <Signin />}
]);

export default router;
