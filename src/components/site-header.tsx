import { headerContent } from "@/lib/content/site-content";
import { Icon } from "./icons";

/** Sticky translucent top navigation. */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#010202]/70 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-6">
        <a
          href="#top"
          className="min-w-0 text-xs font-semibold uppercase tracking-[0.24em] text-[#f8fbff] sm:text-sm sm:tracking-[0.32em]"
        >
          {headerContent.brand}
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {headerContent.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#f8fbff]/55 transition-colors duration-200 hover:text-[#f8fbff]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={headerContent.cta.href}
          className="hidden shrink-0 items-center gap-2 rounded-md border border-[#f4d7a1]/35 px-5 py-2.5 text-sm font-medium text-[#f4d7a1] transition-colors duration-200 hover:border-[#f4d7a1]/70 hover:bg-[#f4d7a1]/10 sm:inline-flex"
        >
          {headerContent.cta.label}
          <Icon name="arrow-up-right" className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
