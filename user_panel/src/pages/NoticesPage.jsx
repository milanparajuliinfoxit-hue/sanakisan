import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaSearch, FaCalendarAlt, FaFilePdf, FaFileWord, FaFileExcel,
  FaFileImage, FaFileAlt, FaDownload, FaArrowLeft,
  FaChevronLeft, FaChevronRight, FaExternalLinkAlt,
} from "react-icons/fa";
import { MdSearchOff, MdNotifications } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { fetchNotices, fetchNoticeById, getImageUrl } from "../api/config";
import { formatDate, formatFullDate } from "../utils/dateUtils";
import PageBreadcrumb from "../components/PageBreadcrumb";
import ScrollReveal from "../components/ScrollReveal";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { SkeletonGrid, SkeletonImage, SkeletonLine } from "../components/Skeleton";

const LIMIT = 12;

function isNew(dateStr) {
  if (!dateStr) return false;
  return (Date.now() - new Date(dateStr).getTime()) < 7 * 24 * 60 * 60 * 1000;
}

function getFileIcon(filename = "") {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(ext)) return { icon: FaFilePdf, color: "text-red-500 bg-red-50" };
  if (["doc", "docx"].includes(ext)) return { icon: FaFileWord, color: "text-blue-600 bg-blue-50" };
  if (["xls", "xlsx"].includes(ext)) return { icon: FaFileExcel, color: "text-green-600 bg-green-50" };
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return { icon: FaFileImage, color: "text-purple-500 bg-purple-50" };
  return { icon: FaFileAlt, color: "text-slate-500 bg-slate-100" };
}

function getCategoryColor(cat = "") {
  const c = cat.toLowerCase();
  if (c.includes("urgent") || c.includes("emergency")) return "bg-red-100 text-red-700";
  if (c.includes("tender") || c.includes("bid")) return "bg-blue-100 text-blue-700";
  if (c.includes("result") || c.includes("exam")) return "bg-purple-100 text-purple-700";
  if (c.includes("meeting") || c.includes("notice")) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

/* ──────────── Skeleton Card ──────────── */
function SkeletonNoticeCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
      <div className="skeleton-shimmer h-44 w-full" />
      <div className="space-y-2.5 p-5">
        <div className="skeleton-shimmer h-3 w-16 rounded-full" />
        <div className="skeleton-shimmer h-5 w-full rounded-full" />
        <div className="skeleton-shimmer h-5 w-3/4 rounded-full" />
        <div className="skeleton-shimmer h-3 w-1/3 rounded-full" />
      </div>
    </div>
  );
}

/* ──────────── Notice Card ──────────── */
function NoticeCard({ notice, index }) {
  const cardRef = useRef(null);
  const dateStr = notice.publishDate || notice.createdAt;
  const imgUrl = notice.featuredImage ? getImageUrl(notice.featuredImage) : null;
  const plainContent = notice.content ? notice.content.replace(/<[^>]*>/g, "") : notice.excerpt || "";
  const summary = plainContent.length > 120 ? plainContent.slice(0, 120) + "..." : plainContent;
  const hasAttachments = notice.attachments || notice.files || notice.documents;
  const category = notice.category || notice.notice_category;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={cardRef}
      to={`/notices/${notice.id}`}
      className="fade-in-up group block overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-200"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-emerald-100">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={notice.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div className={`absolute inset-0 items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-600 ${imgUrl ? "hidden" : "flex"}`}>
          <HiOutlineDocumentText className="text-4xl text-white/40" />
        </div>
        {isNew(dateStr) && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
            NEW
          </span>
        )}
        {category && (
          <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize shadow-sm ${getCategoryColor(category)}`}>
            {category}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <FaCalendarAlt className="text-emerald-500" />
            {formatDate(dateStr)}
          </span>
          {hasAttachments && (
            <span className="flex items-center gap-1 text-slate-400">
              <FaFileAlt className="text-[10px]" />
              Attached
            </span>
          )}
        </div>
        <h3 className="mb-2 font-display text-base font-bold leading-snug text-emerald-950 line-clamp-2 transition-colors group-hover:text-emerald-700">
          {notice.title}
        </h3>
        {summary && (
          <p className="text-sm leading-6 text-slate-500 line-clamp-2">{summary}</p>
        )}
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-all group-hover:gap-2.5">
          Read More
          <FaChevronRight className="text-[9px] transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

/* ──────────── Featured Notice ──────────── */
function FeaturedNotice({ notice }) {
  const dateStr = notice.publishDate || notice.createdAt;
  const imgUrl = notice.featuredImage ? getImageUrl(notice.featuredImage) : null;
  const plainContent = notice.content ? notice.content.replace(/<[^>]*>/g, "") : notice.excerpt || "";
  const summary = plainContent.length > 200 ? plainContent.slice(0, 200) + "..." : plainContent;
  const category = notice.category || notice.notice_category;

  return (
    <Link
      to={`/notices/${notice.id}`}
      className="group relative block overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300"
    >
      <div className="grid sm:grid-cols-[1.1fr_0.9fr]">
        {imgUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-emerald-100 sm:aspect-auto sm:min-h-[280px]">
            <img
              src={imgUrl}
              alt={notice.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.classList.add("flex", "items-center", "justify-center");
                const icon = document.createElement("div");
                icon.className = "text-5xl text-emerald-300";
                icon.innerHTML = '<svg stroke="currentColor" fill="none" viewBox="0 0 24 24" stroke-width="1"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>';
                e.target.parentElement.appendChild(icon.firstChild);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          <div className="flex aspect-[4/3] min-h-[280px] items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-600 sm:aspect-auto">
            <HiOutlineDocumentText className="text-6xl text-white/30" />
          </div>
        )}
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Featured
            </span>
            {category && (
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${getCategoryColor(category)}`}>
                {category}
              </span>
            )}
          </div>
          <h2 className="mb-3 font-display text-xl font-bold leading-snug text-emerald-950 transition-colors group-hover:text-emerald-700 sm:text-2xl">
            {notice.title}
          </h2>
          <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
            <FaCalendarAlt className="text-emerald-500" />
            {formatFullDate(dateStr)}
          </div>
          {summary && (
            <p className="mb-4 text-sm leading-7 text-slate-600 line-clamp-3">{summary}</p>
          )}
          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition-all group-hover:bg-emerald-100 group-hover:gap-3">
            View Full Notice
            <FaChevronRight className="text-[10px]" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ──────────── Pagination ──────────── */
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = useMemo(() => {
    const range = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  }, [page, totalPages]);

  return (
    <nav className="mt-12 flex justify-center" aria-label="Pagination">
      <div className="flex items-center gap-2">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-35"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <FaChevronLeft className="text-xs" />
        </button>

        {pages[0] > 1 && (
          <>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700"
              onClick={() => onChange(1)}
              aria-label="Page 1"
            >
              1
            </button>
            {pages[0] > 2 && <span className="flex h-10 w-6 items-center justify-center text-xs text-slate-400">...</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold transition ${
              p === page
                ? "border-emerald-800 bg-emerald-800 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-700"
            }`}
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="flex h-10 w-6 items-center justify-center text-xs text-slate-400">...</span>}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700"
              onClick={() => onChange(totalPages)}
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-35"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>
    </nav>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════ */
export function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const gridRef = useRef(null);
  const searchRef = useRef(null);

  const fetchData = useCallback((pageNum) => {
    setLoading(true);
    setError(null);
    fetchNotices(LIMIT, pageNum)
      .then((data) => {
        const items = data?.data || data?.notices || data?.rows || data || [];
        const count = data?.total || data?.count || items.length;
        setNotices(Array.isArray(items) ? items : []);
        setTotal(count);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load notices.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  const handleRetry = useCallback(() => fetchData(page), [page, fetchData]);

  const handlePageChange = useCallback((p) => {
    setPage(p);
    setSearch("");
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const filtered = useMemo(() => {
    if (!search) return notices;
    const q = search.toLowerCase();
    return notices.filter(
      (n) => n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q) || n.excerpt?.toLowerCase().includes(q)
    );
  }, [notices, search]);

  const featured = !search && page === 1 && !loading && filtered.length > 0 ? filtered[0] : null;
  const displayNotices = featured ? filtered.slice(1) : filtered;

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <PageBreadcrumb
        title="Notice Board"
        items={[
          { label: "Home", path: "/" },
          { label: "Notice Board" },
        ]}
      />

      <section className="px-4 py-10 sm:px-6 lg:px-8" ref={gridRef}>
        <div className="mx-auto max-w-7xl">
          {/* Search */}
          <div className="relative mb-8 w-full sm:w-80" ref={searchRef}>
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
              aria-label="Search notices by title or keyword"
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-10">
              <SkeletonNoticeCard />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => <SkeletonNoticeCard key={i} />)}
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-16">
              <ErrorState
                title={error}
                description="Please check your connection and try again."
                onRetry={handleRetry}
              />
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="py-16">
              {search ? (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-20 text-center">
                  <MdSearchOff className="mb-4 text-6xl text-emerald-300" />
                  <p className="text-base font-medium text-emerald-700">No matching notices</p>
                  <p className="mt-1 text-sm text-slate-500">Try a different search term</p>
                  <button
                    onClick={() => setSearch("")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <EmptyState
                  icon={HiOutlineDocumentText}
                  title="No notices published yet"
                  description="Check back soon for official announcements."
                />
              )}
            </div>
          )}

          {/* Content */}
          {!loading && !error && filtered.length > 0 && (
            <div className="space-y-10">
              {/* Featured */}
              {featured && <FeaturedNotice notice={featured} />}

              {/* Grid */}
              {displayNotices.length > 0 && (
                <div>
                  {featured && (
                    <h3 className="mb-6 font-display text-lg font-bold text-emerald-950">
                      All Notices <span className="text-sm font-normal text-slate-400">({total})</span>
                    </h3>
                  )}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {displayNotices.map((notice, i) => (
                      <NoticeCard key={notice.id || i} notice={notice} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && !search && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
          )}
        </div>
      </section>
    </>
  );
}

function fileSizeLabel(size) {
  if (!size) return null;
  const n = parseInt(size, 10);
  if (isNaN(n)) return null;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/* ════════════════════════════════════════════
   SINGLE NOTICE PAGE
   ════════════════════════════════════════════ */
export function NoticeSinglePage() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchNoticeById(id),
      fetchNotices(5, 1).catch(() => []),
    ])
      .then(([noticeData, latestData]) => {
        if (cancelled) return;
        const n = noticeData?.data || noticeData;
        if (!n) { setError("Notice not found."); setLoading(false); return; }
        setNotice(n);
        const items = latestData?.data || latestData?.notices || latestData?.rows || latestData || [];
        setLatest(Array.isArray(items) ? items.filter((item) => item.id !== n.id) : []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) { setError("Failed to load notice."); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [id]);

  const attachments = useMemo(() => {
    if (!notice) return [];
    const raw = notice.attachments || notice.files || notice.documents || [];
    if (typeof raw === "string") {
      try { return JSON.parse(raw); } catch { return []; }
    }
    return Array.isArray(raw) ? raw : [];
  }, [notice]);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchNoticeById(id),
      fetchNotices(5, 1).catch(() => []),
    ])
      .then(([noticeData, latestData]) => {
        const n = noticeData?.data || noticeData;
        if (!n) { setError("Notice not found."); setLoading(false); return; }
        setNotice(n);
        const items = latestData?.data || latestData?.notices || latestData?.rows || latestData || [];
        setLatest(Array.isArray(items) ? items.filter((item) => item.id !== n.id) : []);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load notice."); setLoading(false); });
  }, [id]);

  // ─── Loading ───
  if (loading) {
    return (
      <div>
        <PageBreadcrumb
          title="Loading..."
          items={[
            { label: "Home", path: "/" },
            { label: "Notice Board", path: "/notices" },
            { label: "Loading..." },
          ]}
        />
        {/* Hero skeleton */}
        <section className="px-4 pt-6 pb-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="skeleton-shimmer mb-6 h-5 w-28 rounded-full" />
            <div className="skeleton-shimmer mb-3 h-5 w-20 rounded-full" />
            <div className="skeleton-shimmer h-10 w-3/4 rounded-lg" />
            <div className="skeleton-shimmer mt-3 h-10 w-1/2 rounded-lg" />
            <div className="skeleton-shimmer mt-3 h-4 w-1/3 rounded-lg" />
          </div>
        </section>
        <section className="px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => <div key={i} className="skeleton-shimmer h-5 w-full rounded-lg" />)}
                </div>
                <div className="skeleton-shimmer h-72 w-full rounded-xl" />
              </div>
              <aside className="space-y-6">
                <div className="skeleton-shimmer h-52 w-full rounded-xl" />
                <div className="skeleton-shimmer h-40 w-full rounded-xl" />
              </aside>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ─── Error ───
  if (error) {
    return (
      <div>
        <PageBreadcrumb
          title="Notice"
          items={[
            { label: "Home", path: "/" },
            { label: "Notice Board", path: "/notices" },
            { label: "Notice" },
          ]}
        />
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <ErrorState title={error} onRetry={handleRetry} />
          </div>
        </section>
      </div>
    );
  }

  const dateStr = notice.publishDate || notice.createdAt;
  const imgUrl = notice.featuredImage ? getImageUrl(notice.featuredImage) : null;
  const category = notice.category || notice.notice_category;

  const quickLinks = [
    { label: "About Our Cooperative", href: "/about" },
    { label: "Financial Services", href: "/financial" },
    { label: "Photo Gallery", href: "/gallery" },
    { label: "Contact Us", href: "/contact" },
  ];

  const relatedNotices = latest.slice(0, 3);

  return (
    <>
      <PageBreadcrumb
        title={notice.title}
        items={[
          { label: "Home", path: "/" },
          { label: "Notice Board", path: "/notices" },
          { label: notice.title },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-white px-4 pt-8 pb-6 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <Link
            to="/notices"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-all hover:gap-2 hover:text-emerald-800"
          >
            <FaArrowLeft className="text-[10px]" />
            Back to Notices
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {category && (
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${getCategoryColor(category)}`}>
                {category}
              </span>
            )}
            {isNew(dateStr) && (
              <span className="badge-pop rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                NEW
              </span>
            )}
          </div>

          <h1 className="mb-4 font-display text-2xl font-bold leading-tight text-emerald-950 sm:text-3xl lg:text-4xl max-w-4xl">
            {notice.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <FaCalendarAlt className="text-emerald-500" />
              {formatFullDate(dateStr)}
            </span>
            {notice.author && (
              <span className="inline-flex items-center gap-1.5">
                <span className="text-emerald-200" aria-hidden="true">•</span>
                {notice.author}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <ScrollReveal>
        <section className="px-4 py-8 sm:px-6 lg:px-8 pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
              {/* ─── Article ─── */}
              <article>
                {/* Content */}
                <div className="prose prose-lg max-w-none text-slate-700 prose-headings:font-display prose-headings:font-bold prose-headings:text-emerald-950 prose-p:leading-8 prose-p:my-5 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-emerald-900 prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-li:my-1.5 prose-hr:border-emerald-100">
                  {notice.content ? (
                    <div dangerouslySetInnerHTML={{ __html: notice.content }} />
                  ) : (
                    <p className="text-sm italic text-slate-400">No additional content for this notice.</p>
                  )}
                </div>

                {/* Official Notice Image (after content) */}
                <div className="mt-12 pt-8 border-t border-emerald-100">
                  <h3 className="mb-4 font-display text-lg font-bold text-emerald-950">
                    Official Notice
                  </h3>
                  {imgUrl ? (
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="block w-full text-left focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-4 rounded-xl"
                      aria-label="View full notice image"
                    >
                      <div className="overflow-hidden rounded-xl shadow-md transition-shadow duration-300 hover:shadow-xl">
                        <img
                          src={imgUrl}
                          alt={notice.title}
                          className="w-full object-contain bg-emerald-50"
                          onError={(e) => { e.target.style.display = "none"; e.target.parentElement.classList.add("hidden"); }}
                        />
                      </div>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-all hover:gap-2 hover:text-emerald-800">
                        <FaExternalLinkAlt className="text-[9px]" />
                        Click to view full image
                      </span>
                    </button>
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 sm:h-64">
                      <HiOutlineDocumentText className="text-5xl text-white/20" />
                    </div>
                  )}
                </div>

                {/* Attachments */}
                {attachments.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-emerald-100">
                    <h3 className="mb-4 font-display text-lg font-bold text-emerald-950">
                      Attachments <span className="text-sm font-normal text-slate-400">({attachments.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {attachments.map((file, idx) => {
                        const fileName = file.name || file.filename || file.file || file.path || `file_${idx}`;
                        const fileUrl = file.url || file.path || file.file || fileName;
                        const fullUrl = fileUrl.startsWith("http") ? fileUrl : getImageUrl(fileUrl);
                        const { icon: FileIcon, color } = getFileIcon(fileName);
                        const size = fileSizeLabel(file.size || file.fileSize);

                        return (
                          <a
                            key={idx}
                            href={fullUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                          >
                            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${color}`}>
                              <FileIcon className="text-lg" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-700 transition-colors group-hover:text-emerald-700">
                                {fileName}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="capitalize">{fileName.split(".").pop()?.toUpperCase() || "FILE"}</span>
                                {size && <span>• {size}</span>}
                              </div>
                            </div>
                            <FaDownload className="flex-shrink-0 text-sm text-slate-400 transition-colors group-hover:text-emerald-600" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Related Notices */}
                {relatedNotices.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-emerald-100">
                    <h3 className="mb-6 font-display text-lg font-bold text-emerald-950">
                      Related Notices
                    </h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {relatedNotices.map((item) => {
                        const d = item.publishDate || item.createdAt;
                        const thumbUrl = item.featuredImage ? getImageUrl(item.featuredImage) : null;
                        return (
                          <Link
                            key={item.id}
                            to={`/notices/${item.id}`}
                            className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-emerald-200 to-emerald-100">
                              {thumbUrl ? (
                                <img
                                  src={thumbUrl}
                                  alt={item.title}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                                />
                              ) : null}
                              <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-900 ${thumbUrl ? 'hidden' : ''}`}>
                                <HiOutlineDocumentText className="text-3xl text-white/30" />
                              </div>
                            </div>
                            <div className="flex flex-1 flex-col p-3.5">
                              <h4 className="text-sm font-bold leading-snug text-emerald-950 line-clamp-2 transition-colors group-hover:text-emerald-700">
                                {item.title}
                              </h4>
                              <div className="mt-auto pt-2 flex items-center justify-between text-[11px] text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                  <FaCalendarAlt className="text-emerald-500" />
                                  {formatDate(d)}
                                </span>
                                <span className="font-semibold text-emerald-600">
                                  Read <FaChevronRight className="inline text-[9px] ml-0.5 transition-transform group-hover:translate-x-0.5" />
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>

              {/* ─── Sidebar ─── */}
              <aside className="space-y-6">
                {latest.length > 0 && (
                  <div className="sticky top-24 space-y-6">
                    {/* Latest Notices */}
                    <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                      <h3 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-emerald-950">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-[11px] text-emerald-700">
                          <MdNotifications />
                        </span>
                        Latest Notices
                      </h3>
                      <div className="space-y-2">
                        {latest.slice(0, 5).map((item) => {
                          const d = item.publishDate || item.createdAt;
                          const thumbUrl = item.featuredImage ? getImageUrl(item.featuredImage) : null;
                          return (
                            <Link
                              key={item.id}
                              to={`/notices/${item.id}`}
                              className="group flex items-start gap-3 rounded-lg p-2 transition hover:bg-emerald-50"
                            >
                              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-sm">
                                {thumbUrl ? (
                                  <img
                                    src={thumbUrl}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display = "flex";
                                    }}
                                  />
                                ) : null}
                                <div className={`absolute inset-0 flex items-center justify-center ${thumbUrl ? 'hidden' : ''}`}>
                                  <HiOutlineDocumentText className="text-white/40 text-xs" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-sm font-medium text-slate-700 transition-colors group-hover:text-emerald-700">
                                  {item.title}
                                </p>
                                {d && (
                                  <p className="mt-0.5 text-[11px] text-slate-400">
                                    {formatDate(d)}
                                  </p>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      <Link
                        to="/notices"
                        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-emerald-100 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        View All Notices
                        <FaChevronRight className="text-[9px]" />
                      </Link>
                    </div>

                    {/* Quick Links */}
                    <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                      <h3 className="mb-3 font-display text-base font-bold text-emerald-950">
                        Quick Links
                      </h3>
                      <div className="space-y-2">
                        {quickLinks.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            className="flex items-center gap-3 rounded-xl border border-emerald-100/60 bg-emerald-50/40 px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm hover:text-emerald-700"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-xs text-emerald-600 text-xs font-bold">
                              <FaExternalLinkAlt className="text-[10px]" />
                            </span>
                            <span className="flex-1">{link.label}</span>
                            <FaChevronRight className="text-[10px] text-slate-400 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Lightbox */}
      {lightboxOpen && imgUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Notice image full view"
        >
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          />
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
            aria-label="Close image viewer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-xl">
            <img
              src={imgUrl}
              alt={notice.title}
              className="h-auto w-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
