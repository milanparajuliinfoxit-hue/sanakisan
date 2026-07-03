import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  icon: Icon,
  iconBg,
  label,
  title,
  description,
  viewAllLink,
  viewAllText = "View All",
}) {
  return (
    <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${iconBg || "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white"}`}>
            <Icon className="h-6 w-6" strokeWidth={1.8} />
          </div>
        )}
        <div>
          {label && (
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">
              {label}
            </p>
          )}
          <h2 className="font-display text-3xl font-bold text-emerald-950">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:gap-3 hover:text-emerald-900 group"
        >
          {viewAllText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
