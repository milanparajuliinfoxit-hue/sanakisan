import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Plus, Search, X, Trash2, Briefcase,
  CheckCircle2, XCircle, ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetCommitteePositionsQuery,
  useCreateCommitteePositionMutation,
  useUpdateCommitteePositionMutation,
  useDeleteCommitteePositionMutation,
} from "@/redux/api/committeePositionApi";
import ActionMenu from "@/components/ui/ActionMenu";

function FormModal({ mode, item, onClose, onSuccess }) {
  const [name, setName] = useState(item?.name || "");
  const [status, setStatus] = useState(item?.status ?? 1);
  const [createCommitteePosition, { isLoading: creating }] = useCreateCommitteePositionMutation();
  const [updateCommitteePosition, { isLoading: updating }] = useUpdateCommitteePositionMutation();
  const loading = creating || updating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (mode === "edit") {
        const res = await updateCommitteePosition({ id: item.id, name: name.trim(), status }).unwrap();
        toast.success(res.message);
        onSuccess(res.data);
      } else {
        const res = await createCommitteePosition({ name: name.trim() }).unwrap();
        toast.success(res.message);
        onSuccess(res.data);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            {mode === "edit" ? "Edit Committee Position" : "Create Committee Position"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Name <span className="text-destructive">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chairperson"
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              autoFocus
            />
          </div>
          {mode === "edit" && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading}
              className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={loading || !name.trim()}
              className="flex items-center gap-2 px-4 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
              {loading ? "Saving…" : mode === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
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
              <h3 className="text-base font-semibold text-foreground">Delete Committee Position?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Are you sure you want to delete <span className="font-medium text-foreground">"{item.name}"</span>? This action cannot be undone.
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

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0" />
      <div className="flex-1 h-4 bg-muted rounded w-1/3" />
      <div className="h-5 w-16 bg-muted rounded-full" />
      <div className="h-3 bg-muted rounded w-24" />
      <div className="w-7 h-7 bg-muted rounded-lg" />
    </div>
  );
}

export default function CommitteePositions() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [formModal, setFormModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteCommitteePosition] = useDeleteCommitteePositionMutation();

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: res, isLoading, refetch } = useGetCommitteePositionsQuery({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const items = res?.data?.data || [];
  const totalPages = res?.data?.totalPages || 1;
  const totalItems = res?.data?.totalItems || 0;

  const sorted = [...items].sort((a, b) => {
    let va = a[sortField] || ""; let vb = b[sortField] || "";
    if (sortField === "createdAt") { va = new Date(va); vb = new Date(vb); }
    else { va = va.toString().toLowerCase(); vb = vb.toString().toLowerCase(); }
    return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteCommitteePosition(deleteTarget.id).unwrap();
      toast.success(res.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete.");
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

  const activeCount = items.filter((i) => i.status === 1).length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Committee Positions</h1>
          <p className="text-sm text-muted-foreground mt-1">{totalItems} total · {activeCount} active</p>
        </div>
        <button
          onClick={() => setFormModal({ mode: "create" })}
          className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Position
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Total Positions", value: totalItems, icon: Briefcase, color: "bg-primary/10 text-primary" },
          { label: "Active", value: activeCount, icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600" },
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

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search positions…"
              className="w-full pl-9 pr-8 h-9 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <span className="text-sm text-muted-foreground ml-auto">{sorted.length} of {totalItems}</span>
        </div>

        {!isLoading && items.length > 0 && (
          <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 bg-muted/40 border-b border-border">
            <div className="w-8 flex-shrink-0" />
            <div className="flex-1"><SortBtn field="name">Name</SortBtn></div>
            <div className="w-24"><SortBtn field="status">Status</SortBtn></div>
            <div className="w-32"><SortBtn field="createdAt">Created</SortBtn></div>
            <div className="w-7" />
          </div>
        )}

        {isLoading ? (
          <div>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {search ? "No Positions Found" : "No Committee Positions Yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
              {search ? `No positions match "${search}".` : "Create your first committee position to get started."}
            </p>
            {!search && (
              <button
                onClick={() => setFormModal({ mode: "create" })}
                className="mt-5 flex items-center gap-2 px-4 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
              >
                <Plus className="w-4 h-4" /> Create Position
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sorted.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                </div>
                <div className="hidden sm:block w-24 flex-shrink-0">
                  {item.status === 1 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                      <XCircle className="w-3 h-3" /> Inactive
                    </span>
                  )}
                </div>
                <div className="hidden sm:block w-32 flex-shrink-0">
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <ActionMenu
                    onEdit={() => setFormModal({ mode: "edit", item })}
                    onDelete={() => setDeleteTarget(item)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

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

      {formModal && (
        <FormModal
          mode={formModal.mode}
          item={formModal.item}
          onClose={() => setFormModal(null)}
          onSuccess={() => { setFormModal(null); refetch(); }}
        />
      )}
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
