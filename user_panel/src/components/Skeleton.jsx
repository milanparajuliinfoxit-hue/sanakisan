export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-emerald-100 bg-white shadow-sm">
      <div className="skeleton-shimmer h-48 w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton-shimmer h-4 w-3/4 rounded-full" />
        <div className="skeleton-shimmer h-3 w-1/2 rounded-full" />
        <div className="skeleton-shimmer h-3 w-2/5 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonLine({ width = "w-full", height = "h-4" }) {
  return <div className={`skeleton-shimmer rounded-full ${height} ${width}`} />;
}

export function SkeletonImage({ className = "h-48" }) {
  return <div className={`skeleton-shimmer w-full ${className}`} />;
}

export function SkeletonGrid({ count = 6, cols = "sm:grid-cols-2 lg:grid-cols-3" }) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${cols}`}>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-start gap-4 rounded-xl border border-emerald-100 bg-white p-4"
        >
          <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-emerald-200/50" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-2/3 rounded bg-emerald-200/50" />
            <div className="h-3 w-1/3 rounded bg-emerald-100/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
