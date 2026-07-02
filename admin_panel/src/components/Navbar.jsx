import { userInfo } from "@/redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, ChevronRight, Home } from "lucide-react";
import { persist } from "@/redux/store";
import { setCredentials } from "@/redux/slice/authSlice";
import { cn } from "@/lib/utils";

const pageTitles = {
  "/": "Dashboard",
  "/press-release": "Press Releases",
  "/notice": "Notices",
  "/events": "Events",
  "/teams": "Team Members",
  "/gallery": "Gallery",
  "/holiday": "Holidays",
  "/bada-patra": "नागरिक बडा पत्र",
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector(userInfo);
  const currentTitle = pageTitles[pathname] || "Dashboard";

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

  const breadcrumbs = [
    { label: "Home", href: "/", icon: Home },
    ...(pathname !== "/" ? [{ label: currentTitle, href: pathname }] : []),
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              {crumb.icon && (
                <crumb.icon className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "font-medium",
                  idx === breadcrumbs.length - 1
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                )}
                onClick={() => idx < breadcrumbs.length - 1 && navigate(crumb.href)}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-tight">
                {user?.fullname || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
