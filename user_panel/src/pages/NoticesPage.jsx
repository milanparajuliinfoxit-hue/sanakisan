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

const PageBanner = ({ title, subtitle, breadcrumb }) => (
  <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-12 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-primary-300 text-sm mb-2">{breadcrumb}</div>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
        {title}
      </h1>
      {subtitle && <p className="text-primary-200">{subtitle}</p>}
    </div>
  </div>
);

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
      />
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <div className="relative mb-6">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>

          {loading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <FaBell className="text-5xl mx-auto mb-3 opacity-20" />
              <p>No notices found.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="space-y-4">
              {filtered.map((notice, i) => (
                <Link
                  key={notice.id || i}
                  to={`/notices/${notice.id}`}
                  className="card-hover flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:border-primary-300 shadow-sm group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-primary-100">
                    {notice.featuredImage ? (
                      <img
                        src={getImageUrl(notice.featuredImage)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-700 flex items-center justify-center">
                        <FaBell className="text-white text-xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary-900 group-hover:text-primary-600 text-sm leading-tight mb-1.5 line-clamp-2">
                      {notice.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-primary-400" />
                        {formatDate(notice.publishDate || notice.createdAt)}
                      </span>
                      {notice.author && (
                        <span className="flex items-center gap-1">
                          <FaUser className="text-primary-400" />
                          {notice.author}
                        </span>
                      )}
                    </div>
                  </div>
                  <FaArrowRight className="text-primary-300 group-hover:text-primary-600 transition-colors flex-shrink-0 mt-1" />
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
              <span className="px-4 py-2 text-sm text-gray-500">
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
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/notices"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white text-sm mb-4 transition-colors"
          >
            <FaArrowLeft /> Back to Notice Board
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            {loading ? "Loading..." : notice?.title || "Notice"}
          </h1>
        </div>
      </div>

      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          )}
          {error && (
            <div className="text-center py-12 text-gray-400">{error}</div>
          )}
          {!loading && !error && notice && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100">
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-primary-400" />
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
                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
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
