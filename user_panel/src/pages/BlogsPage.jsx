import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaSearch,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { fetchBlogs, fetchBlogById, getImageUrl } from "../api/config";
import { formatFullDate } from "../utils/dateUtils";
import PageBreadcrumb from "../components/PageBreadcrumb";
import BlogCard from "../components/BlogCard";
import EmptyState from "../components/EmptyState";
import { SkeletonGrid } from "../components/Skeleton";
import { ArrowLeft } from "lucide-react";

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
      <PageBreadcrumb
        title="News & Blogs"
        items={[{ label: "Home", path: "/" }, { label: "News & Blogs" }]}
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
              onChange={(e) => setSearch(e.target.value)}
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
            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="flex items-center px-4 text-sm text-slate-500">
                Page {page}
              </span>
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
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setBlog(null);
    setError(null);
    fetchBlogById(id)
      .then((data) => {
        if (cancelled) return;
        setBlog(data?.data || data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Article not found.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    fetchBlogs(4, 1)
      .then((res) => {
        const others = (res.data || []).filter(
          (item) => String(item.id) !== String(id),
        );
        // stable shuffle computed once when data arrives, not on every render
        for (let i = others.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [others[i], others[j]] = [others[j], others[i]];
        }
        setRecommendedBlogs(others.slice(0, 4));
      })
      .catch(console.error);
  }, [id]);

  return (
    <div className="bg-white">
      <Link
        to="/blogs"
        className="flex gap-2 items-center ml-4 p-4 cursor-pointer hover:text-green-700"
      >
        <ArrowLeft size={24} />
        <span className="text-lg font-semibold">Go Back</span>
      </Link>
      <section className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex gap-8 items-start">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
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
              <>
                <h1 className="text-3xl font-bold text-emerald-950 mb-4">
                  {blog.title}
                </h1>
                <div className="flex justify-end p-3">
                       
                    <div className="flex gap-2 p-4 items-center">
                      <FaCalendarAlt size={20} className="text-green-500"/>
                      <div className="flex flex-col ">
                    <span className=" font-medium">Published on</span>
                        <div className="flex items-center gap-1.5">
                        <span className="italic">
                           {formatFullDate(blog.createdAt)}
                        </span>
                        
                      </div>
                  </div>
                    </div>
                </div>

                <div>
                  {blog.featuredImage && (
                    <div className="h-auto overflow-hidden">
                      <img
                        src={getImageUrl(blog.featuredImage)}
                        alt={blog.title}
                        className="mb-6 max-h-auto w-full rounded-2xl object-cover"
                      />
                    </div>
                  )}
                </div>
                <article className="overflow-hidden bg-white ">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-slate-500 mb-6">
                      <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-slate-500 mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-emerald-400 text-white flex items-center justify-center font-semibold uppercase">
                            {blog.author?.charAt(0)}
                          </div>

                          <div className="flex flex-col leading-tight">
                            <span className="text-sm text-slate-400">
                              Author
                            </span>
                            <span className="font-bold text-slate-600">
                              {blog.author}
                            </span>
                          </div>
                        </div>
                      </div>
                  {/**Updated on */}
                  <div className="flex flex-col ">
                    <span className="ml-6">Recently Updated on</span>
                        <div className="flex items-center gap-1.5">
                        <MdUpdate className="text-emerald-600" />
                        <span className="italic">
                           {formatFullDate(blog.updatedAt)}
                        </span>
                      </div>
                  </div>
                    </div>

                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: blog.content || "<p>No content available.</p>",
                      }}
                    />
                  </div>
                </article>
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 shrink-0 hidden lg:block">
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
      </section>
    </div>
  );
}
