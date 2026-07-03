export default function EmptyState({
  icon: Icon,
  title = "No data found",
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.6rem] border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-16 text-center">
      {Icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <Icon className="h-6 w-6 text-emerald-500" strokeWidth={1.5} />
        </div>
      )}
      <p className="text-sm font-medium text-emerald-700">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
