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

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {servicesContent.cards.map((card) => (
            <article
              key={card.title}
              className="tech-panel group flex min-h-[21.5rem] flex-col p-8 pt-10 transition-colors duration-300 hover:border-[#d9b978]/34 md:p-10"
            >
              <span className="flex h-14 w-14 items-center justify-center border border-white/[0.12] text-[#f3f4f1]/80 shadow-[0_0_24px_rgba(217,185,120,0.06)]">
                <Icon name={card.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-10 text-[1.18rem] font-bold text-[#f3f4f1]">
                {card.title}
              </h3>
              <p className="mt-5 flex-1 text-[0.88rem] leading-[1.85] text-[#f3f4f1]/54">
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
