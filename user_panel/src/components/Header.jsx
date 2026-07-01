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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      <header className="w-full border-b border-emerald-100/80 bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.03)] backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="bg-emerald-950 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <a href="tel:+977-1-4000000" className="flex items-center gap-1.5 text-emerald-100 transition hover:text-amber-300">
                <FaPhone className="text-[11px] text-amber-300" />
                <span>+977-1-4000000</span>
              </a>
              <a href="mailto:info@sfacljalthal.com.np" className="hidden items-center gap-1.5 text-emerald-100 transition hover:text-amber-300 md:flex">
                <FaEnvelope className="text-[11px] text-amber-300" />
                <span>info@sfacljalthal.com.np</span>
              </a>
            </div>
            <div className="flex items-center gap-3">
              {[
                { href: "https://www.facebook.com", Icon: FaFacebook },
                { href: "https://www.youtube.com", Icon: FaYoutube },
                { href: "https://www.twitter.com", Icon: FaTwitter },
              ].map(({ href, Icon }) => (
                <a key={href} href={href} target="_blank" rel="noreferrer" className="rounded-full p-2 text-emerald-100 transition hover:bg-white/10 hover:text-amber-300" aria-label="Social link">
                  <Icon />
                </a>
              ))}
              <Link to="/login" className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-400">
                <FaUser className="text-[11px]" /> Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 shadow-sm">
              <img src="/assets/jalthal.png" alt="Jalthal Logo" className="h-10 w-10 object-contain" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-base font-semibold leading-tight text-emerald-900 sm:text-lg">
                साना किसान कृषि सहकारी संस्था लि.
              </div>
              <div className="text-sm text-emerald-700">Sana Kisan Agro Cooperative Ltd. — Jalthal</div>
            </div>
          </Link>
          <div className="hidden lg:block text-right">
            <div className="font-display text-sm font-semibold text-amber-600">सहकारी — समृद्धि — सेवा</div>
            <div className="text-sm text-emerald-700">Cooperative · Prosperity · Service</div>
          </div>
        </div>
      </header>

      <nav className={`sticky top-0 z-50 min-h-[68px] border-b border-white/10 bg-emerald-900/95 backdrop-blur transition-all duration-300 ease-out ${scrolled ? "shadow-xl" : ""}`}>
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="hidden items-center lg:flex gap-x-2">
            {navItems.map((item) => (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  onClick={() => setOpenDropdown(null)}
                  className={`nav-link flex items-center gap-1 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-out no-underline hover:-translate-y-0.5 hover:bg-white/10 hover:text-amber-300 hover:shadow-[0_0_16px_rgba(251,191,36,0.2)] ${location.pathname === item.path ? "bg-white/10 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.24)] ring-1 ring-white/10" : ""}`}
                >
                  {item.label}
                  {item.sub ? <FaChevronDown className="text-[10px] opacity-70 transition group-hover:rotate-180" /> : null}
                </Link>
                {item.sub ? (
                  <div className="invisible absolute left-0 top-full z-50 min-w-48 rounded-b-xl border-t-2 border-amber-400 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    {item.sub.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className={`block px-4 py-2.5 text-sm transition ${
                          location.pathname + location.hash === sub.path
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-emerald-800 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <button className="rounded-lg p-3 text-white transition-all duration-300 ease-out hover:bg-white/10 hover:shadow-[0_0_12px_rgba(251,191,36,0.2)] lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-label="Toggle navigation menu">
            {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <div className="text-sm font-semibold text-white lg:hidden">Menu</div>
        </div>

        {mobileOpen ? (
          <div className="border-t border-white/10 bg-emerald-950/95 lg:hidden">
            {navItems.map((item) => (
              <div key={item.path}>
                <div className="flex items-center justify-between">
                  <Link
                    to={item.path}
                    onClick={closeMenu}
                    className="flex-1 px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-white/10 hover:text-amber-200"
                  >
                    {item.label}
                  </Link>
                  {item.sub ? (
                    <button className="px-4 py-3.5 text-white transition-all duration-300 ease-out hover:bg-white/10 hover:text-amber-200" onClick={() => setOpenDropdown(openDropdown === item.path ? null : item.path)} aria-label={`Toggle ${item.label}`}> 
                      <FaChevronDown className={`text-xs transition ${openDropdown === item.path ? "rotate-180" : ""}`} />
                    </button>
                  ) : null}
                </div>
                {item.sub && openDropdown === item.path ? (
                  <div className="bg-emerald-900/80">
                    {item.sub.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={closeMenu}
                        className={`block pl-10 pr-5 py-2.5 text-sm transition-all duration-300 ease-out ${
                          location.pathname + location.hash === sub.path
                            ? "bg-emerald-800/40 text-white font-semibold"
                            : "text-emerald-100 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        → {sub.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </nav>
    </>
  );
}
