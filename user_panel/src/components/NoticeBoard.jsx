import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, CalendarDays, FileText, ArrowRight } from 'lucide-react';
import { fetchNotices, getImageUrl } from '../api/config';
import { formatDate } from '../utils/dateUtils';

export default function NoticeBoard({ limit = 5 }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotices(limit)
      .then(data => {
        const items = data?.data || data?.notices || data?.rows || data || [];
        setNotices(Array.isArray(items) ? items : []);
        setLoading(false);
      })
      .catch(err => {
        setError('No notice found');
        setLoading(false);
      });
  }, [limit]);

  return (
    <section className="bg-emerald-50/80 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            {/* Gradient icon container with pulse animation */}
            <div className="icon-pulse-container flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-lg shadow-emerald-900/20">
              <Megaphone className="h-[22px] w-[22px]" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Latest updates</p>
              <h2 className="font-display text-2xl font-semibold text-emerald-950">Notice Board</h2>
            </div>
          </div>

          {/* Conditional "View All Notices" — desktop */}
          {!loading && notices.length > 0 && (
            <Link
              to="/notices"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:gap-3 hover:text-emerald-900"
            >
              View All Notices <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Shimmer Skeleton Loaders */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="skeleton-shimmer flex items-start gap-4 rounded-2xl p-4"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="h-16 w-16 flex-shrink-0 rounded-2xl bg-emerald-200/50" />
                <div className="flex-1 space-y-2.5 py-1">
                  <div className="h-4 w-3/4 rounded-full bg-emerald-200/50" />
                  <div className="h-3 w-1/2 rounded-full bg-emerald-200/40" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-3xl border border-emerald-100 bg-white py-10 text-center text-slate-500">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <Megaphone className="h-7 w-7 text-emerald-300" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && notices.length === 0 && (
          <div className="rounded-3xl border border-emerald-100 bg-white py-10 text-center text-slate-500">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <Megaphone className="h-7 w-7 text-emerald-300" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium">No notice found</p>
          </div>
        )}

        {/* Notice List */}
        {!loading && !error && notices.length > 0 && (
          <div className="space-y-3">
            {notices.map((notice, i) => (
              <Link
                key={notice.id || i}
                to={`/notices/${notice.id}`}
                className="card-hover group flex items-start gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm hover:border-emerald-200"
              >
                {/* Thumbnail */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-100">
                  {notice.featuredImage ? (
                    <img
                      src={getImageUrl(notice.featuredImage)}
                      alt={notice.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`h-full w-full items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-900 ${notice.featuredImage ? 'hidden' : 'flex'}`}>
                    <FileText className="h-5 w-5 text-white" strokeWidth={1.8} />
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-6 text-emerald-950 transition group-hover:text-emerald-700">
                      {notice.title}
                    </h3>
                    {i === 0 && (
                      <span className="flex-shrink-0 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-600">
                        New
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.8} />
                      {formatDate(notice.publishDate || notice.createdAt)}
                    </span>
                    {notice.author ? <span>· {notice.author}</span> : null}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-400 transition group-hover:text-emerald-600" />
              </Link>
            ))}
          </div>
        )}

        {/* Conditional Mobile "View All" Button */}
        {!loading && notices.length > 0 && (
          <div className="mt-6 text-center md:hidden">
            <Link
              to="/notices"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              View All Notices <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
