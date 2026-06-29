import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
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
        setError('Could not load notices');
        setLoading(false);
      });
  }, [limit]);

  return (
    <section className="bg-emerald-50/80 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-800 text-white">
              <FaBell className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Latest updates</p>
              <h2 className="font-display text-2xl font-semibold text-emerald-950">Notice Board</h2>
            </div>
          </div>
          <Link to="/notices" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">
            View All Notices <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (<div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />))}
          </div>
        )}

        {error && !loading && (
          <div className="rounded-3xl border border-emerald-100 bg-white py-8 text-center text-slate-500">
            <FaBell className="mx-auto mb-2 text-4xl opacity-30" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && notices.length === 0 && (
          <div className="rounded-3xl border border-emerald-100 bg-white py-8 text-center text-sm text-slate-500">No notices available at this time.</div>
        )}

        {!loading && !error && notices.length > 0 && (
          <div className="space-y-3">
            {notices.map((notice, i) => (
              <Link key={notice.id || i} to={`/notices/${notice.id}`} className="card-hover flex items-start gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm hover:border-emerald-200 group">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-100">
                  {notice.featuredImage ? (<img src={getImageUrl(notice.featuredImage)} alt={notice.title} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />) : null}
                  <div className={`h-full w-full items-center justify-center bg-emerald-800 ${notice.featuredImage ? 'hidden' : 'flex'}`}>
                    <FaBell className="text-xl text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-6 text-emerald-950 transition group-hover:text-emerald-700">{notice.title}</h3>
                    {i === 0 && <span className="flex-shrink-0 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-600">New</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-emerald-500" />{formatDate(notice.publishDate || notice.createdAt)}</span>
                    {notice.author ? <span>· {notice.author}</span> : null}
                  </div>
                </div>
                <FaArrowRight className="mt-1 flex-shrink-0 text-emerald-400 transition group-hover:text-emerald-600" />
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 text-center md:hidden">
          <Link to="/notices" className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
            View All Notices <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}
