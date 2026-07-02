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
  const hasContact = member.email || member.contact;

  return (
    <div
      ref={ref}
      className="fade-in-up group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm
                 transition-all duration-300 ease-out
                 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-200"
    >
      {/* ── IMAGE / AVATAR AREA ── */}
      <div className="relative h-52 overflow-hidden bg-emerald-50">
        {showFallback ? (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
          >
            <span className="text-4xl font-bold text-white/90 tracking-wide select-none">
              {initials}
            </span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={member.name}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        {/* Gradient overlay — always present, deepens on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Contact icons — slide up on hover */}
        {hasContact && (
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 pb-4
                          translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
          >
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                onClick={(e) => e.stopPropagation()}
                title={member.email}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm
                           border border-white/30 text-white hover:bg-white hover:text-emerald-700
                           transition-all duration-200"
              >
                <FaEnvelope className="text-sm" />
              </a>
            )}
            {member.contact && (
              <a
                href={`tel:${member.contact}`}
                onClick={(e) => e.stopPropagation()}
                title={member.contact}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm
                           border border-white/30 text-white hover:bg-white hover:text-emerald-700
                           transition-all duration-200"
              >
                <FaPhone className="text-sm" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* ── CARD BODY ── */}
      <div className="p-5">
        <h4
          className="font-display text-base font-semibold leading-snug text-emerald-950
                       group-hover:text-emerald-700 transition-colors duration-200"
        >
          {member.name}
        </h4>

        {member.position && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
            {member.position}
          </p>
        )}

        {member.tenure && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <FaClock className="flex-shrink-0 text-amber-400" />
            {member.tenure}
          </p>
        )}

        {/* Animated accent bar */}
        <div
          className="mt-4 h-0.5 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-amber-400
                        scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
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
    fetchTeamMembers("executive")
      .then((data) => {
        setMembers(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    let cancelled = false;
    fetchTeamMembers("executive")
      .then((data) => {
        if (cancelled) return;
        setMembers(data);
        setStatus("success");
      })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
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

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="mx-auto max-w-7xl">
        {/* ── HEADER ── */}
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

        {/* ── GRID ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading && [...Array(4)].map((_, i) => <SkeletonCard key={i} />)}

          {status === "error" && <ErrorState onRetry={handleRetry} />}

          {status === "success" && members.length === 0 && <EmptyState />}

          {status === "success" &&
            members.map((member, i) => (
              <MemberCard key={member.id} member={member} animDelay={i * 80} />
            ))}
        </div>
      </div>
    </section>
  );
}
