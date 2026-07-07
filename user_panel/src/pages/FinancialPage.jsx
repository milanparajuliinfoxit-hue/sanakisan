import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaCheckCircle } from "react-icons/fa";
import PageBreadcrumb from "../components/PageBreadcrumb";
import ScrollReveal from "../components/ScrollReveal";

const deposits = [
  {
    type: "Group Savings (समूह बचत)",
    rate: "7% p.a.",
    description:
      "Mandatory group savings for members organized under farmer groups. Minimum monthly deposit builds collective capital over the membership term.",
    features: [
      "Minimum: NPR 200/member/month",
      "Must be deposited within 12 years",
      "Fee due at time of enrollment",
      "Account opening fee: NPR 150",
    ],
  },
  {
    type: "Voluntary/Current Savings (ऐच्छिक बचत / चल्ती)",
    rate: "6% p.a.",
    description:
      "Flexible savings account with deposits from NPR 200 up to NPR 5,00,000. Deposit and withdraw according to your own convenience.",
    features: ["Range: NPR 200 – NPR 5,00,000", "Deposit/withdraw at will"],
  },
  {
    type: "Loan Security Savings (कर्जा सुरक्षण बचत)",
    rate: "8% p.a.",
    description:
      "A periodic savings held as security against a loan, equal to 5% of the loan amount taken. Retained for as long as the account is active.",
    features: [
      "Amount: 5% of loan taken",
      "Held until account closes",
      "Linked to active loans only",
    ],
  },
  {
    type: "Child Savings (बाल बचत)",
    rate: "10% p.a.",
    description:
      "A periodic savings scheme for children, growing steadily until maturity 10 years after opening. Encourages long-term saving habits early.",
    features: [
      "NPR 100/month or NPR 1,200/year",
      "Matures 10 years after opening",
      "Entry fee: NPR 150",
    ],
  },
  {
    type: "Social Security Savings (सामाजिक सुरक्षा बचत)",
    rate: "8% p.a.",
    description:
      "A minimum-balance savings account intended to build a long-term social security cushion for members over at least five years.",
    features: [
      "Minimum balance: NPR 1,000",
      "Minimum term: 5 years",
      "Entry fee: NPR 150",
    ],
  },
  {
    type: "Inter-Group Savings (अन्तर समूह बचत)",
    rate: "8% p.a.",
    description:
      "Savings pooled between groups as needed, kept for as long as the inter-group arrangement remains active.",
    features: ["Deposit amount as required", "Held while inter-group active"],
  },
  {
    type: "Personal/Voluntary Savings (व्यक्तिगत बचत / ऐच्छिक)",
    rate: "6% p.a.",
    description:
      "An individual voluntary savings account members can open and manage according to their own wishes.",
    features: [
      "NPR 500 at account opening",
      "Deposit/withdraw at will",
      "Account opening fee: NPR 150",
    ],
  },
  {
    type: "Main Committee Savings (मूल समिति बचत)",
    rate: "7% p.a.",
    description:
      "A periodic savings account tied to committee meeting allowances, accumulated according to attendance-based allowances.",
    features: [
      "Amount as per meeting allowance",
      "Term as per meeting allowance",
    ],
  },
  {
    type: "Staff Provident Fund Savings (कर्मचारी संचय कोष बचत)",
    rate: "8% p.a.",
    description:
      "A provident-fund-style savings scheme for cooperative staff, contributed as a fixed percentage of monthly salary.",
    features: [
      "10% of salary contributed",
      "Term matches salary deduction period",
    ],
  },
  {
    type: "Federation/Organization Savings (संघसंस्था बचत)",
    rate: "7% p.a.",
    description:
      "A savings account for groups and various affiliated committees or organizations under the cooperative's network.",
    features: [
      "NPR 1000 at account opening",
      "Held by groups/committees",
      "Account opening fee: NPR 150",
    ],
  },
  {
    type: "Member Insurance Savings (सदस्य बिमा बचत)",
    rate: "10% p.a.",
    description:
      "A savings-linked insurance account available to members under 60 years of age, combining savings growth with insurance coverage.",
    features: [
      "NPR 8,500 at account opening",
      "Only for members under 60 years",
    ],
  },
];

const loans = [
  {
    type: "Meat, Dairy & Vegetable Farming Loan (मासुजन्य, दुधजन्य तथा तरकारी खेती)",
    rate: "7% p.a.",
    description:
      "Loan for meat, dairy, and vegetable farming enterprises with a 40-month term. Repayment is secured against contributed capital.",
    features: [
      "Term: 40 months",
      "Monthly interest, bi-monthly installment every 6 months",
      "Repayment from secured capital",
    ],
  },
  {
    type: "Micro Promotion Loan (लघु प्रवर्धन कर्जा)",
    rate: "13% p.a.",
    description:
      "Loan from internal or bank sources to help promote small-scale member enterprises, repayable over up to 7 years.",
    features: [
      "Term: up to 7 years",
      "Monthly interest, bi-monthly installment",
      "Internal or bank-sourced",
    ],
  },
  {
    type: "Self-Reliance / Livestock Loan (स्वावलम्बन कर्जा)",
    rate: "10% p.a.",
    description:
      "Bank-sourced loan supporting livestock rearing and self-reliance activities, with a 40-month repayment term.",
    features: [
      "Term: 40 months",
      "Monthly interest, bi-monthly installment every 6 months",
      "Bank-sourced (पसल व्यवसायी)",
    ],
  },
  {
    type: "Agri-Business Farming Loan (कृषि खेती व्यावसायिक कर्जा)",
    rate: "12% p.a.",
    description:
      "Internal loan for commercial-scale agricultural farming activities, with a short 6–9 month repayment term.",
    features: [
      "Term: 6–9 months",
      "Monthly interest, bi-monthly installment",
      "Internal source",
    ],
  },
  {
    type: "Vegetable Farming Loan (तरकारी खेती कर्जा)",
    rate: "7% p.a.",
    description:
      "Bank-sourced loan for vegetable cultivation, available as a short 1-year term or a longer 3-year term.",
    features: [
      "Short term: 1 year / Long term: 3 years",
      "Monthly interest, bi-monthly installment",
      "Bank-sourced",
    ],
  },
  {
    type: "Fish & Poultry Farming Loan (माछा तथा कुखुरापालन कर्जा)",
    rate: "7% p.a.",
    description:
      "Bank-sourced loan to support fish farming and poultry rearing, with short or long repayment options.",
    features: [
      "Short term: 1 year / Long term: 3 years",
      "Monthly interest, bi-monthly installment",
      "Bank-sourced",
    ],
  },
  {
    type: "Emergency Loan (आकस्मिक कर्जा)",
    rate: "12% p.a.",
    description:
      "Internal loan for urgent, unforeseen needs, to be repaid quickly within 3 to 6 months.",
    features: [
      "Term: 3–6 months",
      "Monthly interest; repay within 3 or 6 months",
      "Internal source",
    ],
  },
  {
    type: "Rural Enterprise Loan (ग्रामीण उद्यम कर्जा)",
    rate: "9% p.a.",
    description:
      "Bank-sourced loan for rural enterprises, available as a renewable 1-year running loan or a fixed 3-year term.",
    features: [
      "Running: 1 year / Fixed: 3 years",
      "Monthly interest, bi-monthly installment",
      "Bank-sourced, renewable",
    ],
  },
  {
    type: "Koshi Interest-Discount Grant Loan (कोशी प्रवेश ब्याज छुट अनुदान कर्जा)",
    rate: "7% p.a.",
    description:
      "A subsidized 5-year loan offering a discounted interest rate as part of the Koshi entry grant program.",
    features: [
      "Term: 5 years",
      "Monthly interest, bi-monthly installment",
      "Subsidized/grant-linked rate",
    ],
  },
  {
    type: "Life Insurance Savings Loan (जीवन बिमा बचत कर्जा)",
    rate: "12% p.a.",
    description:
      "A 1-year loan linked to life insurance savings, repaid together with monthly interest and principal.",
    features: ["Term: 1 year", "Monthly interest and principal repayment"],
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
        {open ? (
          <FaChevronUp className="text-emerald-500 flex-shrink-0" />
        ) : (
          <FaChevronDown className="text-emerald-500 flex-shrink-0" />
        )}
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
  const [activeTab, setActiveTab] = useState("deposit");

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "deposit" || hash === "loan") {
        setActiveTab(hash);
      }
    };
    window.addEventListener("hashchange", syncFromHash);
    syncFromHash();
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  return (
    <div>
      <PageBreadcrumb
        title="Financial Services"
        items={[{ label: "Home", path: "/" }, { label: "Financial Services" }]}
      />

      {/* Overview */}
      <ScrollReveal>
        <section id="overview" className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h2 className="mb-3 font-display text-2xl font-bold text-emerald-950">
                  Financial Services Overview
                </h2>
                <p className="mb-3 text-base leading-8 text-slate-600">
                  SFACL offers a comprehensive range of financial products
                  designed for the specific needs of cooperative members in
                  Jalthal. From daily savings to long-term fixed deposits, and
                  from agricultural loans to home financing — we provide
                  affordable, member-centric financial solutions.
                </p>
                <p className="text-base leading-8 text-slate-600">
                  All services are available exclusively to registered members
                  of the cooperative. Membership is open to all residents of the
                  Jalthal area. Interest rates are reviewed periodically by the
                  Board of Directors in line with Nepal Rastra Bank guidelines.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "NPR 15Cr+", label: "Total Deposits" },
                  { value: "NPR 12Cr+", label: "Loan Portfolio" },
                  { value: "98.5%", label: "Recovery Rate" },
                  { value: "2,500+", label: "Loan Members" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-700 p-4 text-center text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="text-xl font-display font-semibold text-amber-300">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8 flex border-b border-emerald-100">
              {[
                { id: "deposit", label: "💰 Deposit Schemes" },
                { id: "loan", label: "🏦 Loan Products" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`-mb-0.5 border-b-2 px-6 py-3.5 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "border-emerald-700 text-emerald-700"
                      : "border-transparent text-slate-500 hover:text-emerald-700"
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
      {activeTab === "deposit" && (
        <ScrollReveal>
          <section id="deposit" className="bg-white px-4 pb-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {deposits.map((dep, i) => (
                  <div
                    key={i}
                    className="card-hover rounded-[1.6rem] border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm hover:bg-white hover:border-emerald-200"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="flex-1 font-display text-sm font-semibold leading-tight text-emerald-950">
                        {dep.type}
                      </h3>
                      <span className="flex-shrink-0 rounded-full bg-emerald-800 px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">
                        {dep.rate}
                      </span>
                    </div>
                    <p className="mb-4 text-xs leading-7 text-slate-600">
                      {dep.description}
                    </p>
                    <ul className="space-y-2">
                      {dep.features.map((f, fi) => (
                        <li
                          key={fi}
                          className="flex gap-2 text-xs text-slate-600"
                        >
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
      {activeTab === "loan" && (
        <ScrollReveal>
          <section id="loan" className="bg-white px-4 pb-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {loans.map((loan, i) => (
                  <div
                    key={i}
                    className="card-hover rounded-[1.6rem] border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm hover:bg-white hover:border-emerald-200"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="flex-1 font-display text-sm font-semibold leading-tight text-emerald-950">
                        {loan.type}
                      </h3>
                      <span className="flex-shrink-0 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">
                        {loan.rate}
                      </span>
                    </div>
                    <p className="mb-4 text-xs leading-7 text-slate-600">
                      {loan.description}
                    </p>
                    <ul className="space-y-2">
                      {loan.features.map((f, fi) => (
                        <li
                          key={fi}
                          className="flex gap-2 text-xs text-slate-600"
                        >
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
        <section
          id="documents"
          className="bg-emerald-50/70 px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-2 font-display text-3xl font-bold text-emerald-950">
                Required Documents
              </h2>
              <p className="text-sm text-slate-500">
                Documents needed for membership, account opening, and loan
                processing
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="mb-5 flex items-center gap-2 border-b border-emerald-100 pb-3 font-display text-lg font-semibold text-emerald-950">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-800 text-sm text-white">
                    📋
                  </span>
                  New Membership & Account Opening
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Citizenship certificate (नागरिकता प्रमाण पत्र) — photocopy",
                    "2 recent passport-sized photographs",
                    "Residential proof (electricity bill / land ownership certificate)",
                    "PAN number (if available)",
                    "Initial share purchase amount (minimum NPR 500)",
                    "Membership application form (available at office)",
                    "Nominee details and their citizenship copy",
                    "Mobile number registered with your name",
                  ].map((doc, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <span className="mt-0.5 flex-shrink-0 font-bold text-emerald-500">
                        •
                      </span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.6rem] border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="mb-5 flex items-center gap-2 border-b border-emerald-100 pb-3 font-display text-lg font-semibold text-emerald-950">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-amber-500 text-sm text-white">
                    📄
                  </span>
                  Loan Application Processing
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Basic Documents (All Loans)
                    </div>
                    <ul className="space-y-1.5">
                      {[
                        "Membership certificate and share passbook",
                        "Citizenship certificate — applicant + guarantor",
                        "Loan application form (available at office)",
                        "Savings account statement (minimum 3 months)",
                        "2 recent passport-sized photos",
                      ].map((doc, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-xs text-slate-600"
                        >
                          <span className="mt-0.5 flex-shrink-0 font-bold text-amber-500">
                            •
                          </span>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      For Property Collateral Loans
                    </div>
                    <ul className="space-y-1.5">
                      {[
                        "Land ownership certificate (लालपुर्जा)",
                        "Land revenue receipt (मालपोत तिरेको रसिद)",
                        "Land sketch map (नापी नक्शा)",
                        "Market valuation report if required",
                      ].map((doc, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-xs text-slate-600"
                        >
                          <span className="mt-0.5 flex-shrink-0 font-bold text-amber-500">
                            •
                          </span>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Business Loan Additional
                    </div>
                    <ul className="space-y-1.5">
                      {[
                        "Business registration certificate",
                        "Project proposal / business plan",
                        "Tax clearance certificate (if applicable)",
                      ].map((doc, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-xs text-slate-600"
                        >
                          <span className="mt-0.5 flex-shrink-0 font-bold text-amber-500">
                            •
                          </span>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
              <p className="text-sm text-emerald-800">
                <strong>Note:</strong> Document requirements may vary based on
                loan type and amount. Please visit our office or call us for
                specific requirements for your loan application. All documents
                should be submitted in original along with photocopies.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
