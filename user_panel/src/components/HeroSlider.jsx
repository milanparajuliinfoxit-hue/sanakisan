import { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import jalthal from "../assets/jalthal.png";
import jalthal1 from "../assets/2.jpeg";
import jalthal2 from "../assets/3.jpeg";
import jalthal3 from "../assets/4.jpeg";
import jalthal4 from "../assets/5.jpeg";

const defaultSlides = [
  {
    id: 1,
    image: jalthal,
    bgColor: "transparent",
  },
  {
    id: 2,
    image: jalthal1,
  },
  {
    id: 3,
    image: jalthal2,
  },
  {
    id: 4,
    image: jalthal3,
  },
  {
    id: 5,
    image: jalthal4,
  },
];

export default function HeroSlider({ slides = defaultSlides }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 700);
    },
    [animating],
  );

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, slides.length, goTo],
  );

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden">
      <div
        className={`relative min-h-[450px] md:min-h-[450px] flex items-center bg-gradient-to-br ${slide.bgColor} transition-all duration-700`}
        style={
          slide.image
            ? {
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
      >
        {/* Overlay */}
        <div className="absolute inset-0" />

        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-black transition-all"
          aria-label="Previous slide"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-black transition-all"
          aria-label="Next slide"
        >
          <FaChevronRight />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${i === current ? "w-6 h-2.5 bg-accent" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
