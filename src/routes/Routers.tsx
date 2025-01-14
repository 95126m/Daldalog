import { createBrowserRouter} from 'react-router-dom';
import { path } from '@/constants/path';
import Signin from '@/pages/Signin';
import Home from '@/pages/Home';
import Write from '@/pages/Write';

const router = createBrowserRouter([
  {
    path: path.root,
    element: <Home />,
  },
  {path: path.signin, element: <Signin />},
  {path: path.write, element: <Write />}
]);

export default router;
