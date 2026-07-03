import PropTypes from "prop-types";
import CustomImage from "./CustomImage";
import { Edit, Trash2, Newspaper, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search, ChevronsUpDown } from "lucide-react";
import AlertDialog from "./AlertDialog";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }) => {
  const map = {
    published: { label: "Published", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    draft: { label: "Draft", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    archived: { label: "Archived", cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full",
        status === "published" ? "bg-emerald-500" : status === "draft" ? "bg-amber-500" : "bg-red-500")} />
      {label}
    </span>
  );
};

StatusBadge.propTypes = { status: PropTypes.string };

const TableRowSkeleton = () => (
  <tr className="border-b border-border">
    {[10, 48, "flex-1", 24, 20, 24, 24, 20].map((w, i) => (
      <td key={i} className="px-4 py-3">
        <div className={cn("h-4 rounded animate-pulse bg-muted", typeof w === "number" ? `w-${w}` : "w-full")} />
      </td>
    ))}
  </tr>
);

const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />;
  return sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-primary" /> : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
};
SortIcon.propTypes = { field: PropTypes.string, sortField: PropTypes.string, sortDir: PropTypes.string };

const ITEMS_PER_PAGE = 10;

const PressReleaseList = ({ currentPressReleases = [], handleEdit, handleDelete, loading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pressReleaseId, setPressReleaseId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("publishDate");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return currentPressReleases.filter(r =>
      r.title?.toLowerCase().includes(q) ||
      r.author?.toLowerCase().includes(q) ||
      r.publishStatus?.toLowerCase().includes(q)
    );
  }, [currentPressReleases, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const confirmDelete = (id) => { setPressReleaseId(id); setIsDialogOpen(true); };

  const ThCell = ({ field, label }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
      <button onClick={() => handleSort(field)}
        className="flex items-center gap-1.5 hover:text-foreground transition-colors group">
        {label}
        <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
      </button>
    </th>
  );
  ThCell.propTypes = { field: PropTypes.string, label: PropTypes.string };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="h-9 w-64 rounded-lg animate-pulse bg-muted" />
        </div>
        <table className="w-full">
          <thead className="bg-muted/40 border-b border-border">
            <tr>{["Image","Title","Author","Status","Publish Date","Created","Updated","Actions"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
            ))}</tr>
          </thead>
          <tbody>{Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)}</tbody>
        </table>
      </div>
    );
  }

  if (!currentPressReleases.length) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
          <Newspaper className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Press Releases Found</h3>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">Create your first press release to get started.</p>
      </div>
    );
  }

  return (
    <>
      {isDialogOpen && (
        <AlertDialog
          onSubmit={() => { handleDelete(pressReleaseId); setIsDialogOpen(false); setPressReleaseId(null); }}
          onCancel={() => { setIsDialogOpen(false); setPressReleaseId(null); }}
          warningMessage="Delete Press Release?"
          isCancel
          message="This action cannot be undone. The press release will be permanently removed."
          submitText="Delete"
        />
      )}

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by title, author, status…"
              className="pl-9 pr-4 h-9 w-72 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "record" : "records"}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-muted/40 border-b border-border sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-16">Image</th>
                <ThCell field="title" label="Title" />
                <ThCell field="author" label="Author" />
                <ThCell field="publishStatus" label="Status" />
                <ThCell field="publishDate" label="Publish Date" />
                <ThCell field="createdAt" label="Created" />
                <ThCell field="updatedAt" label="Updated" />
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No results match your search.
                  </td>
                </tr>
              ) : paginated.map((pr) => (
                <tr key={pr.id} className="hover:bg-muted/30 transition-colors duration-150 group">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
                      <CustomImage src={pr.featuredImage} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <p className="text-sm font-medium text-foreground truncate" title={pr.title}>{pr.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground whitespace-nowrap">{pr.author}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={pr.publishStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                      {pr.publishDate ? new Date(pr.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                      {pr.createdAt ? new Date(pr.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                      {pr.updatedAt ? new Date(pr.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(pr)}
                        title="Edit"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(pr.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all duration-150"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, sorted.length)} of {sorted.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 h-8 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce((acc, n, idx, arr) => {
                  if (idx > 0 && n - arr[idx - 1] > 1) acc.push("...");
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) => n === "..." ? (
                  <span key={`e${i}`} className="px-2 text-muted-foreground text-sm">…</span>
                ) : (
                  <button key={n} onClick={() => setPage(n)}
                    className={cn("w-8 h-8 rounded-lg text-sm font-medium transition-all",
                      page === n ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted")}>
                    {n}
                  </button>
                ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 h-8 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

PressReleaseList.propTypes = {
  currentPressReleases: PropTypes.array,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  loading: PropTypes.bool,
};

export default PressReleaseList;
