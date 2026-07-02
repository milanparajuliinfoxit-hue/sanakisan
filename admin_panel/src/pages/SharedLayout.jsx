import { Outlet } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SharedLayout = () => {
  const { access_token } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!access_token) {
      navigate('/login', { replace: true });
    }
  }, [access_token, navigate]);

  if (!access_token) return null;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SharedLayout
