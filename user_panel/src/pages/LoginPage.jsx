import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const API_BASE =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(21,128,61,0.08),transparent_40%),linear-gradient(180deg,#f8fdf9_0%,#f3f8f5_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-soft">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-400 bg-emerald-800">
              <img
                src="/assets/jalthal.png"
                alt="Jalthal Logo"
                className="w-cover h-cover object-contain"
              />
            </div>
            <h1 className="font-display text-2xl font-semibold text-emerald-950">
              Member Login
            </h1>
            <p className="mt-1 text-sm text-slate-500">SFACL Jalthal Portal</p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Username / Email
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                  className="w-full rounded-2xl border border-emerald-100 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-emerald-100 py-3 pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-800 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <Link
              to="/"
              className="font-semibold text-emerald-700 transition hover:text-emerald-900"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
