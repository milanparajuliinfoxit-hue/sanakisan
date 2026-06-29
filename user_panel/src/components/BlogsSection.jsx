import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
} from "react-icons/fa";
import { fetchBlogs, getImageUrl } from "../api/config";
import { formatDate } from "../utils/dateUtils";

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
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <FaNewspaper className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Stories & insights</p>
              <h2 className="font-display text-2xl font-semibold text-emerald-950">News & Blogs</h2>
            </div>
          </div>
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">
            View All <FaArrowRight className="text-xs" />
          </Link>
        </div>

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

        {!loading && !error && blogs.length === 0 && (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 py-10 text-center text-sm text-slate-500">No news available at this time.</div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, limit).map((blog, i) => (
              <Link key={blog.id || i} to={`/blogs/${blog.id}`} className="card-hover group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm hover:border-emerald-200">
                <div className="h-48 overflow-hidden bg-emerald-50">
                  {blog.featuredImage || blog.featured_image || blog.image || blog.thumbnail ? (
                    <img src={getImageUrl(blog.featuredImage || blog.featured_image || blog.image || blog.thumbnail)} alt={blog.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={(e) => { e.target.src = "/assets/default-news.jpg"; }} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-600">
                      <FaNewspaper className="text-4xl text-white opacity-40" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="mb-2 font-display text-lg font-semibold leading-tight text-emerald-950 transition group-hover:text-emerald-700">{blog.title}</h3>
                  {blog.content && (
                    <p className="mb-3 line-clamp-2 text-sm leading-7 text-slate-600">{blog.content.replace(/<[^>]*>/g, "").substring(0, 100)}...</p>
                  )}
                  <div className="flex items-center justify-between border-t border-emerald-100 pt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-emerald-500" />{formatDate(blog.publishDate || blog.createdAt)}</span>
                      {blog.author ? <span className="flex items-center gap-1.5"><FaUser className="text-emerald-500" />{blog.author}</span> : null}
                    </div>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">Read <FaArrowRight className="text-[10px]" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/blogs" className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
            View All News <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}
