import { contactContent } from "@/lib/content/site-content";
import { Icon } from "@/components/icons";

/** Section 05 — Kontakt: the closing call to action. */
export function ContactSection() {
  return (
    <section id={contactContent.id} className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-3xl text-center">
        <p className="flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[#f4d7a1]/75">
          <span className="text-[#f8fbff]/35">{contactContent.index}</span>
          <span aria-hidden className="h-px w-6 bg-white/15" />
          {contactContent.eyebrow}
        </p>
        <h2 className="mt-6 text-3xl font-semibold uppercase leading-[1.12] tracking-tight text-[#f8fbff] md:text-5xl">
          {contactContent.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[#f8fbff]/55 md:text-base">
          {contactContent.body}
        </p>
        <a
          href={contactContent.cta.href}
          className="mt-10 inline-flex items-center gap-2 rounded-md bg-[#f4d7a1] px-7 py-3.5 text-sm font-semibold text-[#0a0a0a] transition-colors duration-200 hover:bg-[#f8e3b8]"
        >
          {contactContent.cta.label}
          <Icon name="arrow-up-right" className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
