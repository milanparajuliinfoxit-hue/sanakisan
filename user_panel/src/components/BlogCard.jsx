import { Link } from "react-router-dom";
import { FaNewspaper, FaCalendarAlt, FaUser, FaArrowRight } from "react-icons/fa";
import { getImageUrl } from "../api/config";
import { formatDate } from "../utils/dateUtils";

export default function BlogCard({ blog, className = "", contentLength = 100, showReadMore = true }) {
  // Try to find any existing image url fields
  const imageUrl = blog.featuredImage || blog.featured_image || blog.image || blog.thumbnail;
  const displayImage = imageUrl ? getImageUrl(imageUrl) : null;
  const displayDate = formatDate(blog.publishDate || blog.createdAt);
  const plainTextContent = blog.content ? blog.content.replace(/<[^>]*>/g, "") : "";
  const excerpt = plainTextContent ? plainTextContent.substring(0, contentLength) + (plainTextContent.length > contentLength ? "..." : "") : "";

  return (
    <Link
      to={`/blogs/${blog.id}`}
      className={`card-hover group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm hover:border-emerald-200 transition-all duration-300 ${className}`}
    >
      {/* Thumbnail */}
      <div className="h-48 overflow-hidden bg-emerald-50 relative">
        {displayImage ? (
          <img
            src={displayImage}
            alt={blog.title || "Blog Post"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "/assets/default-news.jpg";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-600">
            <FaNewspaper className="text-4xl text-white opacity-40" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-2 font-display text-lg font-semibold leading-tight text-emerald-950 transition group-hover:text-emerald-700">
          {blog.title}
        </h3>
        
        {excerpt && (
          <p className="mb-3 line-clamp-2 text-sm leading-7 text-slate-600">
            {excerpt}
          </p>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-emerald-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center gap-1.5 flex-shrink-0">
              <FaCalendarAlt className="text-emerald-500" />
              {displayDate}
            </span>
            {blog.author && (
              <span className="flex items-center gap-1.5 truncate max-w-[120px]">
                <FaUser className="text-emerald-500" />
                {blog.author}
              </span>
            )}
          </div>
          {showReadMore && (
            <span className="flex items-center gap-1 font-semibold text-emerald-600 flex-shrink-0">
              Read <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
