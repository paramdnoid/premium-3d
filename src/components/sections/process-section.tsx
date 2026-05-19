import { processContent } from "@/lib/content/site-content";
import { Reveal } from "./reveal";

/** Section 04 — Prozess: the three-step way of working. */
export function ProcessSection() {
  return (
    <section id={processContent.id} className="relative px-6 py-28 md:py-36">
      <Reveal>
        <div className="mx-auto max-w-6xl">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.32em] text-[#f4d7a1]/75">
            <span className="text-[#f8fbff]/30">{processContent.index}</span>
            {processContent.eyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.12] tracking-tight text-[#f8fbff] md:text-5xl">
            {processContent.title}
          </h2>

          <ol className="mt-14 grid gap-5 md:grid-cols-3">
            {processContent.steps.map((step) => (
              <li
                key={step.index}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.024] p-7"
              >
                <span className="text-sm font-semibold tracking-[0.2em] text-[#f4d7a1]/70">
                  {step.index}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[#f8fbff]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#f8fbff]/55">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}
