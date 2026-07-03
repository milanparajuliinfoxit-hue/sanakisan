import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaNewspaper, FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';
import { fetchBlogs, fetchBlogById, getImageUrl } from '../api/config';
import { formatFullDate } from '../utils/dateUtils';
import PageBreadcrumb from '../components/PageBreadcrumb';
import BlogCard from '../components/BlogCard';
import EmptyState from '../components/EmptyState';
import { SkeletonGrid } from '../components/Skeleton';
import { MdUpdate } from "react-icons/md";

export function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
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

  const filtered = blogs.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase()),
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
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 4;

  // Fetch current blog
  useEffect(() => {
    setLoading(true);

    fetchBlogById(id)
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Article not found.");
        setLoading(false);
      });
  }, [id]);

  // Fetch related blogs
  useEffect(() => {
    fetchBlogs(limit, 1)
      .then((res) => {
        setBlogs(res.data || []);
      })
      .catch(console.error);
  }, []);

  const recommendedBlogs = blogs
    .filter((item) => String(item.id) !== String(id))
    .slice(0, 3);

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
        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row">
          {/* Main Content */}
          <article className="flex-1">
            {loading && (
              <div className="animate-pulse space-y-4">
                <div className="h-64 rounded-2xl bg-emerald-100" />
                <div className="h-4 w-3/4 rounded bg-emerald-100" />
                <div className="h-4 w-1/2 rounded bg-emerald-100" />
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 py-12 text-center">
                <p className="text-slate-500">{error}</p>
              </div>
            )}

            {!loading && !error && blog && (
              <>
                {blog.featuredImage && (
                  <img
                    src={getImageUrl(blog.featuredImage)}
                    alt={blog.title}
                    className="mb-6 max-h-[500px] w-full rounded-2xl object-cover"
                  />
                )}

                <h1 className="mb-4 text-4xl font-bold text-slate-800">
                  {blog.title}
                </h1>

                <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-emerald-600" />
                    <span>{formatFullDate(blog.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MdUpdate className="text-emerald-600" />
                    <span>{formatFullDate(blog.updatedAt)}</span>
                  </div>

                  {blog.author && (
                    <div className="flex items-center gap-2">
                      <FaUser className="text-emerald-600" />
                      <span>{blog.author}</span>
                    </div>
                  )}
                </div>

                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: blog.content || "<p>No content available.</p>",
                  }}
                />
              </>
            )}
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 xl:w-96">
            <h2 className="mb-6 text-2xl font-semibold">
              Related Blogs
            </h2>

            <div className="space-y-5">
              {recommendedBlogs.map((item) => (
                <BlogCard
                  key={item.id}
                  blog={item}
                  contentLength={60}
                  showReadMore={false}
                />
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

