import { useNavigate } from "react-router-dom";
import { useGetDashboardStatsQuery } from "@/redux/api/dashboardApi";
import {
  Newspaper,
  Bell,
  CalendarDays,
  Users,
  TrendingUp,
  Activity,
  Clock,
  Images,
  Gift,
  Briefcase,
  Users2,
  AlertCircle,
} from "lucide-react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
        color === "blue" && "bg-blue-100 text-blue-600",
        color === "green" && "bg-green-100 text-green-600",
        color === "amber" && "bg-amber-100 text-amber-600",
        color === "purple" && "bg-purple-100 text-purple-600",
        color === "red" && "bg-red-100 text-red-600",
        color === "indigo" && "bg-indigo-100 text-indigo-600",
        color === "pink" && "bg-pink-100 text-pink-600",
        color === "teal" && "bg-teal-100 text-teal-600",
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold text-foreground leading-none">{value ?? 0}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground/70 truncate">{subtitle}</p>}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.elementType,
  color: PropTypes.string,
  subtitle: PropTypes.string,
};

function StatSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-muted flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-10 bg-muted rounded" />
        <div className="h-3 w-20 bg-muted rounded" />
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, to, color }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all duration-200 text-sm font-medium text-foreground w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center",
        color === "blue" && "bg-blue-100 text-blue-600",
        color === "amber" && "bg-amber-100 text-amber-600",
        color === "green" && "bg-green-100 text-green-600",
        color === "purple" && "bg-purple-100 text-purple-600",
        color === "indigo" && "bg-indigo-100 text-indigo-600",
        color === "teal" && "bg-teal-100 text-teal-600",
        !color && "bg-primary/10 text-primary",
      )}>
        <Icon className="w-4 h-4" />
      </div>
      {label}
    </button>
  );
}

QuickAction.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string,
  to: PropTypes.string,
  color: PropTypes.string,
};

export default function Dashboard() {
  const { data: res, isLoading, isError } = useGetDashboardStatsQuery();
  const stats = res?.data;

  const statCards = stats
    ? [
        { title: "Press Releases", value: stats.pressReleases.total, icon: Newspaper, color: "blue", subtitle: `${stats.pressReleases.published} published` },
        { title: "Notices", value: stats.notices.total, icon: Bell, color: "amber", subtitle: `${stats.notices.active} active` },
        { title: "Events", value: stats.events.total, icon: CalendarDays, color: "green", subtitle: "Total events" },
        { title: "Team Members", value: stats.members.total, icon: Users, color: "purple", subtitle: "Active members" },
        { title: "Committee Types", value: stats.committeeTypes.total, icon: Users2, color: "indigo", subtitle: "Active types" },
        { title: "Positions", value: stats.committeePositions.total, icon: Briefcase, color: "teal", subtitle: "Active positions" },
        { title: "Gallery Images", value: stats.gallery.total, icon: Images, color: "pink", subtitle: "Total images" },
        { title: "Holidays", value: stats.holidays.total, icon: Gift, color: "red", subtitle: "Total holidays" },
      ]
    : [];

  const quickActions = [
    { icon: Newspaper, label: "New Press Release", to: "/press-release", color: "blue" },
    { icon: Bell, label: "New Notice", to: "/notice", color: "amber" },
    { icon: CalendarDays, label: "New Event", to: "/events", color: "green" },
    { icon: Users, label: "Add Team Member", to: "/teams", color: "purple" },
    { icon: Images, label: "Add Gallery Image", to: "/gallery", color: "pink" },
    { icon: Gift, label: "Add Holiday", to: "/holiday", color: "red" },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to the admin panel. Here&apos;s an overview of your site.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Failed to load dashboard statistics. Please refresh the page.
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <StatSkeleton key={i} />)
          : statCards.map((card) => <StatCard key={card.title} {...card} />)
        }
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Overview */}
        <div className="lg:col-span-2 rounded-xl border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              System Overview
            </h2>
          </div>
          <div className="p-5">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 animate-pulse">
                    <div className="w-9 h-9 rounded-lg bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-24 bg-muted rounded" />
                      <div className="h-4 w-12 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Total Content", value: (stats?.pressReleases.total ?? 0) + (stats?.notices.total ?? 0) + (stats?.events.total ?? 0), icon: Activity, color: "indigo" },
                  { label: "Team Size", value: stats?.members.total ?? 0, icon: Users, color: "purple" },
                  { label: "Committee Types", value: stats?.committeeTypes.total ?? 0, icon: Users2, color: "teal" },
                  { label: "System Status", value: "Active", icon: TrendingUp, color: "green" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                      item.color === "indigo" && "bg-indigo-100 text-indigo-600",
                      item.color === "purple" && "bg-purple-100 text-purple-600",
                      item.color === "teal" && "bg-teal-100 text-teal-600",
                      item.color === "green" && "bg-green-100 text-green-600",
                    )}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Quick Actions
            </h2>
          </div>
          <div className="p-5 space-y-2">
            {quickActions.map((action) => (
              <QuickAction key={action.to} {...action} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
