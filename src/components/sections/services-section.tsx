import { servicesContent } from "@/lib/content/site-content";
import { Icon } from "@/components/icons";

/** Section 01 — Leistungen: three service cards. */
export function ServicesSection() {
  return (
    <section id={servicesContent.id} className="section-band">
      <div className="zian-container relative z-10">
        <p className="section-label">
          <span className="section-label__index">{servicesContent.index}</span>
          <span aria-hidden className="section-label__line" />
          {servicesContent.eyebrow}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {servicesContent.cards.map((card, cardIndex) => (
            <article
              key={card.title}
              className="tech-panel group flex min-h-[20.4rem] flex-col p-7 pt-9 transition-colors duration-300 hover:border-[#d9b978]/34 md:p-9 md:pt-10"
            >
              <span aria-hidden="true" className="technical-rail" />
              <span className="tech-panel__index mb-7">
                {String(cardIndex + 1).padStart(2, "0")}
              </span>
              <span className="flex h-[3.25rem] w-[3.25rem] items-center justify-center border border-white/[0.11] bg-black/12 text-[#f3f4f1]/78 shadow-[0_0_24px_rgba(217,185,120,0.055)]">
                <Icon name={card.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-8 text-[1.08rem] font-bold text-[#f3f4f1]">
                {card.title}
              </h3>
              <p className="mt-5 flex-1 text-[0.84rem] leading-[1.84] text-[#f3f4f1]/54">
                {card.body}
              </p>
              <Icon
                name="arrow-right"
                className="mt-9 h-5 w-5 text-[#d9b978]/68 transition-colors duration-300 group-hover:text-[#d9b978]"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
