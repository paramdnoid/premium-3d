import { contactContent, heroContent } from "@/lib/content/site-content";
import { Reveal } from "./reveal";

/** Section 05 — Kontakt: the closing call to action and footer. */
export function ContactSection() {
  return (
    <section id={contactContent.id} className="relative px-6 py-32 md:py-44">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.32em] text-[#f4d7a1]/75">
            <span className="text-[#f8fbff]/30">{contactContent.index}</span>
            {contactContent.eyebrow}
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.12] tracking-tight text-[#f8fbff] md:text-5xl">
            {contactContent.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[#f8fbff]/55 md:text-base">
            {contactContent.body}
          </p>
          <a
            href={contactContent.ctaHref}
            className="mt-10 inline-flex items-center rounded-full border border-[#f4d7a1]/30 bg-[#f4d7a1]/10 px-8 py-3.5 text-sm font-medium text-[#f4d7a1] transition-colors duration-300 hover:bg-[#f4d7a1]/20"
          >
            {contactContent.ctaLabel}
          </a>
        </div>
      </Reveal>

      <footer className="mx-auto mt-28 flex max-w-6xl flex-col items-center gap-1 border-t border-white/[0.06] pt-8 text-xs text-[#f8fbff]/35 sm:flex-row sm:justify-between">
        <span>
          © {new Date().getFullYear()} {heroContent.eyebrow}
        </span>
        <span className="tracking-[0.2em] uppercase">{heroContent.title}</span>
      </footer>
    </section>
  );
}
