import { useEffect, useRef } from "react";
import { Quote } from "lucide-react";

function ChairpersonMessage({ data = null }) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  const chairpersonData = data || {
    chairpersonName: "Ram Bahadur Rai",
    position: "Chairperson",
    photoUrl: null,
    signatureUrl: null,
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-section");
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    const paragraphs = contentRef.current?.querySelectorAll(".message-paragraph");
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
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-12 items-center">
          {/* Left: Photo Section */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-amber-300 opacity-15 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-emerald-400 opacity-15 blur-3xl" />

              <div className="relative z-10">
                <div className="overflow-hidden rounded-3xl border-8 border-white shadow-2xl bg-gradient-to-br from-emerald-200 to-emerald-100 aspect-square lg:aspect-auto lg:h-96 flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={chairpersonName}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-900">
                      <Quote className="h-16 w-16 text-white/30" strokeWidth={1} />
                    </div>
                  )}
                </div>

                <div className="absolute -bottom-8 left-1/2 z-20 w-80 -translate-x-1/2 rounded-3xl border-2 border-emerald-100 bg-white px-6 py-4 text-center shadow-xl transition-all duration-300 hover:shadow-2xl">
                  <p className="mb-1 font-display text-lg font-bold text-emerald-950">
                    {chairpersonName}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                    {position}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content Section */}
          <div ref={contentRef} className="lg:col-span-3 lg:pt-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-sm font-semibold text-emerald-700 backdrop-blur-sm">
              <span className="text-amber-500">▸</span>
              {badgeLabel}
            </div>

            <h2 className="mb-8 font-display text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">
              Message from the
              <br />
              <span className="text-amber-600">Chairperson</span>
            </h2>

            <div className="relative z-10 space-y-5">
              <div className="absolute -top-12 -left-6 pointer-events-none font-display text-9xl leading-none text-emerald-900 opacity-[0.08]">
                "
              </div>
              {message.split("\n\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className="message-paragraph text-base leading-8 text-slate-700 sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 border-t border-emerald-100 pt-6">
              {signatureUrl ? (
                <img src={signatureUrl} alt="Signature" className="mb-2 h-12" loading="lazy" />
              ) : (
                <div className="mb-2 font-display text-2xl text-amber-600">—</div>
              )}
              <p className="font-display font-bold text-emerald-950">{chairpersonName}</p>
              <p className="text-sm font-semibold text-emerald-700">{position}, SFACL</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .message-paragraph { opacity: 0; }
        @keyframes fadeUpStagger {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

export default ChairpersonMessage;
