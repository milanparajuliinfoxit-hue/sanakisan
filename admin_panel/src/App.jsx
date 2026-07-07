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
import CommitteeTypes from "./pages/CommitteeTypes";
import CommitteePositions from "./pages/CommitteePositions";
import Messages from "./pages/Messages";
import MessageDetail from "./pages/MessageDetail";

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
      { path: "/committee-types", element: <CommitteeTypes /> },
      { path: "/committee-positions", element: <CommitteePositions /> },
      { path: "/messages", element: <Messages /> },
      { path: "/messages/:id", element: <MessageDetail /> },
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
