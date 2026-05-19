import Image from "next/image";
import { contactContent } from "@/lib/content/site-content";
import { Icon } from "@/components/icons";

const contactArtworkSrc = "/assets/abstract-architecture-glow.svg";

/** Section 05 — Kontakt: the closing call to action. */
export function ContactSection() {
  return (
    <section id={contactContent.id} className="section-band overflow-hidden py-28 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src={contactArtworkSrc}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[18%_58%] opacity-40 md:opacity-52"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,3,3,0.28)_0%,rgba(2,3,3,0.68)_45%,#020303_100%),linear-gradient(180deg,#020303_0%,rgba(2,3,3,0.48)_38%,#020303_100%)]"
      />
      <div className="zian-container relative z-10">
        <div className="mx-auto max-w-[43rem] text-center">
        <p className="section-label justify-center">
          <span className="section-label__index">{contactContent.index}</span>
          <span aria-hidden className="section-label__line" />
          {contactContent.eyebrow}
        </p>
        <h2 className="section-heading mt-8">
          {contactContent.title}
        </h2>
        <p className="body-copy mx-auto mt-7 max-w-[35rem]">
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
