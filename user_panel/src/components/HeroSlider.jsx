import { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import jalthal from "../assets/jalthal.png";
import jalthal1 from "../assets/2.jpg";

const defaultSlides = [
  {
    id: 1,
    image: jalthal,
    title: "Sana Kisan Agro Cooperative Ltd.",
    subtitle: "Member-led financial and agricultural services for a stronger Jalthal community.",
    badge: "Cooperative excellence",
  },
  {
    id: 2,
    image: jalthal1,
    title: "Progress through collective action",
    subtitle: "Dairy, savings, and rural development programs built around member needs.",
    badge: "Community impact",
  },
];

export default function HeroSlider({ slides = defaultSlides }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 700);
  }, [animating]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="relative flex min-h-[460px] w-full items-center bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 transition-all duration-700 md:min-h-[560px]"
        style={slide.image ? { backgroundImage: `url(${slide.image})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/45 to-emerald-900/20" />
        <div className="absolute right-10 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 left-12 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-md sm:p-8">
            <div className="mb-4 inline-flex w-fit items-center rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-100">
              {slide.badge}
            </div>
            <h1 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-emerald-50/90 sm:text-lg">
              {slide.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/about" className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-400">
                Learn More <FaArrowRight className="text-xs" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <button onClick={prev} className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white backdrop-blur transition hover:bg-black/30 sm:left-6" aria-label="Previous slide">
          <FaChevronLeft />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white backdrop-blur transition hover:bg-black/30 sm:right-6" aria-label="Next slide">
          <FaChevronRight />
        </button>

        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className={`rounded-full transition-all ${i === current ? "h-2.5 w-6 bg-amber-400" : "h-2.5 w-2.5 bg-white/60 hover:bg-white/85"}`} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
