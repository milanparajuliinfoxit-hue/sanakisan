export default function PageBanner({ title, breadcrumb }) {
  return (
    <section className="h-20 flex items-center border-b border-slate-100 bg-white">
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          {breadcrumb && (
            <>
              <div className="text-xs font-medium text-slate-500">
                {breadcrumb}
              </div>
              <span className="hidden sm:inline text-slate-300">|</span>
            </>
          )}
          <h1 className="font-display text-base font-semibold text-slate-900 sm:text-lg">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}

