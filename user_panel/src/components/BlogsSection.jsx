import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Newspaper, ArrowRight } from "lucide-react";
import { fetchBlogs } from "../api/config";
import BlogCard from "./BlogCard";

export default function BlogsSection({ limit = 5 }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs(limit)
      .then((data) => {
        console.log("Blogs:", data);

        const items =
          data?.data || data?.pressReleases || data?.rows || data || [];

        setBlogs(Array.isArray(items) ? items : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Blog fetch error:", err);
        setError("Could not load news");
        setLoading(false);
      });
  }, [limit]);

  return (
    <section className="bg-emerald-50/80 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <div className="icon-pulse-container flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/20">
              <Newspaper className="h-[22px] w-[22px]" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Stories & insights</p>
              <h2 className="font-display text-2xl font-semibold text-emerald-950">News & Blogs</h2>
            </div>
          </div>
          {!loading && blogs.length > 0 && (
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:gap-3 hover:text-emerald-900"
            >
              View All Blogs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Card Container wrapping the content area */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
          {/* Loading Shimmer skeleton */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="overflow-hidden rounded-3xl bg-slate-100 animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                    <div className="h-10 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Newspaper className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-500">No blog found</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && blogs.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Newspaper className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-500">No blog found</p>
            </div>
          )}

          {/* Blogs Grid */}
          {!loading && !error && blogs.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.slice(0, limit).map((blog, i) => (
                <BlogCard key={blog.id || i} blog={blog} />
              ))}
            </div>
          )}

          {/* Mobile View All Button inside the card container */}
          {!loading && blogs.length > 0 && (
            <div className="mt-8 text-center md:hidden">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                View All Blogs <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
