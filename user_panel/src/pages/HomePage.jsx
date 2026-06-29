import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import NoticeBoard from "../components/NoticeBoard";
import BlogsSection from "../components/BlogsSection";
import CalendarModule from "../pages/CalendarModule";
import {
  FaLeaf,
  FaArrowRight,
} from "react-icons/fa";
import {
  Users,
  CalendarDays,
  Briefcase,
  MapPin,
} from "lucide-react";

/* ───── Animated Counter Hook ───── */
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);

    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(tick);
  }, [target, duration, started]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [start]);

  return { count, ref };
}

/* ───── Stat Card Component ───── */
function AnimatedStatCard({ stat, index }) {
  const numericValue = parseInt(stat.value.replace(/[^\d]/g, ""), 10);
  const suffix = stat.value.replace(/[\d]/g, "");
  const { count, ref } = useCountUp(numericValue, 2200);
  const Icon = stat.icon;

  const gradients = [
    "from-emerald-800 via-emerald-700 to-emerald-600",
    "from-emerald-900 via-emerald-800 to-teal-700",
    "from-emerald-800 via-teal-700 to-emerald-600",
    "from-emerald-900 via-emerald-700 to-emerald-600",
  ];

  return (
    <div
      ref={ref}
      className={`stat-card group rounded-[1.6rem] border border-white/10 bg-gradient-to-br ${gradients[index % 4]} px-5 py-6 text-center text-white shadow-lg`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/25">
        <Icon className="h-7 w-7 text-amber-300" strokeWidth={1.8} />
      </div>

      {/* Animated Number */}
      <div className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {count}
        <span className="text-amber-300">{suffix}</span>
      </div>

      {/* Label */}
      <div className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/80 sm:text-sm">
        {stat.label}
      </div>

      {/* Decorative dot */}
      <div className="mx-auto mt-3 h-1 w-8 rounded-full bg-amber-400/40 transition-all duration-300 group-hover:w-12 group-hover:bg-amber-400/70" />
    </div>
  );
}

/* ───── Stats Data ───── */
const stats = [
  { value: "2500+", label: "Members", icon: Users },
  { value: "15+", label: "Years of Service", icon: CalendarDays },
  { value: "50+", label: "Loan Products", icon: Briefcase },
  { value: "10+", label: "Villages Served", icon: MapPin },
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

/* ───── Fade-in on Scroll Hook ───── */
function useFadeInOnScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function HomePage() {
  const quickLinksRef = useFadeInOnScroll();
  const aboutRef = useFadeInOnScroll();
  const ctaRef = useFadeInOnScroll();

  return (
    <div>
      <HeroSlider />

      {/* ───── Stats Section ───── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Decorative background elements */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, i) => (
            <AnimatedStatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </section>

      {/* ───── Quick Links ───── */}
      <section ref={quickLinksRef} className="fade-in-up bg-white px-4 py-10 sm:px-6 lg:px-8">
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

      {/* ───── About Section ───── */}
      <section ref={aboutRef} className="fade-in-up pattern-bg px-4 py-14 sm:px-6 lg:px-8">
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

      {/* ───── CTA Section ───── */}
      <section ref={ctaRef} className="fade-in-up relative mb-24 overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 px-4 py-16 sm:px-6 lg:px-8">
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
