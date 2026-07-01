import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import {
  Dashboard,
  Events,
  Login,
  Notice,
  PressRelease,
  SharedLayout,
  Team,
  Gallery // 
} from "./pages";
import Holiday from "./pages/Holiday";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <SharedLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/press-release",
        element: <PressRelease />,
      },
      {
        path: "/events",
        element: <Events />,
      },
      {
        path: "/notice",
        element: <Notice />,
      },
      {
        path: "/teams",
        element: <Team />,
      },
      {
        path: "/gallery", // 
        element: <Gallery />,
      },
      {
        path: "/holiday",
        element: <Holiday/>
      }
    ],
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
