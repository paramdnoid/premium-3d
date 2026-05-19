import { statsContent } from "@/lib/content/site-content";

/** Section 03 — Zahlen: three headline metrics. */
export function StatsSection() {
  return (
    <section id={statsContent.id} className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[#f4d7a1]/75">
          <span className="text-[#f8fbff]/35">{statsContent.index}</span>
          <span aria-hidden className="h-px w-6 bg-white/15" />
          {statsContent.eyebrow}
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {statsContent.stats.map((stat) => (
            <div key={stat.label} className="border-t border-white/[0.1] pt-8">
              <p className="text-6xl font-semibold tracking-tight text-[#f4d7a1] md:text-7xl">
                {stat.value}
              </p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#f8fbff]">
                {stat.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#f8fbff]/55">
                {stat.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
