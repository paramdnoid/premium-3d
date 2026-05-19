import { approachContent } from "@/lib/content/site-content";
import { AbstractArchitectureGlow } from "@/components/scene/abstract-architecture-glow";
import { Icon } from "@/components/icons";

/** Section 02 — Ansatz: a statement plus three guiding principles. */
export function ApproachSection({ reduced = false }: { reduced?: boolean }) {
  return (
    <section
      id={approachContent.id}
      className="section-band overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <AbstractArchitectureGlow reduced={reduced} className="opacity-26" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#020303_0%,rgba(2,3,3,0.95)_42%,rgba(2,3,3,0.66)_72%,#020303_100%)]"
      />

      <div className="zian-container relative z-10 grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div className="max-w-[31rem]">
          <p className="section-label">
            <span className="section-label__index">{approachContent.index}</span>
            <span aria-hidden className="section-label__line" />
            {approachContent.eyebrow}
          </p>
          <h2 className="section-heading mt-10">
            {approachContent.title}
          </h2>
          <p className="body-copy mt-8">
            {approachContent.body}
          </p>
          <a
            href={approachContent.link.href}
            className="zian-link mt-10"
          >
            {approachContent.link.label}
            <Icon name="arrow-right" className="h-4 w-4" />
          </a>
        </div>

        <ul className="tech-panel self-center divide-y divide-white/[0.075]">
          {approachContent.points.map((point) => (
            <li key={point.title} className="grid gap-6 p-7 md:grid-cols-[3rem_1fr] md:p-10">
              <span className="text-[1.04rem] font-bold tracking-[0.12em] text-[#d9b978]/78">
                {point.index}
              </span>
              <div>
                <h3 className="text-[0.88rem] font-bold uppercase tracking-[0.12em] text-[#f3f4f1]">
                  {point.title}
                </h3>
                <p className="mt-3 max-w-sm text-[0.88rem] leading-[1.75] text-[#f3f4f1]/54">
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
