import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0a2e22] text-emerald-50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_30%)]" />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-amber-400/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-200/30 bg-gradient-to-br from-white/10 to-amber-50/10 shadow-sm backdrop-blur-sm">
              <img src="/assets/jalthal.png" alt="Jalthal Logo" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <div className="font-display text-sm font-semibold leading-tight text-white whitespace-nowrap">
                साना किसान कृषि सहकारी संस्था लि.
              </div>
              <div className="text-xs text-emerald-200/80">Sana Kisan Agro Cooperative Ltd.</div>
            </div>
          </div>
          <p className="mb-5 text-sm leading-7 text-emerald-200/85">
            A trusted cooperative institution serving the Jalthal community with dedication to prosperity and financial empowerment.
          </p>
          <div className="flex gap-3">
            {[
              { href: "https://www.facebook.com", Icon: FaFacebook, hover: "hover:bg-blue-600" },
              { href: "https://www.youtube.com", Icon: FaYoutube, hover: "hover:bg-red-600" },
              { href: "https://www.twitter.com", Icon: FaTwitter, hover: "hover:bg-sky-500" },
            ].map(({ href, Icon, hover }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-emerald-100/80 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${hover}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Quick Links</h3>
          <div className="mb-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-300" />
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "Home", path: "/" },
              { label: "About Us", path: "/about" },
              { label: "Notice Board", path: "/notices" },
              { label: "Gallery", path: "/gallery" },
              { label: "News & Blogs", path: "/blogs" },
              { label: "Contact Us", path: "/contact" },
            ].map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="group flex items-center gap-2 text-emerald-200/90 transition-all duration-300 ease-out hover:translate-x-1 hover:text-white"
                >
                  <span className="text-base text-amber-300 transition group-hover:text-white">›</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Our Services</h3>
          <div className="mb-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-300" />
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "Deposit Services", path: "/financial#deposit" },
              { label: "Loan Services", path: "/financial#loan" },
              { label: "Dairy Industry", path: "/dairy" },
              { label: "Required Documents", path: "/financial#documents" },
              { label: "Product Catalog", path: "/dairy#products" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className="group flex items-center gap-2 text-emerald-200/90 transition-all duration-300 ease-out hover:translate-x-1 hover:text-white"
                >
                  <span className="text-base text-amber-300 transition group-hover:text-white">›</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Contact Information</h3>
          <div className="mb-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-300" />
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3 text-emerald-200/90">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-amber-300" />
              <span>Haldibari-2, Jhapa, Nepal<br />Province No. 1, Nepal</span>
            </li>
            <li className="flex items-center gap-3 text-emerald-200/90">
              <FaPhone className="flex-shrink-0 text-amber-300" />
              <a href="tel:+977-1-4000000" className="transition hover:text-amber-300">+977-1-4000000</a>
            </li>
            <li className="flex items-center gap-3 text-emerald-200/90">
              <FaEnvelope className="flex-shrink-0 text-amber-300" />
              <a href="mailto:info@sfacljalthal.com.np" className="transition hover:text-amber-300">info@sfacljalthal.com.np</a>
            </li>
          </ul>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
            <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-amber-300">Information Administrator</div>
            <div className="text-sm font-semibold text-white">Ramesh Kumar Shrestha</div>
            <div className="text-xs text-emerald-200/80">Executive Director</div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-emerald-200/70 sm:px-6 md:flex-row lg:px-8">
          <div>© {year} साना किसान कृषि सहकारी संस्था लि. (Sana Kishan Agro Cooperative Ltd.) — All Rights Reserved</div>
          <div className="flex flex-wrap items-center gap-1">
            <span>sfacljalthal.com.np</span>
            <span className="text-emerald-500/50">·</span>
            <span>Registered with Department of Cooperatives, Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
