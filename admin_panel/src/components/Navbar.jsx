import { setCredentials, userInfo } from "@/redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { persist } from "@/redux/store";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(userInfo);

  const handleLogout = () => {
    const data = {
      refresh_token: null,
      access_token: null,
      userInfo: {},
    };
    dispatch(setCredentials(data));
    persist.purge();
    navigate("/login");
  };

  return (
    <div className="flex justify-between h-16 bg-slate-200 items-center px-4 ">
      <h1 className="text-2xl font-medium">Dashboard</h1>

      {/* ✅ Changed outer <button> to <div> to avoid invalid nesting */}
      <div className="flex gap-2 justify-end items-center px-2 py-1 rounded-md mr-4">
        <h1 className="flex font-semibold gap-3 text-slate-500">
          <FaRegUserCircle size={25} />
          <span>{user.fullname}</span>
        </h1>

        <button className="flex items-center" onClick={handleLogout}>
          <span>
            <CiLogout size={20} className="mr-1" />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
