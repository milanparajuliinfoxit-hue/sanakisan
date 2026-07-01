import { Outlet } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useSelector } from 'react-redux';

const SharedLayout = () => {

  const { access_token } = useSelector(state => state.auth);

  if (!access_token) {
    window.location.href = '/login';
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="w-1/6 bg-gray-800 overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-10  shadow-md">
          <Navbar />
        </div>
        <div className="flex-1 overflow-y-auto m-2 rounded-md text-justify h-full w-full bg-slate-50">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default SharedLayout