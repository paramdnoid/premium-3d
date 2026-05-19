import { headerContent } from "@/lib/content/site-content";
import { Icon } from "./icons";

/** Sticky translucent top navigation. */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.075] bg-[#020303]/88 backdrop-blur-xl">
      <div className="zian-container flex h-[5.25rem] items-center justify-between gap-5">
        <a
          href="#top"
          className="min-w-0 text-[0.7rem] font-bold uppercase tracking-[0.34em] text-[#f3f4f1] sm:text-[0.75rem]"
        >
          {headerContent.brand}
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {headerContent.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[0.74rem] font-medium text-[#f3f4f1]/52 transition-colors duration-200 hover:text-[#f3f4f1]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={headerContent.cta.href}
          className="hidden min-h-11 shrink-0 items-center gap-2 border border-[#d9b978]/42 px-5 text-[0.72rem] font-bold text-[#d9b978] transition-colors duration-200 hover:border-[#d9b978]/78 hover:bg-[#d9b978]/10 sm:inline-flex"
        >
          {headerContent.cta.label}
          <Icon name="arrow-up-right" className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
