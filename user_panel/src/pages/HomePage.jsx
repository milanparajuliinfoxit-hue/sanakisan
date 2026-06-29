import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import NoticeBoard from "../components/NoticeBoard";
import BlogsSection from "../components/BlogsSection";
import CalendarModule from "../pages/CalendarModule";
import {
  FaLeaf,
  FaHandshake,
  FaChartLine,
  FaUsers,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

const stats = [
  { value: "2500+", label: "Members", icon: FaUsers },
  { value: "15+", label: "Years of Service", icon: FaStar },
  { value: "50+", label: "Loan Products", icon: FaChartLine },
  { value: "10+", label: "Villages Served", icon: FaHandshake },
];

const quickLinks = [
  {
    label: "Dairy Industry",
    path: "/dairy",
    desc: "Products & services",
    icon: "🐄",
  },
  {
    label: "Financial Services",
    path: "/financial",
    desc: "Deposit & loan info",
    icon: "🏦",
  },
  {
    label: "Notice Board",
    path: "/notices",
    desc: "Latest announcements",
    icon: "📢",
  },
  {
    label: "Photo Gallery",
    path: "/gallery",
    desc: "Events & activities",
    icon: "📸",
  },
];

export default function HomePage() {
  return (
    <div>
      <HeroSlider />

      <section className="border-y border-emerald-100/70 bg-emerald-900 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-[1.4rem] border border-white/10 bg-white/10 px-4 py-4 text-center text-white backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="font-display text-2xl font-semibold text-amber-300 sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-100/90 sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Quick access</p>
              <h2 className="font-display text-2xl font-semibold text-emerald-950">Explore the cooperative</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map((link) => (
              <Link key={link.path} to={link.path} className="card-hover premium-card group flex flex-col items-start rounded-[1.6rem] p-5 hover:border-emerald-200">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">{link.icon}</div>
                <div className="font-display text-lg font-semibold text-emerald-950 group-hover:text-emerald-700">{link.label}</div>
                <div className="mt-2 text-sm leading-6 text-emerald-700/80">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pattern-bg px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-sm font-semibold text-emerald-700">
              <FaLeaf className="text-amber-500" />
              <span>About Our Cooperative</span>
            </div>
            <h2 className="mb-4 font-display text-3xl font-semibold leading-tight text-emerald-950 sm:text-4xl">
              Serving Jalthal community with trust, resilience, and shared prosperity.
            </h2>
            <p className="mb-4 text-base leading-8 text-slate-600">
              साना किसान कृषि सहकारी संस्था लिमिटेड (Sana Kisan Agro Cooperative Ltd.) is a member-owned cooperative institution established to serve the agricultural and financial needs of the Jalthal community in Jhapa District, Province No. 1 of Nepal.
            </p>
            <p className="mb-6 text-base leading-8 text-slate-600">
              With a focus on empowering farmers, promoting dairy industry, and providing accessible financial services, we have been a trusted partner for rural prosperity and cooperative development.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/about" className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
                Read More <FaArrowRight className="text-xs" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-emerald-700 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-700 hover:text-white">
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "🌱", title: "Mission", desc: "Empowering members through cooperative values and sustainable agricultural practices." },
              { icon: "🎯", title: "Vision", desc: "A prosperous cooperative community built on trust, transparency, and mutual benefit." },
              { icon: "🌿", title: "Values", desc: "Integrity, solidarity, equity, and democratic member control guide all our actions." },
              { icon: "📈", title: "Objectives", desc: "Financial inclusion, rural development, and sustainable growth for all members." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-sm">
                <div className="mb-3 text-2xl">{item.icon}</div>
                <div className="font-display text-lg font-semibold text-emerald-950">{item.title}</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NoticeBoard limit={5} />
      <CalendarModule />
      <BlogsSection limit={3} />

      <section className="relative mb-24 overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-0 top-0 h-64 w-64 -translate-x-24 -translate-y-24 rounded-full bg-white" />
          <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-24 translate-y-24 rounded-full bg-amber-300" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="mb-3 font-display text-3xl font-semibold text-white sm:text-4xl">Become a member today</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-emerald-100">
            Join thousands of members benefiting from cooperative savings, loans, and agricultural support in Jalthal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-amber-400">
              Contact Us Now <FaArrowRight />
            </Link>
            <Link to="/financial" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
