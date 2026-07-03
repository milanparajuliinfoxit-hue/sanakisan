import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Gift, Plus, Search, X, Eye, Pencil, Trash2, MoreVertical,
  CalendarDays, ArrowUpDown, ArrowUp, ArrowDown, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import HolidayFormModal from "@/components/forms/CreateHoliday";

const API = import.meta.env.VITE_REACT_APP_API_URL;

const fmt = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

const getStatus = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return { label: "Today", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  if (diff > 0 && diff <= 30) return { label: `In ${diff}d`, color: "bg-blue-100 text-blue-700 border-blue-200" };
  if (diff > 30) return { label: "Upcoming", color: "bg-primary/10 text-primary border-primary/20" };
  return { label: "Past", color: "bg-muted text-muted-foreground border-border" };
};

// ── Action Menu ───────────────────────────────────────────────────────────────
function ActionMenu({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="More actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-40 bg-popover border border-border rounded-xl shadow-xl py-1 animate-fade-in">
          <button onClick={() => { setOpen(false); onView(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
            <Eye className="w-3.5 h-3.5 text-muted-foreground" /> View
          </button>
          <button onClick={() => { setOpen(false); onEdit(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
            <Pencil className="w-3.5 h-3.5 text-muted-foreground" /> Edit
          </button>
          <div className="my-1 border-t border-border" />
          <button onClick={() => { setOpen(false); onDelete(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── View Modal ────────────────────────────────────────────────────────────────
function ViewModal({ holiday, onClose }) {
  const status = getStatus(holiday.holiday_date);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Holiday Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <Gift className="w-7 h-7 text-red-500" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-foreground truncate">{holiday.title}</h3>
              {status && (
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-1", status.color)}>
                  {status.label}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Holiday Date</p>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-primary" />
                <p className="text-sm font-medium text-foreground">{fmt(holiday.holiday_date)}</p>
              </div>
            </div>
            {holiday.created_at && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</p>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-sm text-foreground">{fmt(holiday.created_at)}</p>
                </div>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ID</p>
              <p className="text-sm text-foreground font-mono">#{holiday.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
              <p className="text-sm text-foreground">{holiday.status !== false ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end px-6 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
          <button onClick={onClose}
            className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteConfirm({ holiday, onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border animate-scale-in overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Delete Holiday?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Are you sure you want to delete <span className="font-medium text-foreground">"{holiday.title}"</span>? This action cannot be undone.
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
            {loading ? "Deleting…" : <><Trash2 className="w-3.5 h-3.5" /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sort Button ───────────────────────────────────────────────────────────────
function SortBtn({ field, current, dir, onClick, children }) {
  const active = current === field;
  return (
    <button onClick={() => onClick(field)}
      className={cn("flex items-center gap-1 text-xs font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
      {children}
      {active ? (dir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-50" />}
    </button>
  );
}

// ── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-muted flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-3 bg-muted rounded w-1/4" />
      </div>
      <div className="h-5 w-16 bg-muted rounded-full" />
      <div className="h-3 bg-muted rounded w-20" />
      <div className="w-7 h-7 bg-muted rounded-lg" />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Holiday() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("holiday_date");
  const [sortDir, setSortDir] = useState("asc");

  // Modal states
  const [formModal, setFormModal] = useState(null); // null | { mode: 'create'|'edit', holiday?: {} }
  const [viewHoliday, setViewHoliday] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/get-holidays`);
      setHolidays(res.data.data || []);
    } catch {
      toast.error("Failed to load holidays.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHolidays(); }, []);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await axios.delete(`${API}/api/delete-holiday/${deleteTarget.id}`);
      if (res.data.status) {
        toast.success("Holiday deleted successfully.");
        setHolidays(prev => prev.filter(h => h.id !== deleteTarget.id));
      } else {
        toast.error(res.data.message || "Failed to delete.");
      }
    } catch {
      toast.error("Failed to delete holiday.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Filter + sort
  const filtered = holidays
    .filter(h => h.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let va = a[sortField] || ""; let vb = b[sortField] || "";
      if (sortField === "holiday_date") { va = new Date(va); vb = new Date(vb); }
      else { va = va.toString().toLowerCase(); vb = vb.toString().toLowerCase(); }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const upcoming = holidays.filter(h => new Date(h.holiday_date) >= new Date(new Date().setHours(0,0,0,0))).length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Holiday Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {holidays.length} total · {upcoming} upcoming
          </p>
        </div>
        <button
          onClick={() => setFormModal({ mode: "create" })}
          className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Holiday
        </button>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Holidays", value: holidays.length, icon: Gift, color: "bg-red-100 text-red-600" },
          { label: "Upcoming", value: upcoming, icon: CalendarDays, color: "bg-blue-100 text-blue-600" },
          { label: "Past", value: holidays.length - upcoming, icon: Clock, color: "bg-muted text-muted-foreground" },
        ].map(({ label, value, icon: Icon, color }) => (
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

      {/* ── Table Card ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search holidays…"
              className="w-full pl-9 pr-8 h-9 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <span className="text-sm text-muted-foreground ml-auto">
            {filtered.length} of {holidays.length}
          </span>
        </div>

        {/* Column Headers */}
        {!loading && holidays.length > 0 && (
          <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 bg-muted/40 border-b border-border text-xs font-medium text-muted-foreground">
            <div className="w-9 flex-shrink-0" />
            <div className="flex-1">
              <SortBtn field="title" current={sortField} dir={sortDir} onClick={handleSort}>Title</SortBtn>
            </div>
            <div className="w-32">
              <SortBtn field="holiday_date" current={sortField} dir={sortDir} onClick={handleSort}>Date</SortBtn>
            </div>
            <div className="w-20">Status</div>
            <div className="w-7" />
          </div>
        )}

        {/* Rows */}
        {loading ? (
          <div>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {search ? "No Holidays Found" : "No Holidays Yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
              {search ? `No holidays match "${search}".` : "Create your first holiday to get started."}
            </p>
            {!search && (
              <button
                onClick={() => setFormModal({ mode: "create" })}
                className="mt-5 flex items-center gap-2 px-4 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
              >
                <Plus className="w-4 h-4" /> Create Holiday
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((h) => {
              const status = getStatus(h.holiday_date);
              return (
                <div key={h.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors group">
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 text-red-500" />
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{h.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 sm:hidden">
                      <CalendarDays className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{fmt(h.holiday_date)}</span>
                    </div>
                  </div>

                  {/* Date — desktop */}
                  <div className="hidden sm:flex items-center gap-1.5 w-32 flex-shrink-0">
                    <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{fmt(h.holiday_date)}</span>
                  </div>

                  {/* Status badge */}
                  <div className="hidden sm:block w-20 flex-shrink-0">
                    {status && (
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", status.color)}>
                        {status.label}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <ActionMenu
                      onView={() => setViewHoliday(h)}
                      onEdit={() => setFormModal({ mode: "edit", holiday: h })}
                      onDelete={() => setDeleteTarget(h)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {formModal && (
        <HolidayFormModal
          mode={formModal.mode}
          holiday={formModal.holiday}
          onClose={() => setFormModal(null)}
          onSuccess={(updated) => {
            if (formModal.mode === "edit") {
              setHolidays(prev => prev.map(h => h.id === updated.id ? updated : h));
            } else {
              setHolidays(prev => [updated, ...prev]);
            }
            setFormModal(null);
          }}
        />
      )}

      {viewHoliday && <ViewModal holiday={viewHoliday} onClose={() => setViewHoliday(null)} />}

      {deleteTarget && (
        <DeleteConfirm
          holiday={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </div>
  );
}
