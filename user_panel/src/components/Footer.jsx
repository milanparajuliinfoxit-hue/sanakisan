import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-emerald-100/70 bg-emerald-950 text-emerald-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 shadow-sm">
              <img src="/assets/jalthal.png" alt="Jalthal Logo" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <div className="font-display text-sm font-semibold leading-tight text-white">
                साना किसान कृषि सहकारी संस्था लि.
              </div>
              <div className="text-xs text-emerald-300">Sana Kisan Agro Cooperative Ltd.</div>
            </div>
          </div>
          <p className="mb-4 text-sm leading-7 text-emerald-300/90">
            A trusted cooperative institution serving the Jalthal community with dedication to prosperity and financial empowerment.
          </p>
          <div className="flex gap-3">
            {[
              { href: "https://www.facebook.com", Icon: FaFacebook, hover: "hover:bg-blue-600" },
              { href: "https://www.youtube.com", Icon: FaYoutube, hover: "hover:bg-red-600" },
              { href: "https://www.twitter.com", Icon: FaTwitter, hover: "hover:bg-sky-500" },
            ].map(({ href, Icon, hover }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-emerald-100 transition ${hover}`}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 border-b border-white/10 pb-2 text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Home", path: "/" },
              { label: "About Us", path: "/about" },
              { label: "Notice Board", path: "/notices" },
              { label: "Gallery", path: "/gallery" },
              { label: "News & Blogs", path: "/blogs" },
              { label: "Contact Us", path: "/contact" },
            ].map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="flex items-center gap-1.5 text-emerald-300 transition hover:text-amber-300">
                  <span className="text-xs text-amber-300">›</span> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 border-b border-white/10 pb-2 text-lg font-semibold text-white">Our Services</h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Deposit Services", path: "/financial#deposit" },
              { label: "Loan Services", path: "/financial#loan" },
              { label: "Dairy Industry", path: "/dairy" },
              { label: "Required Documents", path: "/financial#documents" },
              { label: "Product Catalog", path: "/dairy#products" },
            ].map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="flex items-center gap-1.5 text-emerald-300 transition hover:text-amber-300">
                  <span className="text-xs text-amber-300">›</span> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 border-b border-white/10 pb-2 text-lg font-semibold text-white">Contact Information</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3 text-emerald-300/90">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-amber-300" />
              <span>Haldibari-2, Jhapa, Nepal<br />Province No. 1, Nepal</span>
            </li>
            <li className="flex items-center gap-3 text-emerald-300/90">
              <FaPhone className="flex-shrink-0 text-amber-300" />
              <a href="tel:+977-1-4000000" className="transition hover:text-amber-300">+977-1-4000000</a>
            </li>
            <li className="flex items-center gap-3 text-emerald-300/90">
              <FaEnvelope className="flex-shrink-0 text-amber-300" />
              <a href="mailto:info@sfacljalthal.com.np" className="transition hover:text-amber-300">info@sfacljalthal.com.np</a>
            </li>
          </ul>
          <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/10 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div className="mb-1 text-xs uppercase tracking-[0.24em] text-emerald-300">Information Administrator</div>
            <div className="text-sm font-semibold text-white">Ramesh Kumar Shrestha</div>
            <div className="text-xs text-emerald-300">Executive Director</div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-emerald-300/80 sm:px-6 md:flex-row lg:px-8">
          <div>© {year} साना किसान कृषि सहकारी संस्था लि. (Sana Kishan Agro Cooperative Ltd.) — All Rights Reserved</div>
          <div className="flex flex-wrap items-center gap-1">
            <span>sfacljalthal.com.np</span>
            <span>·</span>
            <span>Registered with Department of Cooperatives, Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
