import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Search, X, Trash2, MessageSquare,
  Archive, Eye, ArrowUpDown, ArrowUp, ArrowDown,
  MessageCircle, RefreshCw, Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetContactMessagesQuery,
  useGetContactMessageStatsQuery,
  useUpdateMessageStatusMutation,
  useDeleteContactMessageMutation,
} from "@/redux/api/contactMessageApi";
import ActionMenu from "@/components/ui/ActionMenu";

const statusBadge = (status) => {
  const map = {
    NEW: { label: "NEW", cls: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
    READ: { label: "READ", cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    REPLIED: { label: "REPLIED", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    ARCHIVED: { label: "ARCHIVED", cls: "bg-slate-100 text-slate-500 border-slate-200", dot: "bg-slate-400" },
  };
  const s = map[status] || map.NEW;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", s.cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 animate-pulse">
      <div className="w-8 h-5 bg-muted rounded" />
      <div className="flex-1 h-4 bg-muted rounded w-1/4" />
      <div className="hidden sm:block w-44 h-4 bg-muted rounded" />
      <div className="hidden lg:block w-28 h-4 bg-muted rounded" />
      <div className="hidden md:block flex-1 h-4 bg-muted rounded w-1/3" />
      <div className="w-16 h-5 bg-muted rounded-full" />
      <div className="hidden lg:block w-20 h-4 bg-muted rounded" />
      <div className="w-7 h-7 bg-muted rounded-lg" />
    </div>
  );
}

function DeleteConfirm({ item, onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Archive Message?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Are you sure you want to archive the message from <span className="font-medium text-foreground">"{item.full_name}"</span>? It will be moved to archived.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50 border-t border-border">
          <button onClick={onCancel} disabled={loading}
            className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex items-center gap-2 px-4 h-9 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-all disabled:opacity-50">
            {loading ? "Archiving…" : <><Archive className="w-3.5 h-3.5" /> Archive</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusChangeModal({ item, onClose, onConfirm, loading }) {
  const [selectedStatus, setSelectedStatus] = useState(item.status);
  const statuses = ["NEW", "READ", "REPLIED", "ARCHIVED"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Change Status</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-3">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                selectedStatus === s
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50"
              )}
            >
              <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", selectedStatus === s ? "border-primary" : "border-muted-foreground/40")}>
                {selectedStatus === s && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <div className="flex items-center gap-2">{statusBadge(s)}</div>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/50">
          <button onClick={onClose} disabled={loading}
            className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedStatus)}
            disabled={loading || selectedStatus === item.status}
            className="px-4 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? "Updating…" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("DESC");
  const [statusTarget, setStatusTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [updateMessageStatus] = useUpdateMessageStatusMutation();
  const [deleteContactMessage] = useDeleteContactMessageMutation();

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: statsRes } = useGetContactMessageStatsQuery();
  const stats = statsRes?.data || { total: 0, new: 0, read: 0, replied: 0, archived: 0 };

  const { data: res, isLoading, refetch } = useGetContactMessagesQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    status: statusFilter,
    sortField,
    sortDir,
  });

  const items = res?.data?.data || [];
  const totalPages = res?.data?.totalPages || 1;
  const totalItems = res?.data?.totalItems || 0;

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const handleStatusChange = async (newStatus) => {
    if (!statusTarget) return;
    setUpdatingStatus(true);
    try {
      const res2 = await updateMessageStatus({ id: statusTarget.id, status: newStatus }).unwrap();
      toast.success(res2.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
      setStatusTarget(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res2 = await deleteContactMessage(deleteTarget.id).unwrap();
      toast.success(res2.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to archive.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const SortBtn = ({ field, children }) => {
    const active = sortField === field;
    return (
      <button onClick={() => handleSort(field)}
        className={cn("flex items-center gap-1 text-xs font-medium transition-colors",
          active ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
        {children}
        {active ? (sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-50" />}
      </button>
    );
  };

  const statCards = [
    { label: "Total Messages", value: stats.total, icon: MessageSquare, color: "bg-primary/10 text-primary" },
    { label: "New", value: stats.new, icon: Inbox, color: "bg-blue-100 text-blue-600" },
    { label: "Read", value: stats.read, icon: Eye, color: "bg-amber-100 text-amber-600" },
    { label: "Replied", value: stats.replied, icon: MessageCircle, color: "bg-emerald-100 text-emerald-600" },
    { label: "Archived", value: stats.archived, icon: Archive, color: "bg-slate-100 text-slate-500" },
  ];

  const filterBtns = [
    { label: "All", value: "" },
    { label: "New", value: "NEW" },
    { label: "Read", value: "READ" },
    { label: "Replied", value: "REPLIED" },
    { label: "Archived", value: "ARCHIVED" },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">{totalItems} total messages</p>
        </div>
        <button onClick={() => { refetch(); toast.info("Refreshed."); }}
          className="flex items-center gap-2 px-4 h-10 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", color)}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground leading-none">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-border">
          <div className="relative flex-1 min-w-[200px] max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages…"
              className="w-full pl-9 pr-8 h-9 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {filterBtns.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => { setStatusFilter(value); setPage(1); }}
                className={cn(
                  "px-3 h-8 rounded-lg text-xs font-medium border transition-all",
                  statusFilter === value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground sm:ml-auto">{items.length} of {totalItems}</span>
        </div>

        {/* Column Headers */}
        {!isLoading && items.length > 0 && (
          <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 bg-muted/40 border-b border-border">
            <div className="w-8 flex-shrink-0 text-xs text-muted-foreground">#</div>
            <div className="flex-1 min-w-0"><SortBtn field="full_name">Name</SortBtn></div>
            <div className="hidden sm:block w-44"><SortBtn field="email">Email</SortBtn></div>
            <div className="hidden lg:block w-28">Phone</div>
            <div className="hidden md:block flex-1 min-w-0">Message</div>
            <div className="w-16"><SortBtn field="status">Status</SortBtn></div>
            <div className="hidden lg:block w-20"><SortBtn field="createdAt">Date</SortBtn></div>
            <div className="w-7" />
          </div>
        )}

        {/* Rows */}
        {isLoading ? (
          <div>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {search || statusFilter ? "No Messages Found" : "No Messages Yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
              {search || statusFilter ? "No messages match your search criteria." : "Contact form submissions will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className={cn(
                "flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors group",
                !item.is_read && "bg-primary/[0.02]"
              )}>
                <div className="w-8 flex-shrink-0">
                  {!item.is_read && <div className="w-2 h-2 rounded-full bg-primary mx-auto" title="Unread" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm truncate", item.is_read ? "text-foreground" : "text-foreground font-semibold")}>{item.full_name}</p>
                </div>
                <div className="hidden sm:block w-44 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{item.email}</p>
                </div>
                <div className="hidden lg:block w-28">
                  <p className="text-xs text-muted-foreground truncate">{item.phone || "—"}</p>
                </div>
                <div className="hidden md:block flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{item.message}</p>
                </div>
                <div className="w-16 flex-shrink-0">{statusBadge(item.status)}</div>
                <div className="hidden lg:block w-20 flex-shrink-0">
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <ActionMenu
                    items={[
                      {
                        label: "View",
                        icon: <Eye className="w-3.5 h-3.5 text-muted-foreground" />,
                        onClick: () => navigate(`/messages/${item.id}`),
                        className: "text-foreground hover:bg-muted",
                      },
                      { type: "separator" },
                      {
                        label: "Change Status",
                        icon: <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />,
                        onClick: () => setStatusTarget(item),
                        className: "text-foreground hover:bg-muted",
                      },
                      { type: "separator" },
                      {
                        label: "Archive",
                        icon: <Archive className="w-3.5 h-3.5" />,
                        onClick: () => setDeleteTarget(item),
                        className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30",
                      },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="px-3 h-8 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all disabled:opacity-40">
                Previous
              </button>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                className="px-3 h-8 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all disabled:opacity-40">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Change Modal */}
      {statusTarget && (
        <StatusChangeModal
          item={statusTarget}
          onClose={() => setStatusTarget(null)}
          onConfirm={handleStatusChange}
          loading={updatingStatus}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <DeleteConfirm
          item={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </div>
  );
}
