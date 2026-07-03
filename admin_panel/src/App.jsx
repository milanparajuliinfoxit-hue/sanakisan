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
  Gallery
} from "./pages";
import Holiday from "./pages/Holiday";
import BadaPatra from "./pages/BadaPatra";
import GalleryAlbum from "./pages/GalleryAlbum";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <SharedLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/press-release", element: <PressRelease /> },
      { path: "/events", element: <Events /> },
      { path: "/notice", element: <Notice /> },
      { path: "/teams", element: <Team /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/gallery/:eventName", element: <GalleryAlbum /> },
      { path: "/holiday", element: <Holiday /> },
      { path: "/bada-patra", element: <BadaPatra /> },
    ],
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
