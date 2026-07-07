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
  PanelLeftClose,
  PanelLeftOpen,
  Briefcase,
  Users2,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import PropTypes from "prop-types";

const SIDEBAR_KEY = "sidebar_collapsed";

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
  { href: "/messages", icon: MessageSquare, label: "Messages" },
  { href: "/holiday", icon: Gift, label: "Holiday" },
  { href: "/bada-patra", icon: FileText, label: "बडा पत्र" },
];

const childShape = PropTypes.shape({
  href: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
});

NavGroup.propTypes = {
  item: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(childShape).isRequired,
  }).isRequired,
  pathname: PropTypes.string.isRequired,
  collapsed: PropTypes.bool.isRequired,
  defaultOpen: PropTypes.bool,
};

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
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_KEY) === "true"
  );

  const toggle = () => {
    setCollapsed((v) => {
      localStorage.setItem(SIDEBAR_KEY, String(!v));
      return !v;
    });
  };

  return (
    <aside
      className={cn(
        "sidebar-gradient flex flex-col h-screen sticky top-0 transition-all duration-250 ease-in-out",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* ── Sidebar Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between h-[56px] flex-shrink-0 px-4 border-b border-border">

        {/* Logo + wordmark */}
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
          {/* Logo mark — always visible, fixed size */}
          <div className="flex-shrink-0 w-[32px] h-[32px] rounded-[8px] bg-primary/10 flex items-center justify-center overflow-hidden">
            <img src="/jalthal.png" className="w-[22px] h-[22px] object-contain" alt="Logo" />
          </div>

          {/* Wordmark — fades + clips when collapsed, gap collapses with it */}
          <span
            className={cn(
              "text-[11.5px] font-semibold text-foreground leading-snug whitespace-nowrap overflow-hidden",
              "transition-[opacity,max-width,margin] duration-200 ease-in-out",
              collapsed ? "opacity-0 max-w-0 ml-0" : "opacity-100 max-w-[160px]"
            )}
          >
            साना किसान कृषि<br />सहकारी संस्था लि.
          </span>
        </div>

        {/* Collapse / expand button — always at far right, never moves */}
        <button
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex-shrink-0 flex items-center justify-center",
            "w-[34px] h-[34px] rounded-[8px]",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-accent",
            "transition-colors duration-150 ease-in-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            "cursor-pointer"
          )}
        >
          {collapsed
            ? <PanelLeftOpen className="w-[18px] h-[18px]" />
            : <PanelLeftClose className="w-[18px] h-[18px]" />
          }
        </button>
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
    </aside>
  );
};

export default Sidebar;
