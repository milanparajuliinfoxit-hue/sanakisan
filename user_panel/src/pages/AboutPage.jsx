import {
  FaLeaf,
  FaHandshake,
  FaUsers,
  FaAward,
  FaChartLine,
} from "react-icons/fa";
import PageBanner from "../components/PageBanner";

export default function AboutPage() {
  return (
    <div>
      <PageBanner
        title="About Us"
        subtitle="Our Story, Mission & Vision"
        breadcrumb="Home › About Us"
        eyebrow="Cooperative identity"
      />

      {/* Main About */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              <FaLeaf className="text-amber-500" /> Who We Are
            </div>
            <h2 className="mb-4 font-display text-3xl font-semibold text-emerald-950 sm:text-4xl">
              साना किसान कृषि सहकारी संस्था लिमिटेड
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Sana Kisan Agro Cooperative Ltd. (SFACL) is a registered
              cooperative institution serving the Jalthal community of Sunsari
              District in Province No. 1, Nepal. Established with the core
              principle of "member-owned, member-controlled, member-benefited,"
              SFACL has been a pillar of rural financial and agricultural
              development.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our cooperative brings together farmers, entrepreneurs, and
              community members to create a collective force for economic
              empowerment. Through pooled savings, affordable credit, and
              agricultural support services — especially in the dairy industry —
              we help our members achieve financial security and prosperity.
            </p>
            <p className="text-base leading-8 text-slate-600">
              Registered with the Department of Cooperatives of the Government
              of Nepal, SFACL operates under the Cooperative Act and maintains
              strict adherence to cooperative values including democracy,
              equality, equity, and solidarity.
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-8 shadow-sm">
            <div className="space-y-5">
              {[
                { label: "Established", value: "2060 B.S. (2003 A.D.)" },
                { label: "Registration No.", value: "SUA-009/2060" },
                {
                  label: "Location",
                  value: "Jalthal, Sunsari, Province No. 1",
                },
                { label: "Membership", value: "2,500+ Active Members" },
                { label: "Share Capital", value: "NPR 5 Crore+" },
                { label: "Total Savings", value: "NPR 15 Crore+" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-primary-100 last:border-0"
                >
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm font-semibold text-emerald-950">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Mission Vision Objectives */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-3xl font-semibold text-emerald-950 sm:text-4xl">
              Mission, Vision & Objectives
            </h2>
            <div className="text-sm text-slate-500">
              Our guiding principles and strategic direction
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: "🌱",
                title: "Our Mission",
                color: "bg-green-50 border-green-200",
                iconBg: "bg-green-100",
                content:
                  "To empower members economically and socially through cooperative financial services, technical assistance, and collective market access — with a focus on agricultural and dairy sectors of Jalthal.",
              },
              {
                icon: "🎯",
                title: "Our Vision",
                color: "bg-blue-50 border-blue-200",
                iconBg: "bg-blue-100",
                content:
                  "To be the leading cooperative institution in Sunsari District, creating a self-reliant and prosperous community through transparent, democratic, and innovative cooperative practices.",
              },
              {
                icon: "⭐",
                title: "Core Values",
                color: "bg-yellow-50 border-yellow-200",
                iconBg: "bg-yellow-100",
                content:
                  "Democratic member control · Voluntary and open membership · Member economic participation · Autonomy and independence · Education, training and information · Cooperation among cooperatives · Community concern.",
              },
            ].map((item, i) => (
              <div key={i} className={`rounded-3xl border p-6 shadow-sm ${item.color}`}>
                <div
                  className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}
                >
                  {item.icon}
                </div>
                <h3 className="mb-3 font-display text-lg font-semibold text-emerald-950">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-slate-600">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          {/* Objectives */}
          <div className="rounded-[2rem] bg-emerald-900 p-8 text-white shadow-soft">
            <h3 className="mb-6 text-center font-display text-2xl font-semibold">
              Our Objectives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Mobilize savings of members and provide productive credit at affordable rates",
                "Develop and promote dairy industry and agro-based enterprises in the region",
                "Create employment opportunities for rural youth and farmers",
                "Provide financial literacy and cooperative education to members",
                "Support women empowerment through targeted cooperative programs",
                "Contribute to community infrastructure and rural development",
                "Maintain transparency and accountability in all financial operations",
                "Foster cooperation among cooperative institutions for collective strength",
              ].map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 font-bold text-amber-300">
                    ✓
                  </span>
                  <span className="text-sm text-emerald-100">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Board/Team intro */}
      <section className="bg-emerald-50/80 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-2 font-display text-2xl font-semibold text-emerald-950">
            Our Leadership
          </h2>
          <p className="mb-8 text-sm text-slate-500">
            Dedicated committee members steering our cooperative forward
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { role: "Chairperson", name: "Ram Bahadur Rai" },
              { role: "Vice-Chairperson", name: "Sita Devi Shrestha" },
              { role: "Executive Director", name: "Ramesh Kumar Thapa" },
              { role: "Treasurer", name: "Gita Kumari Tamang" },
            ].map((person, i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-100 bg-white p-5 text-center shadow-sm"
              >
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-800 text-xl font-bold text-white">
                  {person.name[0]}
                </div>
                <div className="text-sm font-semibold text-emerald-950">
                  {person.name}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {person.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
