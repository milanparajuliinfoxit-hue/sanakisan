import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaBell,
  FaCalendarAlt,
  FaUser,
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";
import { fetchNotices, fetchNoticeById, getImageUrl } from "../api/config";
import { formatDate, formatFullDate } from "../utils/dateUtils";
import PageBanner from "../components/PageBanner";

export function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    fetchNotices(limit, page)
      .then((data) => {
        const items = data?.data || data?.notices || data?.rows || data || [];
        const count = data?.total || data?.count || items.length;
        setNotices(Array.isArray(items) ? items : []);
        setTotal(count);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  const filtered = notices.filter((n) =>
    n.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageBanner
        title="Notice Board"
        subtitle="Latest announcements and official notices"
        breadcrumb="Home › Notice Board"
        eyebrow="Official updates"
      />
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Search */}
          <div className="relative mb-6">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-emerald-100 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
            />
          </div>

          {loading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-[1.4rem] bg-emerald-100"
                />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50/70 py-16 text-center text-slate-500">
              <FaBell className="mx-auto mb-3 text-5xl opacity-20" />
              <p>No notices found.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="space-y-4">
              {filtered.map((notice, i) => (
                <Link
                  key={notice.id || i}
                  to={`/notices/${notice.id}`}
                  className="card-hover group flex items-start gap-4 rounded-[1.4rem] border border-emerald-100 bg-white p-4 shadow-sm hover:border-emerald-200"
                >
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-100">
                    {notice.featuredImage ? (
                      <img
                        src={getImageUrl(notice.featuredImage)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-emerald-800">
                        <FaBell className="text-xl text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1.5 text-sm font-semibold leading-tight text-emerald-950 transition group-hover:text-emerald-700">
                      {notice.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-emerald-500" />
                        {formatDate(notice.publishDate || notice.createdAt)}
                      </span>
                      {notice.author && (
                        <span className="flex items-center gap-1">
                          <FaUser className="text-emerald-500" />
                          {notice.author}
                        </span>
                      )}
                    </div>
                  </div>
                  <FaArrowRight className="mt-1 flex-shrink-0 text-emerald-400 transition group-hover:text-emerald-600" />
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-primary-50 transition-colors"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-sm text-slate-500">
                Page {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * limit >= total}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-primary-50 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function NoticeSinglePage() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNoticeById(id)
      .then((data) => {
        setNotice(data?.data || data);
        setLoading(false);
      })
      .catch(() => {
        setError("Notice not found.");
        setLoading(false);
      });
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
          {loading && (
            <div className="h-64 animate-pulse rounded-[1.6rem] bg-emerald-100" />
          )}
          {error && (
            <div className="text-center py-12 text-gray-400">{error}</div>
          )}
          {!loading && !error && notice && (
            <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
              {notice.featuredImage && (
                <div className="h-56 overflow-hidden">
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
                      <FaUser className="text-primary-400" />
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
                  <p className="text-gray-500 italic">
                    No additional content for this notice.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
