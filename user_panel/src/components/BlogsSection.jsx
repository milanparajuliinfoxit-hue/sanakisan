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
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <FaNewspaper className="text-white text-lg" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-primary-900">
                News & Blogs
              </h2>
              <div className="text-primary-500 text-sm">
                Latest news and updates
              </div>
            </div>
          </div>
          <Link
            to="/blogs"
            className="hidden md:flex items-center gap-1.5 text-primary-700 hover:text-accent font-semibold text-sm transition-colors border border-primary-700 hover:border-accent px-4 py-2 rounded-lg"
          >
            View All <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden bg-gray-100 animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <FaNewspaper className="text-4xl mx-auto mb-2 opacity-30" />
            <p className="text-sm">No news available at this time.</p>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, limit).map((blog, i) => (
              <Link
                key={blog.id || i}
                to={`/blogs/${blog.id}`}
                className="card-hover group rounded-xl overflow-hidden border border-gray-100 hover:border-primary-200 bg-white shadow-sm"
              >
                {/* Thumbnail */}
                <div className="h-48 overflow-hidden bg-primary-50">
                  {blog.featuredImage ||
                  blog.featured_image ||
                  blog.image ||
                  blog.thumbnail ? (
                    <img
                      src={getImageUrl(
                        blog.featuredImage ||
                          blog.featured_image ||
                          blog.image ||
                          blog.thumbnail,
                      )}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onLoad={() =>
                        console.log(
                          "Image Loaded:",
                          getImageUrl(
                            blog.featuredImage ||
                              blog.featured_image ||
                              blog.image ||
                              blog.thumbnail,
                          ),
                        )
                      }
                      onError={(e) => {
                        console.error(
                          "Image Failed:",
                          getImageUrl(
                            blog.featuredImage ||
                              blog.featured_image ||
                              blog.image ||
                              blog.thumbnail,
                          ),
                        );

                        e.target.src = "/assets/default-news.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-700 to-primary-500 flex items-center justify-center">
                      <FaNewspaper className="text-white text-4xl opacity-40" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-display font-bold text-primary-900 group-hover:text-primary-600 transition-colors leading-tight mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  {blog.content && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
                      {blog.content.replace(/<[^>]*>/g, "").substring(0, 100)}
                      ...
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-primary-400" />
                        {formatDate(blog.publishDate || blog.createdAt)}
                      </span>
                      {blog.author && (
                        <span className="flex items-center gap-1">
                          <FaUser className="text-primary-400" />
                          {blog.author}
                        </span>
                      )}
                    </div>
                    <span className="text-primary-600 font-semibold flex items-center gap-1">
                      Read <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 md:hidden text-center">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-800 transition-colors"
          >
            View All News <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}
