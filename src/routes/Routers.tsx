import { createBrowserRouter} from 'react-router-dom';
import { path } from '@/constants/path';
import Signin from '@/pages/Signin';
import Home from '@/pages/Home';
import Write from '@/pages/Write';
import Detail from '@/pages/Detail';
import Edit from '@/pages/Edit';

const router = createBrowserRouter([
  {
    path: path.root,
    element: <Home />,
  },
  {path: path.signin, element: <Signin />},
  {path: path.write, element: <Write />},
  {path: path.detail, element: <Detail />},
  {path: path.edit, element: <Edit />}
]);

export default router;
