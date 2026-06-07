import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaNewspaper,
  FaBell,
  FaCalendarAlt,
  FaImages,
} from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

const navLinks = [
  { href: "/", icon: FaHome, label: "Home" },
  { href: "/press-release", icon: FaNewspaper, label: "Press Release" },
  { href: "/notice", icon: FaBell, label: "Notice" },
  { href: "/events", icon: FaCalendarAlt, label: "Events" },
  { href: "/teams", icon: FaUserGroup, label: "Members" },
  { href: "/gallery", icon: FaImages, label: "Gallery" },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col px-2 min-h-screen sticky overflow-y-auto bg-slate-200">
      <div className="flex flex-row justify-center items-center py-2 gap-2">
        <img src="/jalthal.png" className="size-12" alt="Jalthal Logo" />
        <div className="font-display text-primary-800 font-bold text-lg leading-tight">
          साना किसान कृषि सहकारी संस्था लि.
        </div>
      </div>
      <hr className="bg-white h-[2px] rounded-full" />
      <nav className="flex flex-col mt-4 space-y-2">
        {navLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            to={href}
            className={`flex items-center px-4 py-2 font-medium text-lg rounded-md ${
              pathname === href
                ? "bg-gray-950 text-white"
                : "hover:bg-gray-900 hover:text-white"
            }`}
          >
            <Icon className="mr-3 size-7" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
