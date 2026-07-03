import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaCheckCircle } from 'react-icons/fa';
import PageBreadcrumb from '../components/PageBreadcrumb';
import ScrollReveal from '../components/ScrollReveal';

const deposits = [
  {
    type: 'Saving Deposit (बचत निक्षेप)',
    rate: '7% p.a.',
    description: 'A basic savings account for all members. Flexible deposits and withdrawals. Earn competitive interest while keeping your money safe and accessible.',
    features: ['Minimum balance: NPR 500', 'Free 2 withdrawals/month', 'Passbook provided', 'Suitable for regular savings'],
  },
  {
    type: 'Fixed Deposit (मुद्दती निक्षेप)',
    rate: 'Up to 12% p.a.',
    description: 'Lock in your savings for a fixed term and earn higher interest rates. Ideal for members who want to grow their savings without frequent transactions.',
    features: ['Minimum: NPR 10,000', 'Terms: 3 months to 3 years', 'Higher interest than savings', 'Loan against FD available'],
  },
  {
    type: 'Recurring Deposit (आवर्ती निक्षेप)',
    rate: '9% p.a.',
    description: 'Discipline your saving with monthly fixed deposits. A great way to build wealth systematically over time with attractive interest rates.',
    features: ['Monthly deposits: NPR 500+', 'Terms: 1–5 years', 'Auto-debit option', 'Loan facility available'],
  },
  {
    type: 'Daily Deposit (दैनिक बचत)',
    rate: '6% p.a.',
    description: 'Small daily deposits collected at your doorstep by our field staff. Perfect for small vendors, farmers, and daily wage earners.',
    features: ['Daily minimum: NPR 20', 'Door collection service', 'No lock-in period', 'Encourages daily savings habit'],
  },
  {
    type: 'Children Savings (बाल बचत)',
    rate: '8% p.a.',
    description: 'A special savings account for children under 18, operated by parents/guardians. Nurtures saving habits from an early age.',
    features: ['Open from birth to 18 years', 'Higher interest rate', 'Maturity benefits', 'Free on savings up to NPR 50,000'],
  },
];

const loans = [
  {
    type: 'Agricultural Loan (कृषि ऋण)',
    rate: '10–12% p.a.',
    description: 'Affordable credit for crop cultivation, irrigation, farm equipment, and agro-based enterprises. Supports food security and agricultural productivity.',
    features: ['Up to NPR 5 Lakh', 'Flexible repayment', 'Seasonal repayment option', 'Subsidy linkage available'],
  },
  {
    type: 'Dairy Loan (पशुपालन ऋण)',
    rate: '10% p.a.',
    description: 'Special loan for purchase of dairy animals, fodder, shed construction, veterinary care, and dairy equipment. Exclusive for dairy farmer members.',
    features: ['Up to NPR 10 Lakh', 'Cattle as collateral', 'Insurance linked', 'Technical support included'],
  },
  {
    type: 'Home Loan (घर ऋण)',
    rate: '11–13% p.a.',
    description: 'Finance your dream home or renovation. Affordable long-term loans for house construction, purchase, or repair for member families.',
    features: ['Up to NPR 50 Lakh', 'Up to 15 years tenure', 'Property as collateral', 'Construction installment option'],
  },
  {
    type: 'Business Loan (व्यापार ऋण)',
    rate: '12–14% p.a.',
    description: 'Capital for establishing or expanding small and medium enterprises, shops, trading businesses, and cottage industries.',
    features: ['Up to NPR 25 Lakh', 'Project-based repayment', 'Business plan required', 'Mentoring support available'],
  },
  {
    type: 'Education Loan (शिक्षा ऋण)',
    rate: '9% p.a.',
    description: 'Invest in your family\'s future with affordable education loans for higher studies in Nepal or abroad. Moratorium period during studies.',
    features: ['Up to NPR 15 Lakh', 'Grace period during study', 'Simple documentation', 'Co-applicant (parent) required'],
  },
  {
    type: 'Emergency Loan (आकस्मिक ऋण)',
    rate: '13% p.a.',
    description: 'Quick-disbursement loans for medical emergencies, natural disasters, or unexpected urgent needs. Processed within 24–48 hours.',
    features: ['Up to NPR 2 Lakh', 'Fast disbursement', 'Minimal documentation', 'For active members only'],
  },
];

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3 overflow-hidden rounded-[1.2rem] border border-emerald-100 transition-all duration-200 hover:border-emerald-200">
      <button
        className="flex w-full items-center justify-between bg-white px-5 py-4 text-left transition hover:bg-emerald-50"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-emerald-900 text-sm">{title}</span>
        {open ? <FaChevronUp className="text-emerald-500 flex-shrink-0" /> : <FaChevronDown className="text-emerald-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="border-t border-emerald-100 bg-emerald-50/70 px-5 pb-5 pt-4 text-sm leading-8 text-slate-600">
          {children}
        </div>
      )}
    </div>
  );
};

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState('deposit');

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'deposit' || hash === 'loan') {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', syncFromHash);
    syncFromHash();
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  return (
    <div>
      <PageBreadcrumb
        title="Financial Services"
        items={[
          { label: "Home", path: "/" },
          { label: "Financial Services" },
        ]}
      />

      {/* Overview */}
      <ScrollReveal>
        <section id="overview" className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h2 className="mb-3 font-display text-2xl font-bold text-emerald-950">Financial Services Overview</h2>
                <p className="mb-3 text-base leading-8 text-slate-600">
                  SFACL offers a comprehensive range of financial products designed for the specific needs of cooperative members in Jalthal. From daily savings to long-term fixed deposits, and from agricultural loans to home financing — we provide affordable, member-centric financial solutions.
                </p>
                <p className="text-base leading-8 text-slate-600">
                  All services are available exclusively to registered members of the cooperative. Membership is open to all residents of the Jalthal area. Interest rates are reviewed periodically by the Board of Directors in line with Nepal Rastra Bank guidelines.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'NPR 15Cr+', label: 'Total Deposits' },
                  { value: 'NPR 12Cr+', label: 'Loan Portfolio' },
                  { value: '98.5%', label: 'Recovery Rate' },
                  { value: '2,500+', label: 'Loan Members' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-700 p-4 text-center text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="text-xl font-display font-semibold text-amber-300">{stat.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8 flex border-b border-emerald-100">
              {[
                { id: 'deposit', label: '💰 Deposit Schemes' },
                { id: 'loan', label: '🏦 Loan Products' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`-mb-0.5 border-b-2 px-6 py-3.5 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? 'border-emerald-700 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-emerald-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Deposit Services */}
      {activeTab === 'deposit' && (
        <ScrollReveal>
          <section id="deposit" className="bg-white px-4 pb-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {deposits.map((dep, i) => (
                  <div key={i} className="card-hover rounded-[1.6rem] border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm hover:bg-white hover:border-emerald-200">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="flex-1 font-display text-sm font-semibold leading-tight text-emerald-950">{dep.type}</h3>
                      <span className="flex-shrink-0 rounded-full bg-emerald-800 px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">{dep.rate}</span>
                    </div>
                    <p className="mb-4 text-xs leading-7 text-slate-600">{dep.description}</p>
                    <ul className="space-y-2">
                      {dep.features.map((f, fi) => (
                        <li key={fi} className="flex gap-2 text-xs text-slate-600">
                          <FaCheckCircle className="mt-0.5 flex-shrink-0 text-emerald-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Loan Services */}
      {activeTab === 'loan' && (
        <ScrollReveal>
          <section id="loan" className="bg-white px-4 pb-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {loans.map((loan, i) => (
                  <div key={i} className="card-hover rounded-[1.6rem] border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm hover:bg-white hover:border-emerald-200">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="flex-1 font-display text-sm font-semibold leading-tight text-emerald-950">{loan.type}</h3>
                      <span className="flex-shrink-0 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">{loan.rate}</span>
                    </div>
                    <p className="mb-4 text-xs leading-7 text-slate-600">{loan.description}</p>
                    <ul className="space-y-2">
                      {loan.features.map((f, fi) => (
                        <li key={fi} className="flex gap-2 text-xs text-slate-600">
                          <FaCheckCircle className="mt-0.5 flex-shrink-0 text-amber-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      <div className="section-divider" />

      {/* Required Documents */}
      <ScrollReveal>
        <section id="documents" className="bg-emerald-50/70 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-2 font-display text-3xl font-bold text-emerald-950">Required Documents</h2>
              <p className="text-sm text-slate-500">Documents needed for membership, account opening, and loan processing</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="mb-5 flex items-center gap-2 border-b border-emerald-100 pb-3 font-display text-lg font-semibold text-emerald-950">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-800 text-sm text-white">📋</span>
                  New Membership & Account Opening
                </h3>
                <ul className="space-y-2.5">
                  {[
                    'Citizenship certificate (नागरिकता प्रमाण पत्र) — photocopy',
                    '2 recent passport-sized photographs',
                    'Residential proof (electricity bill / land ownership certificate)',
                    'PAN number (if available)',
                    'Initial share purchase amount (minimum NPR 500)',
                    'Membership application form (available at office)',
                    'Nominee details and their citizenship copy',
                    'Mobile number registered with your name',
                  ].map((doc, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <span className="mt-0.5 flex-shrink-0 font-bold text-emerald-500">•</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.6rem] border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="mb-5 flex items-center gap-2 border-b border-emerald-100 pb-3 font-display text-lg font-semibold text-emerald-950">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-amber-500 text-sm text-white">📄</span>
                  Loan Application Processing
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Basic Documents (All Loans)</div>
                    <ul className="space-y-1.5">
                      {[
                        'Membership certificate and share passbook',
                        'Citizenship certificate — applicant + guarantor',
                        'Loan application form (available at office)',
                        'Savings account statement (minimum 3 months)',
                        '2 recent passport-sized photos',
                      ].map((doc, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-600">
                          <span className="mt-0.5 flex-shrink-0 font-bold text-amber-500">•</span>{doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">For Property Collateral Loans</div>
                    <ul className="space-y-1.5">
                      {[
                        'Land ownership certificate (लालपुर्जा)',
                        'Land revenue receipt (मालपोत तिरेको रसिद)',
                        'Land sketch map (नापी नक्शा)',
                        'Market valuation report if required',
                      ].map((doc, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-600">
                          <span className="mt-0.5 flex-shrink-0 font-bold text-amber-500">•</span>{doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Business Loan Additional</div>
                    <ul className="space-y-1.5">
                      {[
                        'Business registration certificate',
                        'Project proposal / business plan',
                        'Tax clearance certificate (if applicable)',
                      ].map((doc, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-600">
                          <span className="mt-0.5 flex-shrink-0 font-bold text-amber-500">•</span>{doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
              <p className="text-sm text-emerald-800">
                <strong>Note:</strong> Document requirements may vary based on loan type and amount. Please visit our office or call us for specific requirements for your loan application. All documents should be submitted in original along with photocopies.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
