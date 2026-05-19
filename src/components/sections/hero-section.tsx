import Image from "next/image";
import { heroContent } from "@/lib/content/site-content";
import { HeroSignet } from "@/components/scene/hero-signet";
import { Icon } from "@/components/icons";

const heroArtworkSrc = "/assets/abstract-architecture-glow.svg";

/** Opening hero — headline + CTAs on the left, the 3D signet on the right. */
export function HeroSection({ reduced = false }: { reduced?: boolean }) {
  return (
    <section
      id="top"
      className="relative min-h-svh overflow-hidden px-6 pt-32 pb-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 min-h-svh">
        <Image
          src={heroArtworkSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_50%] opacity-45 sm:opacity-60 md:object-[64%_50%] md:opacity-75 lg:object-[59%_50%] lg:opacity-95"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#010202_0%,#010202_24%,rgba(1,2,2,0.9)_39%,rgba(1,2,2,0.34)_62%,rgba(1,2,2,0.48)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.18)_25%,rgba(0,0,0,0.08)_64%,rgba(0,0,0,0.86)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_42%_52%,rgba(1,2,2,0.42),transparent_36rem),radial-gradient(ellipse_at_76%_48%,rgba(244,215,161,0.08),transparent_28rem)]"
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-8rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left — copy */}
        <div className="relative z-20 min-w-0">
          <p className="flex max-w-[20rem] items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#f4d7a1]/80 sm:max-w-none sm:text-[0.7rem] sm:tracking-[0.32em]">
            <span aria-hidden className="h-px w-8 bg-[#f4d7a1]/60" />
            {heroContent.eyebrow}
          </p>

          <h1 className="mt-7 max-w-[21rem] text-[2rem] font-semibold uppercase leading-[1.06] tracking-tight text-[#f8fbff] [text-shadow:0_0_18px_rgba(0,0,0,0.78)] sm:max-w-xl sm:text-5xl lg:text-6xl">
            {heroContent.headline}
            <span className="mt-1 block text-[#f4d7a1]">
              {heroContent.headlineAccent}
            </span>
          </h1>

          <p className="mt-7 max-w-[20rem] text-sm leading-relaxed text-[#f8fbff]/58 [text-shadow:0_0_16px_rgba(0,0,0,0.82)] sm:max-w-md md:text-base">
            {heroContent.body}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={heroContent.ctaPrimary.href}
              className="inline-flex items-center gap-2 rounded-md bg-[#f4d7a1] px-7 py-3.5 text-sm font-semibold text-[#0a0a0a] transition-colors duration-200 hover:bg-[#f8e3b8]"
            >
              {heroContent.ctaPrimary.label}
              <Icon name="arrow-up-right" className="h-4 w-4" />
            </a>
            <a
              href={heroContent.ctaSecondary.href}
              className="border-b border-[#f8fbff]/25 pb-1 text-sm text-[#f8fbff]/70 transition-colors duration-200 hover:border-[#f8fbff]/60 hover:text-[#f8fbff]"
            >
              {heroContent.ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* Right — existing 3D logo above the SVG architecture layer. */}
        <div className="pointer-events-none relative z-20 min-h-[320px] w-full overflow-visible sm:min-h-[440px] lg:-mr-16 lg:min-h-[620px]">
          <div className="absolute inset-[-18%] translate-x-3 md:translate-x-8 lg:translate-x-12">
            <HeroSignet reduced={reduced} />
          </div>

          <span className="absolute left-1 top-4 text-[0.6rem] uppercase tracking-[0.3em] text-[#f8fbff]/34">
            01
          </span>
          <ul className="absolute right-1 top-1/2 flex -translate-y-1/2 flex-col gap-3 text-right">
            {heroContent.hudLabels.map((label) => (
              <li
                key={label}
                className="text-[0.6rem] uppercase tracking-[0.28em] text-[#f8fbff]/38"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
