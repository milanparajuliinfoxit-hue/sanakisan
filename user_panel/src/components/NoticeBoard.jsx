import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Megaphone, CalendarDays, FileText, ArrowRight } from "lucide-react";
import { fetchNotices, getImageUrl } from "../api/config";
import { formatDate } from "../utils/dateUtils";
import SectionHeader from "./SectionHeader";
import { SkeletonGrid } from "./Skeleton";
import EmptyState from "./EmptyState";

export default function NoticeBoard({ limit = 5 }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  const sectionRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchNotices(limit)
      .then((data) => {
        const items = data?.data || data?.notices || data?.rows || data || [];
        setNotices(Array.isArray(items) ? items : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load notices");
        setLoading(false);
      });
  }, [limit]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-section");
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const handleImgError = (id) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const isNew = (dateStr) => {
    if (!dateStr) return false;
    try {
      const diff = (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    } catch {
      return false;
    }
  };

  const displayed = useMemo(() => notices.slice(0, limit), [notices, limit]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-300/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          icon={Megaphone}
          iconBg="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white"
          label="Latest Updates"
          title="Notice Board"
          description="Stay informed with our latest announcements, circulars and organizational updates."
          viewAllLink={!loading && notices.length > 0 ? "/notices" : undefined}
          viewAllText="View All Notices"
        />

        {loading && <SkeletonGrid count={Math.min(limit, 4)} />}

        {error && !loading && (
          <EmptyState
            icon={Megaphone}
            title={error}
            description="Please check back later."
          />
        )}

        {!loading && !error && notices.length === 0 && (
          <EmptyState
            icon={Megaphone}
            title="No Notices Available"
            description="There are no notices at this time. Please check back later."
          />
        )}

        {!loading && !error && displayed.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {displayed.map((notice, i) => {
              const dateStr = notice.publishDate || notice.createdAt;
              return (
                <Link
                  key={notice.id || i}
                  to={`/notices/${notice.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  style={{
                    animation: `fadeUpStagger 0.6s ease-out ${100 + i * 100}ms both`,
                  }}
                  aria-label={`Read notice: ${notice.title}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-emerald-200 to-emerald-100">
                    {!failedImages[notice.id] && notice.featuredImage ? (
                      <img
                        src={getImageUrl(notice.featuredImage)}
                        alt={notice.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={() => handleImgError(notice.id)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-900">
                        <FileText
                          className="h-8 w-8 text-white/40"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium text-slate-600 shadow-xs backdrop-blur-sm">
                        <CalendarDays
                          className="h-3 w-3 text-emerald-600"
                          strokeWidth={2}
                        />
                        {formatDate(dateStr)}
                      </span>
                    </div>
                    {isNew(dateStr) && (
                      <span className="badge-pop absolute right-2 top-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
                        NEW
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="mb-1 font-sans text-sm font-bold leading-snug text-emerald-950 transition-colors group-hover:text-emerald-700 line-clamp-2">
                      {notice.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="invisible text-[11px] text-slate-400">
                        —
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 transition-all duration-300 group-hover:gap-1.5">
                        Read
                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && displayed.length > 0 && (
          <div className="mt-8 text-center md:hidden">
            <Link to="/notices" className="btn-primary">
              View All Notices
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
