import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import NoticeBoard from "../components/NoticeBoard";
import ChairpersonMessage from "../components/ChairpersonMessage";
import BlogsSection from "../components/BlogsSection";
import CalendarModule from "../pages/CalendarModule";
import ScrollReveal, { useScrollReveal } from "../components/ScrollReveal";
import { useCountUp } from "../hooks/useCountUp";
import {
  FaLeaf,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import {
  Users,
  CalendarDays,
  Briefcase,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Handshake,
  Sprout,
} from "lucide-react";

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
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/25">
        <Icon className="h-7 w-7 text-amber-300" strokeWidth={1.8} />
      </div>
      <div className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {count}
        <span className="text-amber-300">{suffix}</span>
      </div>
      <div className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/80 sm:text-sm">
        {stat.label}
      </div>
      <div className="mx-auto mt-3 h-1 w-8 rounded-full bg-amber-400/40 transition-all duration-300 group-hover:w-12 group-hover:bg-amber-400/70" />
    </div>
  );
}

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
    desc: "Milk collection, products & value-added services",
    icon: "🐄",
  },
  {
    label: "Financial Services",
    path: "/financial",
    desc: "Deposit, loan & microfinance solutions",
    icon: "🏦",
  },
  {
    label: "Notice Board",
    path: "/notices",
    desc: "Latest announcements & updates",
    icon: "📢",
  },
  {
    label: "Photo Gallery",
    path: "/gallery",
    desc: "Events, activities & moments",
    icon: "📸",
  },
];

export default function HomePage() {
  const aboutRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div>
      <HeroSlider />

      {/* Stats Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {stats.map((stat, i) => (
            <AnimatedStatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <ScrollReveal>
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Quick access</p>
              <h2 className="font-display text-3xl font-bold text-emerald-950 sm:text-4xl">Explore the cooperative</h2>
              <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-amber-400" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-200"
                >
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-100/50 transition-all duration-500 group-hover:scale-[3] group-hover:bg-emerald-100/20" />
                  <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-white text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:from-emerald-200">
                    {link.icon}
                  </div>
                  <h3 className="relative font-display text-lg font-bold text-emerald-950 transition-colors group-hover:text-emerald-700">
                    {link.label}
                  </h3>
                  <p className="relative mt-2 text-sm leading-6 text-slate-500">{link.desc}</p>
                  <div className="relative mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-all group-hover:gap-2.5">
                    Explore <FaArrowRight className="text-[10px]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* About Section */}
      <ScrollReveal>
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 to-white" />
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur">
                <FaLeaf className="text-amber-500" />
                <span>About Our Cooperative</span>
              </div>
              <h2 className="mb-5 font-display text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">
                Serving Jalthal community with trust, resilience, and shared prosperity.
              </h2>
              <p className="mb-4 text-base leading-8 text-slate-600">
                साना किसान कृषि सहकारी संस्था लिमिटेड (Sana Kisan Agro Cooperative Ltd.) is a member-owned cooperative institution established to serve the agricultural and financial needs of the Jalthal community in Jhapa District, Province No. 1 of Nepal.
              </p>
              <p className="mb-6 text-base leading-8 text-slate-600">
                With a focus on empowering farmers, promoting dairy industry, and providing accessible financial services, we have been a trusted partner for rural prosperity and cooperative development.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/about" className="btn-primary">
                  Read More <FaArrowRight className="text-xs" />
                </Link>
                <Link to="/contact" className="btn-secondary">
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { icon: Sprout, title: "Mission", desc: "Empowering members through cooperative values and sustainable agricultural practices." },
                { icon: TrendingUp, title: "Vision", desc: "A prosperous cooperative community built on trust, transparency, and mutual benefit." },
                { icon: Handshake, title: "Values", desc: "Integrity, solidarity, equity, and democratic member control guide all our actions." },
                { icon: ShieldCheck, title: "Objectives", desc: "Financial inclusion, rural development, and sustainable growth for all members." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-emerald-200"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-sm transition-transform group-hover:scale-110">
                    <item.icon className="h-6 w-6 text-emerald-700" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-emerald-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Message from Chairperson */}
      <ChairpersonMessage />

      {/* Notice Board */}
      <NoticeBoard limit={4} />

      {/* Calendar */}
      <CalendarModule />

      {/* Blogs */}
      <BlogsSection limit={3} />

      {/* CTA Section */}
      <ScrollReveal>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_32%),linear-gradient(135deg,_#0f5a3d_0%,_#146a45_45%,_#0b3d2e_100%)] px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute left-0 top-0 h-72 w-72 -translate-x-24 -translate-y-24 rounded-full bg-white" />
            <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-24 translate-y-24 rounded-full bg-amber-300" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-24">
            <svg viewBox="0 0 1440 120" className="h-full w-full" preserveAspectRatio="none">
              <path d="M0,96 C180,40 360,40 540,76 C720,112 900,120 1080,88 C1260,56 1380,24 1440,10 L1440,120 L0,120 Z" fill="#0a2e22" />
            </svg>
          </div>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200 backdrop-blur-sm">
              <FaCheckCircle className="text-amber-300" />
              Trusted by the community
            </div>
            <h2 className="mb-5 font-display text-4xl font-bold tracking-[0.02em] text-white sm:text-5xl lg:text-[3rem]">
              Become a Member Today
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-emerald-50/90 sm:text-xl">
              Join thousands of members benefiting from cooperative savings, loans, and agricultural support in Jalthal.
            </p>
            <div className="mb-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 text-sm font-bold text-white shadow-[0_8px_24px_rgba(245,166,35,0.35)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(245,166,35,0.45)]"
              >
                Contact Us Now <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/financial"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:text-emerald-900"
              >
                View Services
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-emerald-50/90">
              {[
                "✓ 1000+ Members",
                "✓ Govt. Registered",
                "✓ Secure & Trusted",
              ].map((item) => (
                <span key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm hover:bg-white/20 transition">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
