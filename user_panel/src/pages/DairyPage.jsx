import { useState, useEffect } from 'react';
import PageBreadcrumb from '../components/PageBreadcrumb';
import ScrollReveal from '../components/ScrollReveal';

const products = [
  {
    icon: '🥛',
    name: 'Fresh Milk',
    description: 'Pure, fresh cow and buffalo milk collected daily from member farmers and processed under strict hygiene standards.',
    unit: 'per liter',
    available: true,
  },
  {
    icon: '🧈',
    name: 'Ghee (Clarified Butter)',
    description: 'Traditional Nepali ghee made from pure buffalo milk using time-honored methods. Rich flavor and high quality.',
    unit: 'per kg',
    available: true,
  },
  {
    icon: '🍦',
    name: 'Paneer (Cottage Cheese)',
    description: 'Fresh, soft paneer produced from whole milk. Perfect for cooking and direct consumption.',
    unit: 'per kg',
    available: true,
  },
  {
    icon: '🥣',
    name: 'Chhurpi (Hard Cheese)',
    description: 'Traditional Nepali hard cheese made from yak and cow milk, a popular local delicacy and export product.',
    unit: 'per pack',
    available: true,
  },
  {
    icon: '🍼',
    name: 'Pasteurized Milk Packets',
    description: 'Hygienically packaged, pasteurized milk in sealed pouches for extended shelf life and food safety.',
    unit: 'per packet',
    available: true,
  },
  {
    icon: '🧀',
    name: 'Butter',
    description: 'Creamy, natural butter produced from fresh cream. Available in salted and unsalted varieties.',
    unit: 'per pack',
    available: true,
  },
];

export default function DairyPage() {
  const [activeSection, setActiveSection] = useState('description');

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'description' || hash === 'products') {
        setActiveSection(hash);
      }
    };
    window.addEventListener('hashchange', syncFromHash);
    syncFromHash();
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    window.location.hash = activeSection;
  }, [activeSection]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div>
      <PageBreadcrumb
        title="Dairy Industry"
        items={[
          { label: "Home", path: "/" },
          { label: "Dairy Industry" },
        ]}
      />

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {[
            { id: 'description', label: 'Description' },
            { id: 'products', label: 'Product Catalog' },
          ].map(section => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`-mb-px border-b-2 px-5 py-4 text-sm font-semibold transition ${
                activeSection === section.id
                  ? 'border-emerald-700 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-emerald-700'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <ScrollReveal>
        <section id="description" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
                🐄 <span>Dairy Sector</span>
              </div>
              <h2 className="mb-5 font-display text-3xl font-bold text-emerald-950 sm:text-4xl">
                Supporting Dairy Farming in Jalthal
              </h2>
              <p className="text-slate-600 leading-8 mb-4">
                The Dairy Industry program of SFACL is one of our flagship initiatives, designed to support local dairy farmers with fair pricing, quality input supplies, veterinary services, and a reliable market for their produce.
              </p>
              <p className="text-slate-600 leading-8 mb-4">
                Our modern milk collection and processing center in Jalthal processes thousands of liters of milk daily, converting fresh milk into value-added dairy products including ghee, paneer, chhurpi, and packaged milk — creating higher income for our member farmers.
              </p>
              <p className="text-slate-600 leading-8 mb-6">
                We work in partnership with local government bodies, the National Dairy Development Board (NDDB), and international organizations to bring modern dairy technology and best practices to rural Jalthal.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { label: 'Daily Collection', value: '5,000+ liters' },
                  { label: 'Farmer Members', value: '800+ families' },
                  { label: 'Processing Capacity', value: '10,000 L/day' },
                  { label: 'Coverage Area', value: '15 VDCs' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="text-xl font-display font-semibold text-emerald-800">{stat.value}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] bg-gradient-to-br from-emerald-800 to-emerald-700 p-8 text-white shadow-soft">
              <h3 className="mb-6 font-display text-xl font-semibold">Our Dairy Services</h3>
              <div className="space-y-5">
                {[
                  { icon: '🐄', title: 'Livestock Support', desc: 'Veterinary services, AI (artificial insemination), and livestock insurance for member farmers.' },
                  { icon: '🏭', title: 'Processing Center', desc: 'State-of-the-art milk collection, chilling, and processing facilities in Jalthal.' },
                  { icon: '📦', title: 'Market Linkage', desc: 'Direct market access through cooperative channels, eliminating middlemen and increasing farmer income.' },
                  { icon: '📚', title: 'Training & Extension', desc: 'Regular training on modern dairy farming, hygiene practices, and animal nutrition.' },
                  { icon: '💰', title: 'Input Supply', desc: 'Quality cattle feed, medicines, and equipment at subsidized rates for members.' },
                ].map((service, i) => (
                  <div key={i} className="flex gap-3 group">
                    <span className="text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110">{service.icon}</span>
                    <div>
                      <div className="text-sm font-semibold">{service.title}</div>
                      <div className="mt-0.5 text-xs leading-6 text-emerald-100/90">{service.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <div className="section-divider" />

      {/* Product Catalog */}
      <ScrollReveal>
        <section id="products" className="bg-emerald-50/60 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-2 font-display text-3xl font-bold text-emerald-950 sm:text-4xl">Product Catalog</h2>
              <p className="text-sm text-slate-500">Quality dairy products from our cooperative members</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => (
                <div key={i} className="card-hover rounded-[1.6rem] border border-emerald-100 bg-white p-6 shadow-sm hover:border-emerald-200">
                  <div className="mb-3 text-4xl transition-transform duration-300 group-hover:scale-110">{product.icon}</div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-emerald-950">{product.name}</h3>
                  <p className="mb-4 text-sm leading-7 text-slate-600">{product.description}</p>
                  <div className="flex items-center justify-between border-t border-emerald-100 pt-3">
                    <span className="text-xs text-slate-500">Sold {product.unit}</span>
                    {product.available && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-[2rem] bg-gradient-to-br from-emerald-900 to-emerald-800 p-8 text-center text-white shadow-xl">
              <h3 className="mb-2 font-display text-2xl font-semibold">Interested in Our Products?</h3>
              <p className="mb-5 text-sm text-emerald-100/90 max-w-xl mx-auto">Contact us for bulk orders, wholesale pricing, or to become a supplier member.</p>
              <a href="/contact" className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-lg">
                Contact for Pricing
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
