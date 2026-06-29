import { useState, useEffect } from 'react';

const PageBanner = ({ title, subtitle, breadcrumb }) => (
  <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-12 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-primary-300 text-sm mb-2">{breadcrumb}</div>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
      {subtitle && <p className="text-primary-200">{subtitle}</p>}
    </div>
  </div>
);

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
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'description';
      setActiveSection(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    window.location.hash = sectionId;
  };

  return (
    <div>
      <PageBanner
        title="Dairy Industry"
        subtitle="From Local Farms to Quality Products"
        breadcrumb="Home › Dairy Industry"
        eyebrow="Agricultural excellence"
      />

      {/* Section Navigation */}
      <div className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {[
            { id: 'description', label: 'Description' },
            { id: 'products', label: 'Product Catalog' },
          ].map(section => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`-mb-px border-b-2 px-4 py-3.5 text-sm font-semibold transition ${
                activeSection === section.id
                  ? 'border-emerald-700 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-emerald-700'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <section id="description" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              🐄 <span>Dairy Sector</span>
            </div>
            <h2 className="mb-4 font-display text-3xl font-semibold text-emerald-950 sm:text-4xl">
              Supporting Dairy Farming in Jalthal
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Dairy Industry program of SFACL is one of our flagship initiatives, designed to support local dairy farmers with fair pricing, quality input supplies, veterinary services, and a reliable market for their produce.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our modern milk collection and processing center in Jalthal processes thousands of liters of milk daily, converting fresh milk into value-added dairy products including ghee, paneer, chhurpi, and packaged milk — creating higher income for our member farmers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We work in partnership with local government bodies, the National Dairy Development Board (NDDB), and international organizations to bring modern dairy technology and best practices to rural Jalthal.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Daily Collection', value: '5,000+ liters' },
                { label: 'Farmer Members', value: '800+ families' },
                { label: 'Processing Capacity', value: '10,000 L/day' },
                { label: 'Coverage Area', value: '15 VDCs' },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 text-center">
                  <div className="text-xl font-display font-semibold text-emerald-800">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-emerald-800 to-emerald-700 p-8 text-white shadow-soft">
            <h3 className="mb-6 font-display text-xl font-semibold">Our Dairy Services</h3>
            <div className="space-y-4">
              {[
                { icon: '🐄', title: 'Livestock Support', desc: 'Veterinary services, AI (artificial insemination), and livestock insurance for member farmers.' },
                { icon: '🏭', title: 'Processing Center', desc: 'State-of-the-art milk collection, chilling, and processing facilities in Jalthal.' },
                { icon: '📦', title: 'Market Linkage', desc: 'Direct market access through cooperative channels, eliminating middlemen and increasing farmer income.' },
                { icon: '📚', title: 'Training & Extension', desc: 'Regular training on modern dairy farming, hygiene practices, and animal nutrition.' },
                { icon: '💰', title: 'Input Supply', desc: 'Quality cattle feed, medicines, and equipment at subsidized rates for members.' },
              ].map((service, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">{service.icon}</span>
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

      <div className="section-divider" />

      {/* Product Catalog */}
      <section id="products" className="bg-emerald-50/60 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-3xl font-semibold text-emerald-950 sm:text-4xl">Product Catalog</h2>
            <p className="text-sm text-slate-500">Quality dairy products from our cooperative members</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <div key={i} className="card-hover rounded-[1.6rem] border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="mb-3 text-4xl">{product.icon}</div>
                <h3 className="mb-2 font-display text-lg font-semibold text-emerald-950">{product.name}</h3>
                <p className="mb-4 text-sm leading-7 text-slate-600">{product.description}</p>
                <div className="mt-auto flex items-center justify-between border-t border-emerald-100 pt-3">
                  <span className="text-xs text-slate-500">Sold {product.unit}</span>
                  {product.available && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Available</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] bg-emerald-900 p-6 text-center text-white shadow-soft">
            <h3 className="mb-2 font-display text-xl font-semibold">Interested in Our Products?</h3>
            <p className="mb-4 text-sm text-emerald-100">Contact us for bulk orders, wholesale pricing, or to become a supplier member.</p>
            <a href="/contact" className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 font-semibold text-white transition hover:bg-amber-400">
              Contact for Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
