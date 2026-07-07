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
    subtitle:
      "Member-led financial and agricultural services for a stronger Jalthal community.",
    badge: "Cooperative excellence",
  },
  {
    id: 2,
    image: jalthal1,
    title: "Progress through collective action",
    subtitle:
      "Dairy, savings, and rural development programs built around member needs.",
    badge: "Community impact",
  },
];

export default function HeroSlider({ slides = defaultSlides }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);

  const goTo = useCallback(
    (index) => {
      setPrev(current);
      setCurrent(index);
    },
    [current],
  );

  const prevSlide = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, slides.length, goTo],
  );

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative flex min-h-[500px] w-full items-center md:min-h-[620px]">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/60 to-emerald-900/30" />
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

        {/* Animated floating shapes */}
        <svg
          className="absolute right-[8%] top-[15%] h-16 w-16 text-white/5 animate-pulse"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <circle cx="50" cy="50" r="40" />
        </svg>
        <svg
          className="absolute bottom-[20%] left-[5%] h-10 w-10 text-amber-300/10 animate-bounce"
          viewBox="0 0 100 100"
          fill="currentColor"
          style={{ animationDuration: "4s" }}
        >
          <polygon points="50,10 90,90 10,90" />
        </svg>

        {/* Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl transform transition-all duration-700 ease-out">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-500/20 to-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.28em] text-amber-200 backdrop-blur-sm shadow-lg shadow-amber-500/10">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              {slide.badge}
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.15] tracking-[-0.01em] text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-emerald-50/85 sm:text-xl sm:leading-9">
              {slide.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(245,166,35,0.3)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(245,166,35,0.4)]"
              >
                Learn More
                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Navigationarrows */}

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "h-3 w-8 bg-gradient-to-r from-amber-400 to-amber-300 shadow-lg shadow-amber-400/40"
                  : "h-3 w-3 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
