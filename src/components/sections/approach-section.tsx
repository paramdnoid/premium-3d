import { approachContent } from "@/lib/content/site-content";
import { AbstractArchitectureGlow } from "@/components/scene/abstract-architecture-glow";
import { Icon } from "@/components/icons";

/** Section 02 — Ansatz: a statement plus three guiding principles. */
export function ApproachSection({ reduced = false }: { reduced?: boolean }) {
  return (
    <section
      id={approachContent.id}
      className="relative overflow-hidden px-6 py-28 md:py-36"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <AbstractArchitectureGlow reduced={reduced} className="opacity-55" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,3,3,0.94)_0%,rgba(2,3,3,0.72)_42%,rgba(2,3,3,0.34)_70%,rgba(2,3,3,0.6)_100%)]"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[#f4d7a1]/75">
            <span className="text-[#f8fbff]/35">{approachContent.index}</span>
            <span aria-hidden className="h-px w-6 bg-white/15" />
            {approachContent.eyebrow}
          </p>
          <h2 className="mt-6 text-3xl font-semibold uppercase leading-[1.12] tracking-tight text-[#f8fbff] md:text-5xl">
            {approachContent.title}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[#f8fbff]/55 md:text-base">
            {approachContent.body}
          </p>
          <a
            href={approachContent.link.href}
            className="mt-8 inline-flex items-center gap-2 border-b border-[#f8fbff]/25 pb-1 text-sm text-[#f8fbff]/70 transition-colors duration-200 hover:border-[#f8fbff]/60 hover:text-[#f8fbff]"
          >
            {approachContent.link.label}
            <Icon name="arrow-right" className="h-4 w-4" />
          </a>
        </div>

        <ul className="divide-y divide-white/[0.06] self-center overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          {approachContent.points.map((point) => (
            <li key={point.title} className="flex gap-6 p-6 md:p-7">
              <span className="text-sm font-semibold tracking-[0.1em] text-[#f4d7a1]/70">
                {point.index}
              </span>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#f8fbff]">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#f8fbff]/55">
                  {point.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
