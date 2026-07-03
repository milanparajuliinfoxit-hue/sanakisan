import { useEffect, useRef, useState } from "react";
import {
  FaLeaf,
  FaAward,
  FaCheckCircle,
  FaFileAlt,
} from "react-icons/fa";
import PageBreadcrumb from "../components/PageBreadcrumb";
import LeadershipSection from "../components/LeadershipSection";
import ScrollReveal, { useScrollReveal } from "../components/ScrollReveal";
import { SkeletonImage } from "../components/Skeleton";
import { getBadaPatra } from "../api/badaPatraApi";
import { getImageUrl } from "../api/config";

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

export default function AboutPage() {
  const [badaPatra, setBadaPatra] = useState(null);
  const [badaPatraLoading, setBadaPatraLoading] = useState(true);
  const [badaPatraError, setBadaPatraError] = useState(false);

  useEffect(() => {
    getBadaPatra()
      .then(setBadaPatra)
      .catch(() => setBadaPatraError(true))
      .finally(() => setBadaPatraLoading(false));
  }, []);

  return (
    <div>
      <PageBreadcrumb
        title="About Us"
        items={[
          { label: "Home", path: "/" },
          { label: "About Us" },
        ]}
      />

      {/* SECTION 1: WHO WE ARE */}
      <ScrollReveal>
        <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-5 lg:gap-8">
            <div className="lg:col-span-3">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-sm font-semibold text-emerald-700 backdrop-blur-sm shadow-sm">
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

            {/* Statistics Card */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-emerald-700">Key Statistics</h3>
                <div className="mb-6 h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" />

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
      </ScrollReveal>

      {/* SECTION 2: MISSION, VISION & VALUES */}
      <ScrollReveal>
        <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
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

            {/* Strategic Objectives */}
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
      </ScrollReveal>

      {/* Leadership Section (dynamic) */}
      <LeadershipSection />

      {/* Bada Patra Section */}
      <ScrollReveal>
        <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/40 to-white">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                <FaFileAlt className="text-amber-500" />
                सरकारी प्रमाणपत्र
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-emerald-950">
                नागरिक बडा पत्र
              </h2>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-emerald-100 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl overflow-hidden">
              {badaPatraLoading ? (
                <div className="p-8">
                  <SkeletonImage className="rounded-2xl" style={{ aspectRatio: "4/3" }} />
                  <div className="flex justify-center mt-6">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                  </div>
                </div>
              ) : badaPatraError || !badaPatra ? (
                <div className="py-24 text-center px-6">
                  <div className="mx-auto w-24 h-24 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                    <FaFileAlt className="text-4xl text-emerald-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {badaPatraError ? "Unable to load document" : "No Bada Patra Available"}
                  </h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    {badaPatraError
                      ? "Please try again later or contact the administrator."
                      : "The official document has not been uploaded yet. Please check back later."}
                  </p>
                </div>
              ) : (
                <div className="p-6 sm:p-10">
                  <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 shadow-md transition-all duration-300 hover:shadow-xl bg-gray-50">
                    <img
                      src={getImageUrl(badaPatra.image)}
                      alt="नागरिक बडा पत्र"
                      loading="lazy"
                      className="w-full h-auto object-contain block transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{ maxHeight: "80vh" }}
                    />
                    <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/5 transition-colors duration-300 pointer-events-none rounded-2xl" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
