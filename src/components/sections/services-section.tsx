import { servicesContent } from "@/lib/content/site-content";
import { Icon } from "@/components/icons";

/** Section 01 — Leistungen: three service cards. */
export function ServicesSection() {
  return (
    <section id={servicesContent.id} className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[#f4d7a1]/75">
          <span className="text-[#f8fbff]/35">{servicesContent.index}</span>
          <span aria-hidden className="h-px w-6 bg-white/15" />
          {servicesContent.eyebrow}
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {servicesContent.cards.map((card) => (
            <article
              key={card.title}
              className="group flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 transition-colors duration-300 hover:border-[#f4d7a1]/25"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.09] text-[#f4d7a1]">
                <Icon name={card.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-8 text-lg font-semibold text-[#f8fbff]">
                {card.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#f8fbff]/55">
                {card.body}
              </p>
              <Icon
                name="arrow-right"
                className="mt-8 h-5 w-5 text-[#f8fbff]/35 transition-colors duration-300 group-hover:text-[#f4d7a1]"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
