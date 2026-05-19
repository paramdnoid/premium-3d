import { approachContent } from "@/lib/content/site-content";
import { Reveal } from "./reveal";

/** Section 02 — Ansatz: a statement plus three guiding principles. */
export function ApproachSection() {
  return (
    <section id={approachContent.id} className="relative px-6 py-28 md:py-36">
      <Reveal>
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.32em] text-[#f4d7a1]/75">
              <span className="text-[#f8fbff]/30">{approachContent.index}</span>
              {approachContent.eyebrow}
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.12] tracking-tight text-[#f8fbff] md:text-5xl">
              {approachContent.title}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[#f8fbff]/55 md:text-base">
              {approachContent.body}
            </p>
          </div>

          <ul className="divide-y divide-white/[0.06] self-center overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            {approachContent.points.map((point) => (
              <li key={point.title} className="p-6 md:p-7">
                <h3 className="text-base font-semibold text-[#f8fbff]">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#f8fbff]/55">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
