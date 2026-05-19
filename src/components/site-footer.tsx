import { footerContent } from "@/lib/content/site-content";

/** Closing footer row — mark + copyright on the left, brand on the right. */
export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/[0.075] py-9">
      <div className="zian-container flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center border border-white/[0.13] text-sm font-bold text-[#d9b978]">
            {footerContent.mark}
          </span>
          <span className="text-[0.74rem] text-[#f3f4f1]/40">{footerContent.copyright}</span>
        </div>
        <span className="text-[0.72rem] font-bold uppercase tracking-[0.34em] text-[#f3f4f1]/42">
          {footerContent.brand}
        </span>
      </div>
    </footer>
  );
}
