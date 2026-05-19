import { servicesContent } from "@/lib/content/site-content";
import { Reveal } from "./reveal";

/** Section 01 — Leistungen: three service cards. */
export function ServicesSection() {
  return (
    <section id={servicesContent.id} className="relative px-6 py-28 md:py-36">
      <Reveal>
        <div className="mx-auto max-w-6xl">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.32em] text-[#f4d7a1]/75">
            <span className="text-[#f8fbff]/30">{servicesContent.index}</span>
            {servicesContent.eyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.12] tracking-tight text-[#f8fbff] md:text-5xl">
            {servicesContent.title}
          </h2>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {servicesContent.cards.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.024] p-7 transition-colors duration-300 hover:border-[#f4d7a1]/25"
              >
                <h3 className="text-lg font-semibold text-[#f8fbff]">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#f8fbff]/55">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
