import { useEffect, useRef } from "react";
import {
  FaLeaf,
  FaAward,
  FaCheckCircle,
  FaFileAlt,
  FaArrowRight,
} from "react-icons/fa";
import PageBanner from "../components/PageBanner";
import LeadershipSection from "../components/LeadershipSection";

/* ─────────────────────────────────────────────────────────────────────────
   ANIMATION HOOK: Fade-in-up on Scroll
   ───────────────────────────────────────────────────────────────────────── */
function useScrollAnimation(triggerOnce = true) {
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-up");
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [triggerOnce]);

  return ref;
}

/* ─────────────────────────────────────────────────────────────────────────
   STAT CARD COMPONENT with Staggered Animation
   ───────────────────────────────────────────────────────────────────────── */
function StatItem({ label, value, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.animation = `fadeUpStagger 0.6s ease-out ${delay}ms both`;
    }
  }, [delay]);

  return (
    <div ref={ref} className="flex justify-between items-center py-3 border-b border-emerald-100 last:border-0 hover:bg-white/40 transition-colors px-2 rounded">
      <span className="text-sm font-medium text-emerald-700">{label}</span>
      <span className="text-base font-bold text-emerald-950">{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MISSION/VISION CARD COMPONENT with Hover Effects
   ───────────────────────────────────────────────────────────────────────── */
function MVCard({ icon, title, color, borderColor, content, delay }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.animation = `fadeUpStagger 0.6s ease-out ${delay}ms both`;
    }
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border-2 ${borderColor} ${color} p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg group cursor-default`}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="mb-4 font-display text-xl font-semibold text-emerald-950 group-hover:text-emerald-900 transition-colors">
        {title}
      </h3>
      <p className="text-sm leading-7 text-slate-700">{content}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  const whoWeAreRef = useScrollAnimation();
  const mvRef = useScrollAnimation();
  const registrationRef = useScrollAnimation();

  return (
    <div>
      <style>{`
        @keyframes fadeUpStagger {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUpStagger 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <PageBanner
        title="About Us"
        subtitle="Our Story, Mission & Vision"
        breadcrumb="Home › About Us"
        eyebrow="Cooperative identity"
      />

      {/* ═════════════════════════════════════════════════════════════════════════
          SECTION 1: WHO WE ARE + KEY STATISTICS
          ═════════════════════════════════════════════════════════════════════════ */}
      <section ref={whoWeAreRef} className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-5 lg:gap-8">
          {/* LEFT COLUMN: TEXT CONTENT */}
          <div className="lg:col-span-3">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-sm font-semibold text-emerald-700 backdrop-blur-sm">
              <FaLeaf className="text-amber-500" />
              Who We Are
            </div>

            <h2 className="mb-4 font-display text-3xl sm:text-4xl font-bold leading-tight text-emerald-950">
              <span className="block text-2xl sm:text-3xl text-emerald-800 mb-2">साना किसान कृषि सहकारी संस्था लिमिटेड</span>
              <span className="text-amber-600">Sana Kisan Agro Cooperative Ltd.</span>
            </h2>

            <div className="space-y-5 text-slate-700 leading-8 max-w-2xl">
              <p>
                Sana Kisan Agro Cooperative Ltd. (SFACL) is a registered cooperative institution serving the Jalthal community of Sunsari District in Province No. 1, Nepal. Established with the core principle of <span className="font-semibold text-emerald-900">"member-owned, member-controlled, member-benefited,"</span> SFACL has been a pillar of rural financial and agricultural development.
              </p>

              <p>
                Our cooperative brings together farmers, entrepreneurs, and community members to create a collective force for economic empowerment. Through pooled savings, affordable credit, and agricultural support services — especially in the dairy industry — we help our members achieve financial security and prosperity.
              </p>

              <p>
                Registered with the Department of Cooperatives of the Government of Nepal, SFACL operates under the Cooperative Act and maintains strict adherence to cooperative values including democracy, equality, equity, and solidarity.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: STATISTICS CARD */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-8 shadow-lg backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
              <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-emerald-700">Key Statistics</h3>
              <div className="mb-6 h-1 w-12 bg-gradient-to-r from-emerald-500 to-amber-400" />

              <div className="space-y-0">
                <StatItem label="Established" value="2060 B.S." delay={0} />
                <StatItem label="Reg. No." value="SUA-009/2060" delay={50} />
                <StatItem label="Location" value="Sunsari, Province 1" delay={100} />
                <StatItem label="Members" value="2,500+ Active" delay={150} />
                <StatItem label="Share Capital" value="NPR 5 Crore+" delay={200} />
                <StatItem label="Total Savings" value="NPR 15 Crore+" delay={250} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          SECTION 2: MISSION, VISION & CORE VALUES
          ═════════════════════════════════════════════════════════════════════════ */}
      <section ref={mvRef} className="px-4 py-20 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <FaAward className="text-amber-500" />
              Our Principles
            </div>
            <h2 className="mb-3 font-display text-3xl sm:text-4xl font-bold text-emerald-950">
              Mission, Vision & Core Values
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600 text-lg">
              Guided by timeless cooperative principles and unwavering commitment to our community
            </p>
          </div>

          {/* MISSION, VISION, VALUES CARDS */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <MVCard
              icon="🌱"
              title="Our Mission"
              color="bg-green-50"
              borderColor="border-green-200"
              content="To empower members economically and socially through cooperative financial services, technical assistance, and collective market access — with a focus on agricultural and dairy sectors."
              delay={0}
            />
            <MVCard
              icon="🎯"
              title="Our Vision"
              color="bg-blue-50"
              borderColor="border-blue-200"
              content="To be the leading cooperative institution in Sunsari District, creating a self-reliant and prosperous community through transparent, democratic, and innovative cooperative practices."
              delay={100}
            />
            <MVCard
              icon="⭐"
              title="Core Values"
              color="bg-amber-50"
              borderColor="border-amber-200"
              content="Democratic control · Voluntary membership · Member participation · Autonomy · Education & training · Cooperation among cooperatives · Community concern."
              delay={200}
            />
          </div>

          {/* OBJECTIVES SECTION */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-10 sm:p-12 text-white shadow-2xl border border-emerald-700/50">
            <h3 className="mb-2 font-display text-2xl sm:text-3xl font-bold text-center">Our Strategic Objectives</h3>
            <p className="mb-10 text-center text-emerald-100/80 text-sm">Driving sustainable growth and community empowerment</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                "Mobilize savings and provide productive credit at affordable rates",
                "Develop and promote dairy industry and agro-based enterprises",
                "Create employment opportunities for rural youth and farmers",
                "Provide financial literacy and cooperative education",
                "Support women empowerment through targeted programs",
                "Contribute to community infrastructure and rural development",
                "Maintain transparency and accountability in all operations",
                "Foster cooperation among cooperative institutions",
              ].map((obj, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <FaCheckCircle className="mt-0.5 flex-shrink-0 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-emerald-50 leading-6 group-hover:text-white transition-colors">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════════
          SECTION 3: LEADERSHIP TEAM (dynamic)
          ═════════════════════════════════════════════════════════════════════════ */}
      <LeadershipSection />

      {/* ═════════════════════════════════════════════════════════════════════════
          SECTION 5: OFFICIAL REGISTRATION - NAGARIK BADA PATRA
          ═════════════════════════════════════════════════════════════════════════ */}
      <section ref={registrationRef} className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <FaFileAlt className="text-amber-500" />
              Legal Standing
            </div>
            <h2 className="mb-3 font-display text-3xl sm:text-4xl font-bold text-emerald-950">
              Official Registration & Certification
            </h2>
          </div>

          {/* REGISTRATION CARD */}
          <div className="rounded-3xl border-2 border-emerald-100 bg-white p-8 sm:p-12 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* DOCUMENT VISUAL */}
              <div className="md:col-span-1 flex justify-center">
                <div className="relative">
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold rotate-12 shadow-lg">
                    Verified
                  </div>
                  <div className="w-32 h-48 bg-gradient-to-b from-slate-100 to-slate-50 rounded-lg border-2 border-slate-300 shadow-lg flex flex-col items-center justify-center p-4">
                    <FaFileAlt className="text-4xl text-emerald-600 mb-2" />
                    <p className="text-xs text-center text-slate-600 font-medium">Official<br/>Registration<br/>Document</p>
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="md:col-span-2">
                <h3 className="mb-2 font-display text-2xl font-bold text-emerald-950">
                  नागरिक बडा पत्र
                </h3>
                <p className="text-base text-slate-600 mb-6">
                  Official Registration Certificate issued by the Department of Cooperatives, Government of Nepal, establishing legal status and regulatory compliance.
                </p>

                {/* METADATA */}
                <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <div>
                    <p className="text-xs font-semibold uppercase text-emerald-700">Registration No.</p>
                    <p className="text-lg font-bold text-emerald-950">SUA-009/2060</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-emerald-700">Established</p>
                    <p className="text-lg font-bold text-emerald-950">2060 B.S. (2003 A.D.)</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-emerald-700">Authority</p>
                    <p className="text-sm font-semibold text-emerald-950">Dept. of Cooperatives</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-emerald-700">Status</p>
                    <p className="text-sm font-bold text-emerald-600">✓ Active</p>
                  </div>
                </div>

                {/* TRUST BADGES */}
                {/* <div className="flex flex-wrap gap-3">
                  {[
                    "✓ Govt. Registered",
                    "✓ Legally Certified",
                    "✓ Actively Operating",
                  ].map((badge, i) => (
                    <span key={i} className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 border border-emerald-200">
                      {badge}
                    </span>
                  ))}
                </div> */}
              </div>
            </div>

            {/* DIVIDER */}
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

            {/* ACTION BUTTON */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                📄 All official documents are maintained with the Department of Cooperatives and are available for verification.
              </p>
              <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                View Official Document
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
