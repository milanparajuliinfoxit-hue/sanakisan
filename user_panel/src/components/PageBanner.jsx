export default function PageBanner({ title, breadcrumb }) {
  return (
    <section className="py-3 flex items-center border-b border-slate-100 bg-white">
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {breadcrumb && (
            <div className="text-sm font-medium text-slate-500">{breadcrumb}</div>
          )}
        </div>
      </div>
    </section>
  );
}

