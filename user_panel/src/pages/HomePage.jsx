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
      {/* Hero Slider */}
      <HeroSlider />

      {/* Stats bar */}
      <div className="bg-primary-700 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center text-white"
            >
              <div className="text-2xl md:text-3xl font-display font-bold text-accent">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-primary-200 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="card-hover flex flex-col items-center text-center p-5 bg-primary-50 hover:bg-primary-100 rounded-2xl border border-primary-100 hover:border-primary-300 group"
              >
                <div className="text-3xl mb-2">{link.icon}</div>
                <div className="font-display font-bold text-primary-900 group-hover:text-primary-700 text-sm">
                  {link.label}
                </div>
                <div className="text-xs text-primary-500 mt-1">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="py-14 px-4 pattern-bg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm mb-3">
              <FaLeaf className="text-accent" />
              <span>About Our Cooperative</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-primary-900 leading-tight mb-4">
              Serving Jalthal Community
              <br />
              <span className="text-primary-600">
                with Integrity & Dedication
              </span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              साना किसान कृषि सहकारी संस्था लिमिटेड (Sana Kisan Agro Cooperative
              Ltd.) is a member-owned cooperative institution established to
              serve the agricultural and financial needs of the Jalthal
              community in Jhapa District, Province No. 1 of Nepal.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              With a focus on empowering farmers, promoting dairy industry, and
              providing accessible financial services, we have been a trusted
              partner for rural prosperity and cooperative development.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Read More <FaArrowRight className="text-xs" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white font-semibold px-5 py-2.5 rounded-lg transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: "🌱",
                title: "Mission",
                desc: "Empowering members through cooperative values and sustainable agricultural practices.",
              },
              {
                icon: "🎯",
                title: "Vision",
                desc: "A prosperous cooperative community built on trust, transparency, and mutual benefit.",
              },
              {
                icon: "🌿",
                title: "Values",
                desc: "Integrity, solidarity, equity, and democratic member control guide all our actions.",
              },
              {
                icon: "📈",
                title: "Objectives",
                desc: "Financial inclusion, rural development, and sustainable growth for all members.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow-sm border border-primary-100"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-display font-bold text-primary-900 text-sm mb-1">
                  {item.title}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Board */}
      <NoticeBoard limit={5} />

      {/* Calendar */}
      <CalendarModule />

      {/* Blogs */}
      <BlogsSection limit={3} />

      {/* CTA Banner */}
      <section className="py-14 px-4 mb-44 bg-gradient-to-r from-primary-800 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-32 translate-y-32" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10 pt-7 pb-6">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Become a Member Today
          </h2>
          <p className="text-primary-100 text-lg mb-12">
            Join thousands of members benefiting from cooperative savings,
            loans, and agricultural support in Jalthal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-accent hover:bg-yellow-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Contact Us Now <FaArrowRight />
            </Link>
            <Link
              to="/financial"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
