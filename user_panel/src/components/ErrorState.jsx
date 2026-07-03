import { FaRedo } from "react-icons/fa";

export default function ErrorState({
  title = "Something went wrong",
  description = "Please check your connection and try again.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.6rem] border border-red-100 bg-red-50/60 py-16 text-center">
      <p className="text-base font-medium text-red-500">{title}</p>
      <p className="mt-1 mb-5 text-sm text-slate-400">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
        >
          <FaRedo className="text-xs" />
          Retry
        </button>
      )}
    </div>
  );
}
