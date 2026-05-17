"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import ZianLogo3D from "./zian-logo-3d";

const navItems = [
  { href: "#services", label: "Services" },
  { href: "#leistungen", label: "Leistungen" },
  { href: "#vorgehen", label: "Vorgehen" },
  { href: "#referenzen", label: "Referenzen" },
  { href: "#kontakt", label: "Kontakt" },
];

const sectionIds = navItems.map((item) => item.href.slice(1));

type AmbientStyle = CSSProperties & {
  "--ambient-core-x": string;
  "--ambient-core-y": string;
  "--ambient-rotate": string;
  "--ambient-scale-x": string;
  "--ambient-scale-y": string;
  "--ambient-skew": string;
  "--ambient-warp-opacity": string;
  "--ambient-warp-rotate": string;
  "--ambient-x": string;
  "--ambient-y": string;
};

const initialAmbientStyle: AmbientStyle = {
  "--ambient-core-x": "42%",
  "--ambient-core-y": "38%",
  "--ambient-rotate": "-8deg",
  "--ambient-scale-x": "1.08",
  "--ambient-scale-y": "1.16",
  "--ambient-skew": "0deg",
  "--ambient-warp-opacity": "0.44",
  "--ambient-warp-rotate": "0deg",
  "--ambient-x": "0vw",
  "--ambient-y": "0vh",
};

export default function ZianAiConceptsExperience() {
  const footerRevealRef = useRef<HTMLDivElement>(null);
  const progressFrame = useRef<number | null>(null);
  const sectionScrollLock = useRef(false);
  const sectionScrollTimer = useRef<number | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [ambientStyle, setAmbientStyle] = useState<AmbientStyle>(initialAmbientStyle);
  const [footerTransform, setFooterTransform] = useState("translateY(100%)");

  const scrollToSection = useCallback((id: string, updateHash = true) => {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });

    if (updateHash) {
      window.history.pushState(null, "", `#${id}`);
    }
  }, []);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const viewportBottom = scrollY + window.innerHeight;
      const revealElement = footerRevealRef.current;
      const contactElement = document.getElementById("kontakt");
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
      const wave = Math.sin(scrollProgress * Math.PI * 2.1);
      const bend = Math.cos(scrollProgress * Math.PI * 1.35);
      const footerHeight = Math.max(window.innerHeight * 0.34, 224);
      const contactPeekHeight = 24;

      setIsAtTop(scrollY <= 0);
      setAmbientStyle({
        "--ambient-core-x": `${(40 + scrollProgress * 26).toFixed(2)}%`,
        "--ambient-core-y": `${(34 + Math.sin(scrollProgress * Math.PI) * 22).toFixed(2)}%`,
        "--ambient-rotate": `${(-9 + scrollProgress * 24).toFixed(2)}deg`,
        "--ambient-scale-x": `${(1.08 + scrollProgress * 0.22).toFixed(3)}`,
        "--ambient-scale-y": `${(1.18 - scrollProgress * 0.11).toFixed(3)}`,
        "--ambient-skew": `${(wave * 7).toFixed(2)}deg`,
        "--ambient-warp-opacity": `${(0.36 + scrollProgress * 0.28).toFixed(3)}`,
        "--ambient-warp-rotate": `${(scrollProgress * 42 + bend * 8).toFixed(2)}deg`,
        "--ambient-x": `${((scrollProgress - 0.5) * 16).toFixed(2)}vw`,
        "--ambient-y": `${(wave * 7).toFixed(2)}vh`,
      });

      if (!revealElement) {
        setFooterTransform("translateY(100%)");
        return;
      }

      const revealStart = revealElement.offsetTop;
      const revealDistance = revealElement.offsetHeight;
      const contactStart = contactElement?.offsetTop ?? revealStart;
      const contactScrollMargin = contactElement
        ? Number.parseFloat(getComputedStyle(contactElement).scrollMarginTop) || 0
        : 0;
      const contactAnchorStart = contactStart - contactScrollMargin - 4;
      const isInContactSection = scrollY >= contactAnchorStart;

      if (viewportBottom < revealStart) {
        setFooterTransform(
          isInContactSection
            ? `translateY(${footerHeight - contactPeekHeight}px)`
            : "translateY(100%)",
        );
        return;
      }

      const progress = Math.min(
        1,
        Math.max(0, (viewportBottom - revealStart) / revealDistance),
      );
      const offset = (1 - progress) * (footerHeight - contactPeekHeight);

      setFooterTransform(`translateY(${offset}px)`);
    };

    const requestUpdate = () => {
      if (progressFrame.current !== null) {
        return;
      }

      progressFrame.current = window.requestAnimationFrame(() => {
        progressFrame.current = null;
        updateScrollState();
      });
    };

    updateScrollState();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (progressFrame.current !== null) {
        window.cancelAnimationFrame(progressFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    const releaseSectionLock = () => {
      sectionScrollLock.current = false;

      if (sectionScrollTimer.current !== null) {
        window.clearTimeout(sectionScrollTimer.current);
        sectionScrollTimer.current = null;
      }
    };

    const onWheel = (event: WheelEvent) => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion || window.innerWidth < 768 || Math.abs(event.deltaY) < 18) {
        return;
      }

      const revealElement = footerRevealRef.current;
      const contactElement = document.getElementById("kontakt");
      const contactScrollMargin = contactElement
        ? Number.parseFloat(getComputedStyle(contactElement).scrollMarginTop) || 0
        : 0;
      const contactAnchorStart =
        (contactElement?.offsetTop ?? Number.POSITIVE_INFINITY) - contactScrollMargin - 4;
      const isFooterRevealRange =
        revealElement !== null &&
        window.scrollY + window.innerHeight >= revealElement.offsetTop;

      if ((window.scrollY >= contactAnchorStart && event.deltaY > 0) || isFooterRevealRange) {
        releaseSectionLock();
        return;
      }

      const sectionTops = sectionIds
        .map((id) => {
          const element = document.getElementById(id);
          const scrollMargin = element
            ? Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0
            : 0;

          return element ? element.offsetTop - scrollMargin : null;
        })
        .filter((top): top is number => top !== null);

      if (sectionTops.length === 0) {
        return;
      }

      const currentIndex = sectionTops.reduce((nearestIndex, top, index) => {
        const nearestDistance = Math.abs(window.scrollY - sectionTops[nearestIndex]);
        const distance = Math.abs(window.scrollY - top);

        return distance < nearestDistance ? index : nearestIndex;
      }, 0);
      const targetIndex =
        event.deltaY > 0
          ? Math.min(currentIndex + 1, sectionIds.length - 1)
          : Math.max(currentIndex - 1, 0);

      if (targetIndex === currentIndex) {
        return;
      }

      event.preventDefault();

      if (sectionScrollLock.current) {
        return;
      }

      sectionScrollLock.current = true;
      scrollToSection(sectionIds[targetIndex], true);

      sectionScrollTimer.current = window.setTimeout(() => {
        sectionScrollLock.current = false;
        sectionScrollTimer.current = null;
      }, 850);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);

      if (sectionScrollTimer.current !== null) {
        window.clearTimeout(sectionScrollTimer.current);
      }
    };
  }, [scrollToSection]);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <main className="premium-experience relative min-h-screen overflow-x-hidden bg-[#010202] text-[#f8fbff]">
      <header
        className={[
          "site-glass-header fixed left-0 right-0 top-0 z-40 transition duration-500",
          isAtTop ? "site-glass-header--top" : "site-glass-header--scrolled",
        ].join(" ")}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-center px-5 md:h-[74px] md:px-8">
          <nav
            className="flex max-w-full items-center gap-4 overflow-x-auto text-[0.66rem] font-semibold uppercase tracking-normal text-[#d7dee2]/76 md:gap-8"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href.slice(1))}
                className="shrink-0 px-1 py-2 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div
        className="ambient-field pointer-events-none fixed inset-0 z-0"
        style={ambientStyle}
        aria-hidden="true"
      >
        <div className="ambient-field__depth" />
        <div className="ambient-field__warp" />
        <div className="ambient-field__grain" />
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-20 grid place-items-center px-6"
        aria-hidden="true"
      >
        <ZianLogo3D />
      </div>

      <div className="relative z-10">
        <ScrollSection id="services" label="Services" />
        <ScrollSection id="leistungen" label="Leistungen" />
        <ScrollSection id="vorgehen" label="Vorgehen" />
        <ScrollSection id="referenzen" label="Referenzen" />
        <ScrollSection id="kontakt" label="Kontakt" />
        <div
          ref={footerRevealRef}
          data-footer-reveal
          className="h-[34svh] min-h-56 w-screen"
          aria-hidden="true"
        />
      </div>

      <footer
        className="site-glass-footer fixed inset-x-0 bottom-0 z-30 h-[34svh] min-h-56 transition-transform duration-700 ease-out"
        style={{
          transform: footerTransform,
        }}
        aria-label="Sticky footer"
      >
        <div className="mx-auto flex h-6 max-w-7xl items-center justify-center px-5">
          <span className="site-glass-footer__handle" />
        </div>
        <div className="site-glass-footer__body mx-auto h-[calc(100%-1.5rem)] max-w-7xl px-5" />
      </footer>
    </main>
  );
}

function ScrollSection({ id, label }: { id: string; label: string }) {
  return (
    <section
      id={id}
      className="scroll-section min-h-[100svh] w-screen scroll-mt-20"
      aria-label={label}
    />
  );
}
