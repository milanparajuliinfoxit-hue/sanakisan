import { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaPhone, FaClock, FaUsers, FaRedo } from "react-icons/fa";
import { fetchTeamMembers, getImageUrl } from "../api/config";

/* ─────────────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────────────── */
function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const GRADIENT_PAIRS = [
  "from-emerald-600 to-teal-700",
  "from-teal-600 to-emerald-700",
  "from-emerald-700 to-green-800",
  "from-green-600 to-teal-600",
  "from-teal-700 to-emerald-600",
  "from-emerald-500 to-teal-600",
];

function gradientFor(name = "") {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENT_PAIRS[code % GRADIENT_PAIRS.length];
}

/* ─────────────────────────────────────────────────────────────────────────
   SKELETON CARD
   ───────────────────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="skeleton-shimmer h-52 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton-shimmer h-4 w-3/4 rounded-full" />
        <div className="skeleton-shimmer h-3 w-1/2 rounded-full" />
        <div className="skeleton-shimmer h-3 w-2/5 rounded-full" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MEMBER CARD
   ───────────────────────────────────────────────────────────────────────── */
function MemberCard({ member, animDelay }) {
  const [imgError, setImgError] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("visible");
          }, animDelay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animDelay]);

  const imageUrl = member.feature_image
    ? getImageUrl(member.feature_image)
    : null;
  const showFallback = !imageUrl || imgError;
  const gradient = gradientFor(member.name);
  const initials = getInitials(member.name);

  return (
    <div
      ref={ref}
      className="fade-in-up group relative overflow-hidden rounded-2xl border border-transparent bg-white shadow-lg
                 transition-all duration-300 ease-out w-full
                 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl"
    >
      {/* ── AVATAR AREA ── */}
      <div className="relative flex items-center justify-center bg-gradient-to-b from-emerald-50/50 to-transparent pt-8 pb-4">
        {showFallback ? (
          <div
            className={`flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-4xl font-bold text-white shadow-md ring-4 ring-white`}
          >
            {initials}
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={member.name}
            className="h-40 w-40 rounded-full object-cover shadow-md ring-4 ring-white"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* ── CARD BODY ── */}
      <div className="px-6 pb-8 pt-4 text-center">
        <h4
          className="font-display text-xl font-semibold leading-tight text-emerald-900
                     group-hover:text-emerald-700 transition-colors duration-200"
        >
          {member.name}
        </h4>

        {(member.committee_position_name || member.position) && (
          <p className="mt-1 text-base font-medium text-emerald-600">
            {member.committee_position_name || member.position}
          </p>
        )}

        {/* Contact Number */}
        {member.contact && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-slate-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0 h-4 w-4 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {member.contact}
          </p>
        )}

        {/* Animated accent bar – centered */}
        <div
          className="mt-5 mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-amber-400
                        scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300"
        />
      </div>
    </div>
  );
}
/* ─────────────────────────────────────────────────────────────────────────
   EMPTY STATE
   ───────────────────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center rounded-3xl
                    border border-emerald-100 bg-emerald-50/60 py-20 text-center"
    >
      <FaUsers className="mb-4 text-5xl text-emerald-200" />
      <p className="text-base font-medium text-slate-500">
        No leadership members added yet.
      </p>
      <p className="mt-1 text-sm text-slate-400">Check back soon.</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ERROR STATE
   ───────────────────────────────────────────────────────────────────────── */
function ErrorState({ onRetry }) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center rounded-3xl
                    border border-red-100 bg-red-50/60 py-20 text-center"
    >
      <p className="text-base font-medium text-red-500">
        Failed to load leadership members.
      </p>
      <p className="mt-1 mb-5 text-sm text-slate-400">
        Please check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5
                   text-sm font-semibold text-white transition-all duration-200
                   hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <FaRedo className="text-xs" /> Retry
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN EXPORT
   ───────────────────────────────────────────────────────────────────────── */
export default function LeadershipSection() {
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const sectionRef = useRef(null);

  const handleRetry = () => {
    setStatus("loading");
    fetchTeamMembers()
      .then((data) => {
        setMembers(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    let cancelled = false;
    fetchTeamMembers()
      .then((data) => {
        if (cancelled) return;
        setMembers(data);
        setStatus("success");
        console.log(data);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Animate section header on scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("animate-fade-up");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isLoading = status === "loading";

  {
    /*For displaying card  */
  }

  const groupedMembers = members.reduce((groups, member) => {
    const type = member.committee_type_name || "Others";

    if (!groups[type]) {
      groups[type] = [];
    }

    groups[type].push(member);

    return groups;
  }, {});

  const orderedGroups = Object.entries(groupedMembers).sort(([a], [b]) => {
    if (a === "Executive Committee") return -1;
    if (b === "Executive Committee") return 1;
    return a.localeCompare(b);
  });

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="mx-auto max-w-7xl">
        <div ref={sectionRef} className="mb-14 text-center opacity-0">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200
                        bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
          >
            <FaUsers className="text-amber-500" />
            Core Team
          </div>

          <h2 className="mb-3 font-display text-3xl font-bold text-emerald-950 sm:text-4xl">
            Our Leadership
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Dedicated individuals steering our cooperative toward greater
            heights
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {status === "error" && <ErrorState onRetry={handleRetry} />}

        {status === "success" && members.length === 0 && <EmptyState />}

        {status === "success" && members.length > 0 && (
          <>
            {orderedGroups.map(([typeName, committeeMembers]) => {
              const chairperson = committeeMembers.find(
                (m) => m.committee_position_name === "Chairperson",
              );

              const others = committeeMembers.filter(
                (m) => m.committee_position_name !== "Chairperson",
              );

              return (
                <div key={typeName} className="mt-20">
                  <h3 className="mb-8 text-center text-3xl font-bold text-emerald-900">
                    {typeName}
                  </h3>

                  {chairperson && (
                    <div className="mb-10 flex justify-center">
                      <div className="w-full max-w-sm">
                        <MemberCard member={chairperson} animDelay={0} />
                      </div>
                    </div>
                  )}

                  {others.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {others.map((member, index) => (
                        <MemberCard
                          key={member.id}
                          member={member}
                          animDelay={(index + 1) * 80}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </section>
  );
}
