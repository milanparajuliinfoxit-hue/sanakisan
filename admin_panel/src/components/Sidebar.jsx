import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Bell,
  CalendarDays,
  Users,
  Images,
  Gift,
  FileText,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Users2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/press-release", icon: Newspaper, label: "Press Release" },
  { href: "/notice", icon: Bell, label: "Notice" },
  { href: "/events", icon: CalendarDays, label: "Events" },
  {
    label: "Committee Management",
    icon: Users,
    group: true,
    children: [
      { href: "/teams", icon: Users2, label: "Members" },
      { href: "/committee-types", icon: Users2, label: "Committee Types" },
      { href: "/committee-positions", icon: Briefcase, label: "Positions" },
    ],
  },
  { href: "/gallery", icon: Images, label: "Gallery" },
  { href: "/holiday", icon: Gift, label: "Holiday" },
  { href: "/bada-patra", icon: FileText, label: "बडा पत्र" },
];

function NavGroup({ item, pathname, collapsed, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const { icon: Icon, label, children } = item;
  const isGroupActive = children.some((c) => pathname === c.href);

  if (collapsed) {
    return (
      <div className="space-y-1">
        {children.map(({ href, icon: CIcon, label: cLabel }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} to={href} title={cLabel}
              className={cn(
                "flex items-center justify-center px-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}>
              <CIcon className="w-5 h-5 flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isGroupActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Icon className="w-4.5 h-4.5 flex-shrink-0" />
        <span className="truncate flex-1 text-left">{label}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-3">
          {children.map(({ href, icon: CIcon, label: cLabel }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} to={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                <CIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{cLabel}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Sidebar = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sidebar-gradient flex flex-col h-screen sticky top-0 overflow-hidden transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 h-16 flex-shrink-0 border-b border-border",
        collapsed && "justify-center px-2"
      )}>
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
          <img src="/jalthal.png" className="w-7 h-7 object-contain" alt="Logo" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground leading-tight truncate">
              साना किसान कृषि सहकारी संस्था लि.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3 space-y-1">
        {navLinks.map((item) => {
          if (item.group) {
            const isGroupActive = item.children.some((c) => pathname === c.href);
            return (
              <NavGroup
                key={item.label}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
                defaultOpen={isGroupActive}
              />
            );
          }
          const { href, icon: Icon, label } = item;
          const isActive = pathname === href || (href === "/gallery" && pathname.startsWith("/gallery"));
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className={cn("flex-shrink-0 transition-all duration-200", collapsed ? "w-5 h-5" : "w-4.5 h-4.5")} />
              {!collapsed && <span className="truncate">{label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="flex-shrink-0 border-t border-white/10 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4.5 h-4.5" />
          ) : (
            <>
              <ChevronLeft className="w-4.5 h-4.5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
