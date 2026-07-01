import { useEffect, useRef } from "react";

/**
 * ChairpersonMessage Component
 *
 * CMS/Admin Integration Ready:
 * This component is structured to accept data from a backend CMS.
 * Data attributes are marked with comments for easy backend integration.
 *
 * Expected Data Structure:
 * {
 *   chairpersonName: "Ram Bahadur Rai",
 *   position: "Chairperson",
 *   photoUrl: "/path/to/image.jpg",
 *   signatureUrl: "/path/to/signature.jpg",
 *   message: "Full message text...",
 *   badgeLabel: "Leadership Message"
 * }
 */

function ChairpersonMessage({ data = null }) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  // Default/Sample Data Structure for CMS Integration
  const chairpersonData = data || {
    chairpersonName: "Ram Bahadur Rai",
    position: "Chairperson",
    photoUrl: null, // CMS: Image upload field
    signatureUrl: null, // CMS: Signature image upload field
    message: `As the Chairperson of Sana Kisan Agro Cooperative Ltd., I am proud to lead an institution that has remained steadfast in its commitment to our members and the broader Jalthal community for over two decades.

Our cooperative is built on the foundation of trust, transparency, and democratic participation. Every decision we make is guided by the well-being of our members and the sustainable development of our region. We believe that together, through collective effort and shared resources, we can create lasting economic prosperity.

The journey of cooperative development is one of continuous learning and innovation. We are committed to embracing modern financial technologies while maintaining the core values that define us. Our recent expansion into digital banking and microfinance has opened new doors for our members, especially rural farmers and women entrepreneurs.

I invite all community members to join us in this journey towards a more inclusive, prosperous, and empowered cooperative society.`,
    badgeLabel: "Leadership Message",
  };

  const {
    chairpersonName,
    position,
    photoUrl,
    signatureUrl,
    message,
    badgeLabel,
  } = chairpersonData;

  // Scroll Animation Hook
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-section");
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Text reveal animation for content
  useEffect(() => {
    const paragraphs =
      contentRef.current?.querySelectorAll(".message-paragraph");
    if (paragraphs) {
      paragraphs.forEach((p, idx) => {
        p.style.animation = `fadeUpStagger 0.8s ease-out ${300 + idx * 150}ms both`;
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/40 to-white"
      data-section="chairperson-message"
      data-chairperson={chairpersonName}
    >
      <style>{`
        @keyframes fadeUpStagger {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-section {
          animation: fadeUpStagger 0.8s ease-out forwards;
        }
        .message-paragraph {
          opacity: 0;
        }
        .photo-frame {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .photo-frame:hover {
          transform: scale(1.03);
        }
        .chairperson-card {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .chairperson-card:hover {
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-12 items-center">
          {/* ────────────────────────────────────────
              LEFT: PHOTO SECTION (40%)
              ──────────────────────────────────────── */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Decorative Background Blobs */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-300 rounded-full opacity-15 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-400 rounded-full opacity-15 blur-3xl" />

              {/* Main Photo Frame */}
              <div className="relative z-10">
                <div className="photo-frame rounded-3xl border-8 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-emerald-200 to-emerald-100 aspect-square lg:aspect-auto lg:h-96 flex items-center justify-center text-emerald-400 text-7xl">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={chairpersonName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>

                {/* Chairperson Card (Overlapping Bottom) */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 chairperson-card w-80 bg-white rounded-3xl border-2 border-emerald-100 px-6 py-4 shadow-xl transition-all duration-300">
                  <div className="text-center">
                    {/* CMS: Name Field */}
                    <p
                      className="font-display font-bold text-lg text-emerald-950 mb-1"
                      data-field="chairperson_name"
                    >
                      {chairpersonName}
                    </p>
                    {/* CMS: Position Field */}
                    <p
                      className="text-xs font-semibold text-amber-600 uppercase tracking-widest"
                      data-field="chairperson_position"
                    >
                      {position}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────
              RIGHT: CONTENT SECTION (60%)
              ──────────────────────────────────────── */}
          <div ref={contentRef} className="lg:col-span-3 lg:pt-8">
            {/* Badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-sm font-semibold text-emerald-700 backdrop-blur-sm"
              data-field="badge_label"
            >
              <span className="text-amber-500">▸</span>
              {badgeLabel}
            </div>

            {/* Heading */}
            <h2 className="mb-8 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-emerald-950">
              Message from the
              <br />
              <span className="text-amber-600">Chairperson</span>
            </h2>

            {/* Decorative Large Quotation Mark */}
            <div className="absolute -top-12 -left-6 text-9xl opacity-[0.08] text-emerald-900 font-display leading-none pointer-events-none">
              "
            </div>

            {/* Message Body */}
            <div className="relative z-10 space-y-5">
              {/* CMS: Message Field (WYSIWYG Editor) */}
              {message.split("\n\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className="message-paragraph text-base sm:text-lg leading-8 text-slate-700 justify-text"
                  data-field={`message_paragraph_${idx}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Signature Section */}
            <div className="mt-10 pt-6 border-t border-emerald-100">
              {signatureUrl ? (
                <img
                  src={signatureUrl}
                  alt="Signature"
                  className="h-12 mb-2"
                  loading="lazy"
                />
              ) : (
                <div className="h-10 mb-2 text-2xl font-display text-amber-600">
                  —
                </div>
              )}
              <p
                className="font-display font-bold text-emerald-950"
                data-field="signature_name"
              >
                {chairpersonName}
              </p>
              <p
                className="text-sm font-semibold text-emerald-700"
                data-field="signature_title"
              >
                {position}, SFACL
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChairpersonMessage;
