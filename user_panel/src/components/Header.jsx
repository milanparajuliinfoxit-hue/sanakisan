import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaPhone,
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser,
} from "react-icons/fa";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Notice Board", path: "/notices" },
  { label: "Gallery", path: "/gallery" },
  {
    label: "Dairy Industry",
    path: "/dairy",
    sub: [
      { label: "Description", path: "/dairy#description" },
      { label: "Product Catalog", path: "/dairy#products" },
    ],
  },
  {
    label: "Financial",
    path: "/financial",
    sub: [
      { label: "Overview", path: "/financial#overview" },
      { label: "Deposit Services", path: "/financial#deposit" },
      { label: "Loan Services", path: "/financial#loan" },
      { label: "Required Documents", path: "/financial#documents" },
    ],
  },
  { label: "News / Blogs", path: "/blogs" },
  { label: "Contact Us", path: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      {/* Top bar - minimal, dark */}
      <div className="relative z-50 bg-emerald-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <a href="tel:+977-1-4000000" className="flex items-center gap-1.5 text-emerald-200/80 transition hover:text-amber-300">
              <FaPhone className="text-[10px] text-amber-400" />
              <span className="hidden sm:inline">+977-1-4000000</span>
            </a>
            <a href="mailto:info@sfacljalthal.com.np" className="hidden items-center gap-1.5 text-emerald-200/80 transition hover:text-amber-300 md:flex">
              <FaEnvelope className="text-[10px] text-amber-400" />
              <span>info@sfacljalthal.com.np</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            {[
              { href: "https://www.facebook.com", Icon: FaFacebook },
              { href: "https://www.youtube.com", Icon: FaYoutube },
              { href: "https://www.twitter.com", Icon: FaTwitter },
            ].map(({ href, Icon }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="rounded-full p-1.5 text-emerald-300/70 transition hover:bg-white/10 hover:text-amber-300" aria-label="Social link">
                <Icon className="text-xs" />
              </a>
            ))}
            <Link to="/login" className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:shadow-md hover:brightness-110">
              <FaUser className="text-[10px]" /> Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main header: logo + nav combined */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-xl"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
              <img src="/assets/jalthal.png" alt="Jalthal Logo" className="h-8 w-8 object-contain" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-sm font-bold leading-tight text-emerald-900 sm:text-base">
                साना किसान कृषि सहकारी संस्था लि.
              </div>
              <div className="text-xs text-emerald-600">Sana Kisan Agro Cooperative Ltd.</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center lg:flex gap-1">
            {navItems.map((item) => (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  onClick={() => setOpenDropdown(null)}
                  className={`flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-200 no-underline ${
                    location.pathname === item.path
                      ? "bg-emerald-50 text-emerald-800 shadow-sm"
                      : "text-slate-600 hover:bg-emerald-50/60 hover:text-emerald-700"
                  }`}
                >
                  {item.label}
                  {item.sub ? <FaChevronDown className="text-[9px] opacity-50 transition group-hover:rotate-180" /> : null}
                </Link>
                {item.sub && (
                  <div className="invisible absolute left-0 top-full z-50 min-w-48 origin-top-right scale-95 rounded-xl border border-slate-100 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                    <div className="overflow-hidden rounded-xl py-1">
                      {item.sub.map((sub, idx) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`block px-4 py-2.5 text-sm transition ${
                            location.pathname + location.hash === sub.path
                              ? "bg-emerald-50 text-emerald-700 font-semibold"
                              : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                          } ${idx !== item.sub.length - 1 ? "border-b border-emerald-50" : ""}`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            Menu
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
            mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-slate-100 bg-white shadow-inner">
            {navItems.map((item) => (
              <div key={item.path}>
                <div className="flex items-center justify-between">
                  <Link
                    to={item.path}
                    onClick={closeMenu}
                    className={`flex-1 px-6 py-3.5 text-sm font-medium transition ${
                      location.pathname === item.path ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.sub && (
                    <button
                      className="px-4 py-3.5 text-slate-500 transition hover:text-emerald-700"
                      onClick={() => setOpenDropdown(openDropdown === item.path ? null : item.path)}
                      aria-label={`Toggle ${item.label}`}
                    >
                      <FaChevronDown className={`text-xs transition ${openDropdown === item.path ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                {item.sub && openDropdown === item.path && (
                  <div className="bg-slate-50">
                    {item.sub.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={closeMenu}
                        className={`block pl-10 pr-5 py-2.5 text-sm transition ${
                          location.pathname + location.hash === sub.path
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
