import { statsContent } from "@/lib/content/site-content";

/** Section 03 — Zahlen: three headline metrics. */
export function StatsSection() {
  return (
    <section id={statsContent.id} className="section-band overflow-hidden">
      <span aria-hidden="true" className="micro-mark left-[2.3rem] top-[3.1rem]" />
      <span aria-hidden="true" className="micro-mark bottom-[3.1rem] right-[2.3rem]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(circle_at_4%_46%,rgba(217,185,120,0.13)_0_1px,transparent_2px)] bg-[length:18px_18px] opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_96%_58%,rgba(217,185,120,0.13)_0_1px,transparent_2px)] bg-[length:18px_18px] opacity-50"
      />
      <div className="zian-container relative z-10">
        <p className="section-label">
          <span className="section-label__index">{statsContent.index}</span>
          <span aria-hidden className="section-label__line" />
          {statsContent.eyebrow}
        </p>

        <div className="relative mt-10 grid gap-9 sm:grid-cols-3 sm:gap-0">
          <span aria-hidden="true" className="technical-rail hidden sm:block" />
          {statsContent.stats.map((stat) => (
            <div
              key={stat.value}
              className="relative px-0 py-5 sm:px-11 sm:first:pl-0 sm:last:pr-0 sm:[&:not(:last-child)]:border-r sm:[&:not(:last-child)]:border-white/[0.12]"
            >
              <p className="text-[clamp(4.25rem,8vw,6.9rem)] font-bold leading-none tracking-[0] text-[#d9b978] [text-shadow:0_0_28px_rgba(217,185,120,0.16)]">
                {stat.value}
              </p>
              {stat.label ? (
                <p className="mt-7 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#f3f4f1]">
                  {stat.label}
                </p>
              ) : null}
              <p className="mt-3 max-w-[14rem] text-[0.9rem] leading-[1.7] text-[#f3f4f1]/56">
                {stat.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
