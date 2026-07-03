import PropTypes from "prop-types";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className || ""}`}
      {...props}
    />
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
};

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-8" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-20" />
        </div>
      ))}
    </div>
  );
}

TableSkeleton.propTypes = {
  rows: PropTypes.number,
};

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

CardSkeleton.propTypes = {
  count: PropTypes.number,
};

export function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export default Skeleton;
