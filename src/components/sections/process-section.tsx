import { processContent } from "@/lib/content/site-content";
import { Icon } from "@/components/icons";

/** Section 04 — Prozess: the three-step way of working. */
export function ProcessSection() {
  return (
    <section id={processContent.id} className="section-band overflow-hidden">
      <div className="zian-container relative z-10">
        <p className="section-label">
          <span className="section-label__index">{processContent.index}</span>
          <span aria-hidden className="section-label__line" />
          {processContent.eyebrow}
        </p>

        <div className="mt-10 grid gap-7 md:grid-cols-2 md:items-start">
          <h2 className="section-heading max-w-[33rem]">
            {processContent.title}
          </h2>
          <p className="body-copy max-w-[27rem] md:justify-self-end">
            {processContent.body}
          </p>
        </div>

        <ol className="relative mt-16 grid gap-7 md:grid-cols-3">
          <span
            aria-hidden="true"
            className="absolute left-[3%] right-[3%] top-1/2 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(217,185,120,0.58),transparent)] md:block"
          />
          {processContent.steps.map((step) => (
            <li
              key={step.index}
              className="tech-panel relative min-h-[16.8rem] p-8 pb-20 md:p-10 md:pb-20"
            >
              <span className="text-[0.93rem] font-bold tracking-[0.18em] text-[#d9b978]/78">
                {step.index}
              </span>
              <h3 className="mt-8 text-[0.92rem] font-bold uppercase tracking-[0.12em] text-[#f3f4f1]">
                {step.title}
              </h3>
              <p className="mt-4 text-[0.88rem] leading-[1.75] text-[#f3f4f1]/54">
                {step.body}
              </p>
              <Icon
                name={step.icon}
                className="absolute bottom-8 right-8 h-5 w-5 text-[#f3f4f1]/42"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
