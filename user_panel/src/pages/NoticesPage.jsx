import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaBell, FaCalendarAlt, FaUser, FaArrowLeft,
  FaSearch, FaTimes, FaChevronLeft, FaChevronRight,
} from "react-icons/fa";
import { MdSearchOff } from "react-icons/md";
import { fetchNotices, fetchNoticeById, getImageUrl } from "../api/config";
import { formatDate, formatFullDate } from "../utils/dateUtils";
import PageBanner from "../components/PageBanner";

const LIMIT = 9;

function isNew(dateStr) {
  if (!dateStr) return false;
  return (Date.now() - new Date(dateStr).getTime()) < 7 * 24 * 60 * 60 * 1000;
}

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
    <div className="notice-skeleton rounded-2xl overflow-hidden bg-white shadow-sm">
      <div className="skeleton-img" />
      <div className="p-5 space-y-3">
        <div className="skeleton-line w-3/4" />
        <div className="skeleton-line w-1/2" />
        <div className="skeleton-line w-1/3" />
      </div>
    </div>
  );
}

/* ─── Notice Card ─── */
function NoticeCard({ notice, index, onOpen }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dateStr = notice.publishDate || notice.createdAt;
  const imgUrl = notice.featuredImage ? getImageUrl(notice.featuredImage) : null;

  return (
    <article
      ref={cardRef}
      className="notice-card"
      style={{ transitionDelay: `${index * 80}ms` }}
      onClick={() => onOpen(notice)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(notice)}
      tabIndex={0}
      role="button"
      aria-label={`Open notice: ${notice.title}`}
    >
      {/* Image */}
      <div className="notice-card__img-wrap">
        {imgUrl ? (
          <img src={imgUrl} alt={notice.title} loading="lazy" className="notice-card__img" />
        ) : (
          <div className="notice-card__img-placeholder">
            <FaBell />
          </div>
        )}
        {isNew(dateStr) && <span className="notice-card__badge">NEW</span>}
      </div>

      {/* Content */}
      <div className="notice-card__body">
        <h3 className="notice-card__title">{notice.title}</h3>
        <div className="notice-card__meta">
          <span><FaCalendarAlt className="meta-icon" />{formatDate(dateStr)}</span>
          {notice.author && <span><FaUser className="meta-icon" />{notice.author}</span>}
        </div>
        {notice.excerpt && (
          <p className="notice-card__excerpt">{notice.excerpt}</p>
        )}
      </div>
    </article>
  );
}

/* ─── Modal ─── */
function NoticeModal({ notice, onClose }) {
  const imgUrl = notice?.featuredImage ? getImageUrl(notice.featuredImage) : null;
  const dateStr = notice?.publishDate || notice?.createdAt;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog" aria-modal="true"
    >
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <span className="modal-header-title">{notice?.title}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link
              to={`/notices/${notice?.id}`}
              onClick={onClose}
              className="modal-view-btn"
              aria-label="View full page"
            >
              View Full Page
            </Link>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-scroll-body">
          {imgUrl && (
            <div className="modal-img-wrap">
              <img src={imgUrl} alt={notice.title} className="modal-img" />
            </div>
          )}
          <div className="p-6">
            <h2 className="font-bold text-lg text-emerald-950 mb-3">{notice.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-emerald-500" />{formatFullDate(dateStr)}
              </span>
              {notice.author && (
                <span className="flex items-center gap-1.5">
                  <FaUser className="text-emerald-500" />{notice.author}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Pagination ─── */
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      {/* Mobile */}
      <div className="pagination-mobile">
        <button
          className="page-btn"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </button>
        <span className="page-label">Page {page} of {totalPages}</span>
        <button
          className="page-btn"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Desktop */}
      <div className="pagination-desktop">
        <button
          className="page-btn"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <FaChevronLeft /> Prev
        </button>

        {pages.map((p) => (
          <button
            key={p}
            className={`page-num ${p === page ? "active" : ""}`}
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        <button
          className="page-btn"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          Next <FaChevronRight />
        </button>
      </div>
    </nav>
  );
}

/* ─── Main NoticesPage ─── */
export function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState(null); // stores full notice object
  const gridRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchNotices(LIMIT, page)
      .then((data) => {
        if (cancelled) return;
        const items = data?.data || data?.notices || data?.rows || data || [];
        const count = data?.total || data?.count || items.length;
        setNotices(Array.isArray(items) ? items : []);
        setTotal(count);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page]);

  const handlePageChange = useCallback((p) => {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const filtered = notices.filter((n) =>
    n.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <style>{`
        :root {
          --green-900: #14532d;
          --green-700: #15803d;
          --green-600: #16a34a;
          --green-100: #dcfce7;
          --green-50:  #f0fdf4;
          --gold:      #f59e0b;
          --text-dark: #052e16;
          --text-muted:#64748b;
          --radius-card: 16px;
          --shadow-card: 0 4px 20px rgba(0,0,0,0.06);
          --shadow-hover: 0 16px 40px rgba(0,0,0,0.13);
          --transition: 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Card ── */
        .notice-card {
          background: #fff;
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          cursor: pointer;
          outline: none;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.5s ease, transform 0.5s ease,
                      box-shadow var(--transition);
        }
        .notice-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .notice-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
        }
        .notice-card:focus-visible {
          outline: 2px solid var(--green-600);
          outline-offset: 2px;
        }
        .notice-card__img-wrap {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: var(--green-100);
        }
        .notice-card__img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform var(--transition);
        }
        .notice-card:hover .notice-card__img { transform: scale(1.05); }
        .notice-card__img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, var(--green-900), var(--green-700));
          color: rgba(255,255,255,0.4);
          font-size: 2.5rem;
        }
        .notice-card__badge {
          position: absolute; top: 12px; right: 12px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
          padding: 3px 10px; border-radius: 999px;
          box-shadow: 0 2px 8px rgba(245,158,11,0.4);
        }
        .notice-card__body { padding: 20px; }
        .notice-card__title {
          font-size: 1.05rem; font-weight: 700;
          color: var(--text-dark); line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 10px;
          transition: color var(--transition);
        }
        .notice-card:hover .notice-card__title { color: var(--green-700); }
        .notice-card__meta {
          display: flex; flex-wrap: wrap; gap: 12px;
          font-size: 0.75rem; color: var(--text-muted);
        }
        .notice-card__meta span { display: flex; align-items: center; gap: 5px; }
        .notice-card__excerpt {
          margin-top: 10px; font-size: 0.8rem; color: var(--text-muted);
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          line-height: 1.6;
        }
        .meta-icon { color: var(--green-600); flex-shrink: 0; }

        /* ── Skeleton ── */
        .notice-skeleton { animation: shimmer 1.5s infinite; }
        .skeleton-img {
          aspect-ratio: 16/9;
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer-bg 1.5s infinite;
        }
        .skeleton-line {
          height: 14px; border-radius: 6px;
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer-bg 1.5s infinite;
        }
        @keyframes shimmer-bg {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Modal ── */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        .modal-box {
          background: #fff;
          border-radius: 20px;
          width: 100%; max-width: 760px;
          height: 92vh;
          display: flex;
          flex-direction: column;
          animation: scaleIn 0.25s ease;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        .modal-header {
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          gap: 12px;
        }
        .modal-header-title {
          font-size: 1rem; font-weight: 700;
          color: #052e16;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          flex: 1;
        }
        .modal-view-btn {
          font-size: 0.75rem; font-weight: 600;
          color: var(--green-700);
          border: 1px solid var(--green-100);
          background: var(--green-50);
          padding: 5px 12px; border-radius: 8px;
          white-space: nowrap;
          transition: background 0.2s;
          text-decoration: none;
        }
        .modal-view-btn:hover { background: var(--green-100); }
        .modal-close {
          flex-shrink: 0;
          width: 34px; height: 34px; border-radius: 50%;
          background: #f1f5f9; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #374151; font-size: 0.85rem;
          transition: background 0.2s;
        }
        .modal-close:hover { background: #e2e8f0; }
        .modal-scroll-body {
          flex: 1; min-height: 0;
          overflow-y: auto;
          background: #f8fafc;
        }
        .modal-img-wrap {
          width: 100%;
          background: #000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow-y: auto;
        }
        .modal-img {
          width: 100%;
          height: auto;
          display: block;
        }
        @media (max-width: 640px) {
          .modal-backdrop { padding: 0; }
          .modal-box { border-radius: 0; height: 100dvh; }
        }

        /* ── Pagination ── */
        .pagination { margin-top: 40px; display: flex; justify-content: center; }
        .pagination-mobile {
          display: flex; align-items: center; gap: 16px;
        }
        .pagination-desktop { display: none; align-items: center; gap: 6px; }
        @media (min-width: 640px) {
          .pagination-mobile { display: none; }
          .pagination-desktop { display: flex; }
        }
        .page-label { font-size: 0.875rem; color: var(--text-muted); }
        .page-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px;
          border: 1px solid #e2e8f0; background: #fff;
          font-size: 0.85rem; font-weight: 600; color: #374151;
          cursor: pointer; transition: all var(--transition);
        }
        .page-btn:hover:not(:disabled) {
          background: var(--green-50); border-color: var(--green-600);
          color: var(--green-700);
        }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .page-num {
          width: 40px; height: 40px; border-radius: 10px;
          border: 1px solid #e2e8f0; background: #fff;
          font-size: 0.875rem; font-weight: 600; color: #374151;
          cursor: pointer; transition: all var(--transition);
          display: flex; align-items: center; justify-content: center;
        }
        .page-num:hover:not(.active) {
          background: var(--green-50); border-color: var(--green-600);
          color: var(--green-700);
        }
        .page-num.active {
          background: var(--green-900); border-color: var(--green-900);
          color: #fff;
        }

        /* ── Search ── */
        .search-wrap {
          position: relative; margin-bottom: 28px;
        }
        .search-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: #94a3b8; pointer-events: none;
        }
        .search-input {
          width: 100%; padding: 13px 16px 13px 42px;
          border-radius: 12px; border: 1.5px solid #e2e8f0;
          background: #fff; font-size: 0.9rem; color: #1e293b;
          outline: none; transition: border-color var(--transition),
          box-shadow var(--transition);
        }
        .search-input:focus {
          border-color: var(--green-600);
          box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
        }

        /* ── Animations ── */
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <div>
        <PageBanner
          title="Notice Board"
          subtitle="Latest announcements and official notices"
          breadcrumb="Home › Notice Board"
          eyebrow="Official updates"
        />

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">

            {/* Search */}
            <div className="search-wrap">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search notices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
                aria-label="Search notices"
              />
            </div>

            {/* Skeleton */}
            {loading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" ref={gridRef}>
                {[...Array(LIMIT)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <MdSearchOff className="mb-4 text-6xl opacity-30" />
                <p className="text-base font-medium">No notices found.</p>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="mt-3 text-sm text-emerald-600 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* Grid */}
            {!loading && filtered.length > 0 && (
              <div
                ref={gridRef}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((notice, i) => (
                  <NoticeCard
                    key={notice.id || i}
                    notice={notice}
                    index={i}
                    onOpen={(n) => setActiveModal(n)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!search && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            )}
          </div>
        </section>
      </div>

      {activeModal && (
        <NoticeModal notice={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}

/* ─── Single Notice Page (unchanged route) ─── */
export function NoticeSinglePage() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchNoticeById(id)
      .then((data) => {
        if (cancelled) return;
        setNotice(data?.data || data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) { setError("Notice not found."); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [id]);

  return (
    <div>
      <div className="bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),linear-gradient(135deg,#14532d_0%,#166534_48%,#15803d_100%)] px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/notices"
            className="mb-4 inline-flex items-center gap-2 text-sm text-emerald-50/90 transition hover:text-white"
          >
            <FaArrowLeft /> Back to Notice Board
          </Link>
          <h1 className="font-display text-2xl font-semibold text-white md:text-3xl">
            {loading ? "Loading..." : notice?.title || "Notice"}
          </h1>
        </div>
      </div>

      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {loading && <div className="h-64 animate-pulse rounded-[1.6rem] bg-emerald-100" />}
          {error && <div className="text-center py-12 text-gray-400">{error}</div>}
          {!loading && !error && notice && (
            <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
              {notice.featuredImage && (
                <div className="h-64 overflow-hidden">
                  <img
                    src={getImageUrl(notice.featuredImage)}
                    alt={notice.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-8">
                <div className="mb-6 flex flex-wrap gap-4 border-b border-emerald-100 pb-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-emerald-500" />
                    {formatFullDate(notice.publishDate || notice.createdAt)}
                  </span>
                  {notice.author && (
                    <span className="flex items-center gap-1.5">
                      <FaUser className="text-emerald-500" />
                      {notice.author}
                    </span>
                  )}
                </div>
                {notice.content ? (
                  <div
                    className="prose prose-sm max-w-none leading-8 text-slate-700"
                    dangerouslySetInnerHTML={{ __html: notice.content }}
                  />
                ) : (
                  <p className="text-gray-500 italic">No additional content for this notice.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
