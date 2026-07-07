import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function PageBreadcrumb({ title, items = [] }) {
  return (
    <div className="border-b border-emerald-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="mb-0">
          <ol className="flex items-center gap-1.5 text-sm text-slate-500">
            {items.map((item, i) => {
              const isLast = i === items.length - 1;
              return (
                <li key={item.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" strokeWidth={2} />}
                  {isLast ? (
                    <span className="font-medium text-emerald-800">{item.label}</span>
                  ) : (
                    <Link to={item.path || "#"} className="transition hover:text-emerald-700">
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Title intentionally omitted to avoid duplication with breadcrumb */}
      </div>
    </div>
  );
}
