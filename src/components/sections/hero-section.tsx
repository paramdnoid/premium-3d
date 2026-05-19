import { heroContent } from "@/lib/content/site-content";

/**
 * Opening hero — the wordmark and scroll hint. The 3D signet itself lives in
 * the fixed journey canvas above this content.
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-end px-6 pb-[13vh] text-center">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.42em] text-[#f8fbff]/45">
        {heroContent.eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[0.07em] text-[#f8fbff] md:text-6xl">
        {heroContent.title}
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#f8fbff]/55 md:text-base">
        {heroContent.tagline}
      </p>

      <span className="mt-12 flex flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.34em] text-[#f8fbff]/35">
        {heroContent.scrollHint}
        <span
          aria-hidden
          className="h-12 w-px bg-gradient-to-b from-[#f8fbff]/45 to-transparent"
        />
      </span>
    </section>
  );
}
