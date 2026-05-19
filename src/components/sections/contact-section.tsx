import Image from "next/image";
import { contactContent } from "@/lib/content/site-content";
import { Icon } from "@/components/icons";

const contactArtworkSrc = "/assets/luminous-perspective-grid.svg";

/** Section 05 — Kontakt: the closing call to action. */
export function ContactSection() {
  return (
    <section id={contactContent.id} className="section-band overflow-hidden py-24 md:py-32">
      <span aria-hidden="true" className="micro-mark left-[8%] top-[24%]" />
      <span aria-hidden="true" className="micro-mark bottom-[18%] right-[8%]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src={contactArtworkSrc}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-[5%_58%] opacity-[0.56] md:opacity-[0.78]"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_29%_55%,rgba(217,185,120,0.08),transparent_36%),linear-gradient(90deg,rgba(2,3,3,0.12)_0%,rgba(2,3,3,0.62)_47%,#020303_100%),linear-gradient(180deg,#020303_0%,rgba(2,3,3,0.36)_38%,#020303_100%)]"
      />
      <div className="zian-container relative z-10">
        <div className="mx-auto max-w-[41rem] text-center">
          <p className="section-label justify-center">
            <span className="section-label__index">{contactContent.index}</span>
            <span aria-hidden className="section-label__line" />
            {contactContent.eyebrow}
          </p>
          <h2 className="section-heading mt-8">
            {contactContent.title}
          </h2>
          <p className="body-copy mx-auto mt-7 max-w-[34rem]">
            {contactContent.body}
          </p>
          <a
            href={contactContent.cta.href}
            className="zian-btn mt-10"
          >
            {contactContent.cta.label}
            <Icon name="arrow-up-right" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
