import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Newspaper, ArrowRight, Clock } from "lucide-react";
import { fetchBlogs, getImageUrl } from "../api/config";
import { formatDate } from "../utils/dateUtils";

export default function BlogsSection({ limit = 3 }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchBlogs(limit + 2)
      .then((data) => {
        const items = data?.data || data?.pressReleases || data?.rows || data || [];
        setBlogs(Array.isArray(items) ? items : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Blog fetch error:", err);
        setError("Could not load news");
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
        .blog-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
        }
        .blog-image {
          overflow: hidden;
          aspect-ratio: 16/9;
        }
        .blog-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .blog-card:hover .blog-image img {
          transform: scale(1.05);
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            {/* Icon Badge */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg">
              <Newspaper className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">Stories & Insights</p>
              <h2 className="font-display text-3xl font-bold text-emerald-950">News & Blogs</h2>
            </div>
          </div>

          {/* "View All" — desktop */}
          {!loading && blogs.length > 0 && (
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:gap-3 hover:text-emerald-900 group"
            >
              View All Blogs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Skeleton Loaders */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="blog-card rounded-xl bg-white overflow-hidden shadow-sm animate-pulse">
                <div className="blog-image bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-5 w-5/6 rounded bg-slate-200" />
                  <div className="h-3 w-4/5 rounded bg-slate-200" />
                  <div className="h-8 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Newspaper className="h-6 w-6 text-emerald-600" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-emerald-700">No blog found</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && blogs.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Newspaper className="h-6 w-6 text-emerald-600" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-emerald-700">No blog found</p>
          </div>
        )}

        {/* Blogs Grid - 3 Column Layout */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, limit).map((blog, i) => (
              <Link
                key={blog.id || i}
                to={`/blogs/${blog.id}`}
                className="blog-card group rounded-xl bg-white overflow-hidden shadow-sm"
                style={{ animation: `fadeUpStagger 0.6s ease-out ${100 + i * 100}ms both` }}
              >
                {/* Image Thumbnail */}
                <div className="blog-image relative bg-gradient-to-br from-emerald-200 to-emerald-100">
                  {blog.featuredImage ? (
                    <img
                      src={getImageUrl(blog.featuredImage)}
                      alt={blog.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-900 ${blog.featuredImage ? 'hidden' : 'flex'}`}>
                    <Newspaper className="h-8 w-8 text-white" strokeWidth={1.5} />
                  </div>

                  {/* Category Tag */}
                  {blog.category && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                        {blog.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="font-display font-semibold text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-3">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                    {blog.excerpt || blog.description || 'Read this insightful article...'}
                  </p>

                  {/* Footer: Date + Read Time */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-emerald-100">
                    <span>{formatDate(blog.publishDate || blog.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      5 min read
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile "View All" Button */}
        {!loading && blogs.length > 0 && (
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              View All Blogs
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
