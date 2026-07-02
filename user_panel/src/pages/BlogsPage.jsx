import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaNewspaper, FaCalendarAlt, FaUser, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { fetchBlogs, fetchBlogById, getImageUrl } from '../api/config';
import {  formatFullDate } from '../utils/dateUtils';
import PageBanner from '../components/PageBanner';
import BlogCard from '../components/BlogCard';

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
      console.log('fetchBlogs res:', res);
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
      <PageBanner title="News & Blogs" subtitle="Latest news, events and cooperative updates" breadcrumb="Home › News & Blogs" eyebrow="Stories & insights" />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative mb-8 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search news & blogs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-emerald-100 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
            />
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 animate-pulse overflow-hidden rounded-[1.6rem] bg-emerald-100" />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50/70 py-16 text-center text-slate-500">
              <FaNewspaper className="mx-auto mb-3 text-5xl opacity-20" />
              <p>No articles found.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((blog, i) => (
                <BlogCard
                  key={blog.id || i}
                  blog={blog}
                  contentLength={120}
                  showReadMore={true}
                />
              ))}
            </div>
          )}

          {total > limit && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => handlePageChange(Math.max(1, page - 1))} disabled={page === 1}
                className="rounded-full border border-emerald-200 px-4 py-2 text-sm transition hover:bg-emerald-50 disabled:opacity-40">
                ← Prev
              </button>
              <span className="px-4 py-2 text-sm text-slate-500">Page {page}</span>
              <button onClick={() => handlePageChange(page + 1)} disabled={page * limit >= total}
                className="rounded-full border border-emerald-200 px-4 py-2 text-sm transition hover:bg-emerald-50 disabled:opacity-40">
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
      <div className="bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),linear-gradient(135deg,#14532d_0%,#166534_48%,#15803d_100%)] px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Link to="/blogs" className="mb-4 inline-flex items-center gap-2 text-sm text-emerald-50/90 transition hover:text-white">
            <FaArrowLeft /> Back to News & Blogs
          </Link>
          <h1 className="font-display text-2xl font-semibold text-white md:text-3xl">
            {loading ? 'Loading...' : (blog?.title || 'Article')}
          </h1>
        </div>
      </div>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {loading && <div className="h-64 animate-pulse rounded-[1.6rem] bg-emerald-100" />}
          {error && <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50/70 py-12 text-center text-slate-500">{error}</div>}
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
