import { footerContent } from "@/lib/content/site-content";

/** Closing footer row — mark + copyright on the left, brand on the right. */
export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.12] text-sm font-semibold text-[#f4d7a1]">
            {footerContent.mark}
          </span>
          <span className="text-xs text-[#f8fbff]/40">{footerContent.copyright}</span>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-[#f8fbff]/40">
          {footerContent.brand}
        </span>
      </div>
    </footer>
  );
}
