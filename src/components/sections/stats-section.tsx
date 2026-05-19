import { statsContent } from "@/lib/content/site-content";
import { Reveal } from "./reveal";

/** Section 03 — Zahlen: three headline metrics. */
export function StatsSection() {
  return (
    <section id={statsContent.id} className="relative px-6 py-28 md:py-36">
      <Reveal>
        <div className="mx-auto max-w-6xl">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.32em] text-[#f4d7a1]/75">
            <span className="text-[#f8fbff]/30">{statsContent.index}</span>
            {statsContent.eyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.12] tracking-tight text-[#f8fbff] md:text-5xl">
            {statsContent.title}
          </h2>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {statsContent.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.024] p-8"
              >
                <p className="text-5xl font-semibold tracking-tight text-[#f4d7a1] md:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#f8fbff]/55">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
