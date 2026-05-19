import Image from "next/image";
import { heroContent } from "@/lib/content/site-content";
import { Icon } from "@/components/icons";
import { HeroSignet } from "@/components/scene/hero-signet";

const heroArtworkSrc = "/assets/abstract-architecture-glow.svg";

/** Opening hero — reference-like headline with a restrained architectural HUD. */
export function HeroSection({ reduced = false }: { reduced?: boolean }) {
  return (
    <section
      id="top"
      data-reduced-motion={reduced ? "true" : undefined}
      className="relative isolate min-h-svh overflow-hidden border-b border-white/[0.075] pt-[5.25rem]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src={heroArtworkSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_48%] opacity-30 mix-blend-screen md:opacity-70"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#020303_0%,rgba(2,3,3,0.99)_27%,rgba(2,3,3,0.82)_47%,rgba(2,3,3,0.18)_70%,rgba(2,3,3,0.55)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_44%,rgba(217,185,120,0.15),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.44)_0%,rgba(0,0,0,0.06)_32%,rgba(0,0,0,0.15)_68%,rgba(0,0,0,0.74)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[5.25rem] right-0 z-[6] hidden w-[58vw] max-w-[55rem] lg:block"
      >
        <HeroSignet reduced={reduced} />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,185,120,0.36),transparent)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 hidden text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#f3f4f1]/48 md:block"
      >
        <span className="absolute right-[20.2vw] top-[21%]">01</span>
        <span className="absolute right-[11.6vw] top-[18.5%] text-[#d9b978]/80">A1</span>
        <span className="absolute right-[22.8vw] top-[58%] text-[#f3f4f1]/34">21</span>
        <ul className="absolute right-[13.8vw] top-[67%] space-y-2 text-left text-[#f3f4f1]/48">
          {heroContent.hudLabels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div>

      <div className="zian-container relative z-10 min-h-[calc(100svh-5.25rem)] py-16 md:py-24 lg:flex lg:items-center lg:py-[clamp(4.1rem,7.4vh,6rem)]">
        <div className="relative z-20 max-w-[48rem] min-w-0">
          <p className="section-label">
            <span aria-hidden className="section-label__line" />
            {heroContent.eyebrow}
          </p>

          <h1 className="display-heading hero-heading-measure mt-9 md:mt-9 [text-shadow:0_0_24px_rgba(0,0,0,0.86)]">
            {heroContent.headlineLines.map((line) => (
              <span key={line} className="block md:whitespace-nowrap">
                {line}
              </span>
            ))}
            <span className="block text-[#d9b978] md:whitespace-nowrap">
              {heroContent.headlineAccent}
            </span>
          </h1>

          <p className="body-copy hero-copy-measure mt-9 md:mt-10 [text-shadow:0_0_18px_rgba(0,0,0,0.92)]">
            {heroContent.body}
          </p>

          <div className="hero-actions mt-10 flex flex-wrap items-center gap-x-4 gap-y-4 md:mt-10 md:gap-x-4">
            <a
              href={heroContent.ctaPrimary.href}
              className="zian-btn"
            >
              {heroContent.ctaPrimary.label}
              <Icon name="arrow-up-right" className="h-4 w-4" />
            </a>
            <a
              href={heroContent.ctaSecondary.href}
              className="zian-link"
            >
              {heroContent.ctaSecondary.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
