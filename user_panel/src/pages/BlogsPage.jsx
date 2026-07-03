import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaNewspaper, FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';
import { fetchBlogs, fetchBlogById, getImageUrl } from '../api/config';
import { formatFullDate } from '../utils/dateUtils';
import PageBreadcrumb from '../components/PageBreadcrumb';
import BlogCard from '../components/BlogCard';
import EmptyState from '../components/EmptyState';
import { SkeletonGrid } from '../components/Skeleton';

export function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const limit = 9;

  useEffect(() => {
    let cancelled = false;
    fetchBlogs(limit, page)
      .then(res => {
        if (cancelled) return;
        setBlogs(res.data || []);
        setTotal(res.totalItems || 0);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page]);

  const handlePageChange = (newPage) => {
    setLoading(true);
    setPage(newPage);
  };

  const filtered = blogs.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageBreadcrumb
        title="News & Blogs"
        items={[
          { label: "Home", path: "/" },
          { label: "News & Blogs" },
        ]}
      />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Search */}
          <div className="relative mb-8 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search news & blogs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10"
            />
          </div>

          {loading && <SkeletonGrid count={6} />}

          {!loading && filtered.length === 0 && (
            <EmptyState icon={FaNewspaper} title="No articles found." />
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((blog, i) => (
                <BlogCard key={blog.id || i} blog={blog} contentLength={120} showReadMore={true} />
              ))}
            </div>
          )}

          {total > limit && (
            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="flex items-center px-4 text-sm text-slate-500">Page {page}</span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page * limit >= total}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function BlogSinglePage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogById(id)
      .then(data => {
        setBlog(data?.data || data);
        setLoading(false);
      })
      .catch(() => { setError('Article not found.'); setLoading(false); });
  }, [id]);

  return (
    <div>
      <PageBreadcrumb
        title={loading ? "Loading..." : blog?.title || "Article"}
        items={[
          { label: "Home", path: "/" },
          { label: "News & Blogs", path: "/blogs" },
          { label: loading ? "Loading..." : blog?.title || "Article" },
        ]}
      />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {loading && (
            <div className="animate-pulse space-y-4">
              <div className="h-64 rounded-[1.6rem] bg-emerald-100" />
              <div className="h-4 w-3/4 rounded bg-emerald-100" />
              <div className="h-4 w-1/2 rounded bg-emerald-100" />
            </div>
          )}
          {error && (
            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50/70 py-12 text-center">
              <p className="text-slate-500">{error}</p>
            </div>
          )}
          {!loading && !error && blog && (
            <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
              {blog.featuredImage && (
                <div className="h-64 overflow-hidden">
                  <img src={getImageUrl(blog.featuredImage)} alt={blog.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-8">
                <div className="mb-6 flex flex-wrap gap-4 border-b border-emerald-100 pb-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-emerald-500" />{formatFullDate(blog.publishDate || blog.createdAt)}</span>
                  {blog.author && <span className="flex items-center gap-1.5"><FaUser className="text-emerald-500" />{blog.author}</span>}
                </div>
                <div
                  className="prose prose-sm max-w-none leading-8 text-slate-700"
                  dangerouslySetInnerHTML={{ __html: blog.content || '<p>No content available.</p>' }}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
