import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Newspaper, ArrowRight, Clock } from "lucide-react";
import { fetchBlogs, getImageUrl } from "../api/config";
import { formatDate } from "../utils/dateUtils";
import SectionHeader from "./SectionHeader";
import { SkeletonGrid } from "./Skeleton";
import EmptyState from "./EmptyState";

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
      .catch(() => {
        setError("Could not load news");
        setLoading(false);
      });
  }, [limit]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-section');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          icon={Newspaper}
          iconBg="bg-gradient-to-br from-amber-500 to-amber-700 text-white"
          label="Stories & Insights"
          title="News & Blogs"
          viewAllLink={!loading && blogs.length > 0 ? "/blogs" : undefined}
          viewAllText="View All Blogs"
        />

        {/* Skeleton */}
        {loading && <SkeletonGrid count={3} />}

        {/* Error */}
        {!loading && error && (
          <EmptyState icon={Newspaper} title="No blog found" />
        )}

        {/* Empty */}
        {!loading && !error && blogs.length === 0 && (
          <EmptyState icon={Newspaper} title="No blog found" />
        )}

        {/* Blogs Grid */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, limit).map((blog, i) => (
              <Link
                key={blog.id || i}
                to={`/blogs/${blog.id}`}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                style={{ animation: `fadeUpStagger 0.6s ease-out ${100 + i * 100}ms both` }}
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-emerald-200 to-emerald-100">
                  {blog.featuredImage ? (
                    <img
                      src={getImageUrl(blog.featuredImage)}
                      alt={blog.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-900 ${blog.featuredImage ? 'hidden' : 'flex'}`}>
                    <Newspaper className="h-8 w-8 text-white" strokeWidth={1.5} />
                  </div>
                  {blog.category && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-[10px] font-bold text-white shadow-md">
                        {blog.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="mb-3 font-display font-semibold text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="mb-4 text-sm text-slate-600 line-clamp-2">
                    {blog.excerpt || blog.description || 'Read this insightful article...'}
                  </p>
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

        {/* Mobile "View All" */}
        {!loading && blogs.length > 0 && (
          <div className="mt-8 text-center md:hidden">
            <Link to="/blogs" className="btn-primary">
              View All Blogs
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
