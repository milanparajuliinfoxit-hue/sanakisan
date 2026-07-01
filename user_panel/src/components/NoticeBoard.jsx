import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, CalendarDays, FileText, ArrowRight } from 'lucide-react';
import { fetchNotices, getImageUrl } from '../api/config';
import { formatDate } from '../utils/dateUtils';

export default function NoticeBoard({ limit = 5 }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchNotices(limit)
      .then(data => {
        const items = data?.data || data?.notices || data?.rows || data || [];
        setNotices(Array.isArray(items) ? items : []);
        setLoading(false);
      })
      .catch(() => {
        setError('No notice found');
        setLoading(false);
      });
  }, [limit]);

  // Scroll animation on mount
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-section');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30"
    >
      <style>{`
        @keyframes fadeUpStagger {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-section {
          animation: fadeUpStagger 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .notice-card {
          border-left: 4px solid transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .notice-card:hover {
          border-left-color: #0B3D2E;
          transform: translateX(8px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            {/* Icon Badge */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-lg">
              <Megaphone className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">Latest Updates</p>
              <h2 className="font-display text-3xl font-bold text-emerald-950">Notice Board</h2>
            </div>
          </div>

          {/* "View All Notices" — desktop */}
          {!loading && notices.length > 0 && (
            <Link
              to="/notices"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:gap-3 hover:text-emerald-900 group"
            >
              View All Notices
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Skeleton Loaders */}
        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="notice-card flex items-start gap-4 rounded-xl border border-emerald-100 bg-white p-4 animate-pulse">
                <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-emerald-200/50" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-2/3 rounded bg-emerald-200/50" />
                  <div className="h-3 w-1/3 rounded bg-emerald-100/50" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Megaphone className="h-6 w-6 text-emerald-600" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-emerald-700">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && notices.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Megaphone className="h-6 w-6 text-emerald-600" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-emerald-700">No notice found</p>
          </div>
        )}

        {/* Notice List - Vertical Cards */}
        {!loading && !error && notices.length > 0 && (
          <div className="space-y-4">
            {notices.map((notice, i) => (
              <Link
                key={notice.id || i}
                to={`/notices/${notice.id}`}
                className="notice-card group flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm hover:shadow-lg"
                style={{ animation: `fadeUpStagger 0.6s ease-out ${100 + i * 100}ms both` }}
              >
                {/* Thumbnail / Icon */}
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-900">
                  {notice.featuredImage ? (
                    <img
                      src={getImageUrl(notice.featuredImage)}
                      alt={notice.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 items-center justify-center ${notice.featuredImage ? 'hidden' : 'flex'}`}>
                    <FileText className="h-5 w-5 text-white" strokeWidth={1.8} />
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display font-semibold text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {notice.title}
                    </h3>
                    {i === 0 && (
                      <span className="flex-shrink-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-bold text-white whitespace-nowrap">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
                      {formatDate(notice.publishDate || notice.createdAt)}
                    </span>
                    {notice.author && <span>• {notice.author}</span>}
                  </div>
                </div>

                {/* Arrow Icon */}
                <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-400 transition-all duration-300 group-hover:text-emerald-600 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        )}

        {/* Mobile "View All" Button */}
        {!loading && notices.length > 0 && (
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/notices"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              View All Notices
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
