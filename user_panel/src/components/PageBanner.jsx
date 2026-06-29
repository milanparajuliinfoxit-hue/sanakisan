export default function PageBanner({ title, subtitle, breadcrumb, eyebrow }) {
    return (
        <section className="relative overflow-hidden border-b border-emerald-100/70 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_38%),linear-gradient(135deg,#14532d_0%,#166534_48%,#15803d_100%)]">
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.16)_0%,transparent_30%,rgba(212,160,23,0.16)_100%)]" />
            <div className="relative mx-auto flex max-w-7xl flex-col gap-3 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                {eyebrow ? (
                    <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-50">
                        {eyebrow}
                    </span>
                ) : null}
                <div className="text-sm font-medium text-emerald-100/90">
                    {breadcrumb}
                </div>
                <h1 className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {title}
                </h1>
                {subtitle ? (
                    <p className="max-w-2xl text-base leading-7 text-emerald-50/90 sm:text-lg">
                        {subtitle}
                    </p>
                ) : null}
            </div>
        </section>
    );
}
