import { useEffect, useState } from "react";
import { useGetPressMutation } from "@/redux/api/pressApi";
import { useGetNoticePaginationMutation } from "@/redux/api/noticeApi";
import { useGetEventPaginationMutation } from "@/redux/api/eventApi";
import { useGetMemberPaginationMutation } from "@/redux/api/memberApi";
import {
  Newspaper,
  Bell,
  CalendarDays,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
} from "lucide-react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

function StatCard({ title, value, icon: Icon, trend, trendUp, color, subtitle }) {
  return (
    <div className="group relative rounded-xl border bg-card p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          color === "blue" && "bg-blue-100 text-blue-600",
          color === "green" && "bg-green-100 text-green-600",
          color === "amber" && "bg-amber-100 text-amber-600",
          color === "purple" && "bg-purple-100 text-purple-600",
          color === "red" && "bg-red-100 text-red-600",
          color === "indigo" && "bg-indigo-100 text-indigo-600",
        )}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <span className={cn(
            "inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full",
            trendUp
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          )}>
            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
      )}
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.elementType,
  trend: PropTypes.number,
  trendUp: PropTypes.bool,
  color: PropTypes.string,
  subtitle: PropTypes.string,
};

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all duration-200 text-sm font-medium text-foreground w-full"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="w-4 h-4" />
      </div>
      {label}
    </button>
  );
}

QuickAction.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

export default function Dashboard() {
  const [getPress] = useGetPressMutation();
  const [getNoticePagination] = useGetNoticePaginationMutation();
  const [getEventPagination] = useGetEventPaginationMutation();
  const [getMemberPagination] = useGetMemberPaginationMutation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [pressRes, noticeRes, eventRes, memberRes] = await Promise.all([
        getPress(new URLSearchParams({ page: 1, limit: 1, publish_status: '', status: 1 })),
        getNoticePagination(new URLSearchParams({ page: 1, limit: 1, publish_status: '' })),
        getEventPagination(new URLSearchParams({ page: 1, limit: 1, publish_status: '' })),
        getMemberPagination(),
      ]);

      setStats({
        pressReleases: pressRes?.data?.data?.total || pressRes?.data?.data?.data?.length || 0,
        notices: noticeRes?.data?.data?.total || noticeRes?.data?.data?.data?.length || 0,
        events: eventRes?.data?.data?.total || eventRes?.data?.data?.data?.length || 0,
        members: memberRes?.data?.data?.total || memberRes?.data?.data?.data?.length || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border bg-card p-5 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-muted" />
                  <div className="w-14 h-5 rounded-full bg-muted" />
                </div>
                <div className="h-8 w-16 bg-muted rounded mb-1" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Press Releases"
              value={stats?.pressReleases || 0}
              icon={Newspaper}
              color="blue"
              trend={12}
              trendUp
              subtitle="Published articles"
            />
            <StatCard
              title="Notices"
              value={stats?.notices || 0}
              icon={Bell}
              color="amber"
              trend={8}
              trendUp
              subtitle="Active notices"
            />
            <StatCard
              title="Events"
              value={stats?.events || 0}
              icon={CalendarDays}
              color="green"
              trend={5}
              trendUp
              subtitle="Upcoming events"
            />
            <StatCard
              title="Team Members"
              value={stats?.members || 0}
              icon={Users}
              color="purple"
              trend={3}
              trendUp
              subtitle="Active members"
            />
          </>
        )}
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-2 rounded-xl border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Recent Activity
            </h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {[
                { icon: Newspaper, text: "Press releases are managed here", time: "Content module", color: "blue" },
                { icon: Bell, text: "Notices are published from the Notice section", time: "Content module", color: "amber" },
                { icon: CalendarDays, text: "Events can be created and managed", time: "Content module", color: "green" },
                { icon: Users, text: "Team members are listed in Members section", time: "Management", color: "purple" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    item.color === "blue" && "bg-blue-100 text-blue-600",
                    item.color === "amber" && "bg-amber-100 text-amber-600",
                    item.color === "green" && "bg-green-100 text-green-600",
                    item.color === "purple" && "bg-purple-100 text-purple-600",
                  )}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
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
            <QuickAction icon={Newspaper} label="New Press Release" />
            <QuickAction icon={Bell} label="New Notice" />
            <QuickAction icon={CalendarDays} label="New Event" />
            <QuickAction icon={Users} label="Add Team Member" />
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-foreground">System Overview</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Content Items", value: (stats?.pressReleases || 0) + (stats?.notices || 0) + (stats?.events || 0), icon: Activity, color: "indigo" },
              { label: "Team Size", value: stats?.members || 0, icon: Users, color: "purple" },
              { label: "Content Modules", value: 4, icon: Newspaper, color: "blue" },
              { label: "System Status", value: "Active", icon: TrendingUp, color: "green" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  item.color === "indigo" && "bg-indigo-100 text-indigo-600",
                  item.color === "purple" && "bg-purple-100 text-purple-600",
                  item.color === "blue" && "bg-blue-100 text-blue-600",
                  item.color === "green" && "bg-green-100 text-green-600",
                )}>
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
