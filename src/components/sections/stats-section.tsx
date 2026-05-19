import Image from "next/image";
import { statsContent } from "@/lib/content/site-content";

const statsArtworkSrc = "/assets/stats-dotted-corners.svg";

/** Section 03 — Zahlen: three headline metrics. */
export function StatsSection() {
  return (
    <section id={statsContent.id} className="section-band overflow-hidden">
      <span aria-hidden="true" className="micro-mark left-[2.3rem] top-[3.1rem]" />
      <span aria-hidden="true" className="micro-mark bottom-[3.1rem] right-[2.3rem]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.78]"
      >
        <Image
          src={statsArtworkSrc}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
      </div>
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
