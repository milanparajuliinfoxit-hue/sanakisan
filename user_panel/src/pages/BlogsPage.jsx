import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaUser,
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";
import { fetchBlogs, fetchBlogById, getImageUrl } from "../api/config";
import { formatFullDate } from "../utils/dateUtils";
import PageBanner from "../components/PageBanner";
import BlogCard from "../components/BlogCard";
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
      .then((res) => {
        if (cancelled) return;
        console.log("fetchBlogs res:", res);
        setBlogs(res.data || []);
        setTotal(res.totalItems || 0);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
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
      <PageBanner
        title="News & Blogs"
        subtitle="Latest news, events and cooperative updates"
        breadcrumb="Home › News & Blogs"
        eyebrow="Stories & insights"
      />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative mb-8 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search news & blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-emerald-100 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
            />
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse overflow-hidden rounded-[1.6rem] bg-emerald-100"
                />
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
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-full border border-emerald-200 px-4 py-2 text-sm transition hover:bg-emerald-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-sm text-slate-500">
                Page {page}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page * limit >= total}
                className="rounded-full border border-emerald-200 px-4 py-2 text-sm transition hover:bg-emerald-50 disabled:opacity-40"
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

  const limit = 3;

  // Fetch current blog
  useEffect(() => {
  setLoading(true);

  fetchBlogById(id)
    .then((data) => {
      console.log("Received:", data);
      setBlog(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setError("Article not found.");
      setLoading(false);
    });
}, [id]);

  // Fetch blogs for recommendation
  useEffect(() => {
    fetchBlogs(limit, 1)
      .then((res) => {
        setBlogs(res.data || []);
      })
      .catch(console.error);
  }, []);

  const recommendedBlogs = blogs
    .filter((item) => String(item.id) !== String(id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <div className="flex max-w-7xl mx-auto gap-10 py-10">
      {/* Left Side */}
      <div className="flex-1">
        <Link
          to="/blogs"
          className="mb-6 inline-flex items-center gap-2 text-lg hover:text-green-700"
        >
          <FaArrowLeft />
          Back to News & Blogs
        </Link>

        {loading && (
          <div className="space-y-8">
            <div className="h-96 animate-pulse bg-emerald-100 rounded-xl" />
            <div className="h-10 w-2/3 animate-pulse bg-emerald-100 rounded" />
            <div className="h-40 animate-pulse bg-emerald-100 rounded" />
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-8 text-center">{error}</div>
        )}

        {!loading && !error && blog && (
          <article className="space-y-8">
            <h1 className="text-4xl font-bold">{blog.title}</h1>

            <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-6">
              {blog.author && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    {blog.author[0].toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold">{blog.author}</p>
                    <p className="text-sm text-gray-500">Author</p>
                  </div>
                </div>
              )}

              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <FaCalendarAlt className="text-emerald-600" />
                  <span>{formatFullDate(blog.createdAt)}</span>
                </div>
              </div>
            </div>

            {blog.featuredImage && (
              <img
                src={getImageUrl(blog.featuredImage)}
                alt={blog.title}
                className="w-full rounded-xl object-cover max-h-[500px]"
              />
            )}

            <div className="mt-2 flex flex-col items-end">
              <span className="font-semibold italic">Recently updated on</span>

              <div className="flex items-center gap-2">
                <MdUpdate className="text-emerald-600" />
                <span className="italic">{formatFullDate(blog.updatedAt)}</span>
              </div>
            </div>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: blog.content || "<p>No content available.</p>",
              }}
            />
          </article>
        )}
      </div>

      {/* Right Sidebar */}
      <aside className="w-96 shrink-0">
        <h2 className="text-2xl font-semibold mb-6">Related Blogs</h2>

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
  );
}

