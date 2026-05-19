import { processContent } from "@/lib/content/site-content";
import { Icon } from "@/components/icons";

/** Section 04 — Prozess: the three-step way of working. */
export function ProcessSection() {
  return (
    <section id={processContent.id} className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[#f4d7a1]/75">
          <span className="text-[#f8fbff]/35">{processContent.index}</span>
          <span aria-hidden className="h-px w-6 bg-white/15" />
          {processContent.eyebrow}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-end">
          <h2 className="text-3xl font-semibold uppercase leading-[1.12] tracking-tight text-[#f8fbff] md:text-5xl">
            {processContent.title}
          </h2>
          <p className="text-sm leading-relaxed text-[#f8fbff]/55 md:max-w-sm md:justify-self-end md:text-base">
            {processContent.body}
          </p>
        </div>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {processContent.steps.map((step) => (
            <li
              key={step.index}
              className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 pb-20"
            >
              <span className="text-sm font-semibold tracking-[0.2em] text-[#f4d7a1]/70">
                {step.index}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[#f8fbff]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#f8fbff]/55">
                {step.body}
              </p>
              <Icon
                name={step.icon}
                className="absolute bottom-7 right-7 h-5 w-5 text-[#f8fbff]/35"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
