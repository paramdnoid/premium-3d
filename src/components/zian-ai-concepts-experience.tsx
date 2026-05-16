"use client";

import { Line, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from "next/image";
import { Shape } from "three";
import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Layers3,
  LucideIcon,
  Radar,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type ChapterId = "hero" | "intake" | "cinema" | "proof" | "close";
type Locale = "de" | "en";

type NarrativeBeat = {
  eyebrow: string;
  title: string;
  body: string;
  stat: string;
  icon: LucideIcon;
};

type ProofCard = {
  label: string;
  value: string;
  body: string;
  icon: LucideIcon;
};

type HeroContent = {
  eyebrow: string;
  headline: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  stats: Array<{ label: string; value: string }>;
};

type ExperienceContent = {
  narrativeIntro: {
    eyebrow: string;
    title: string;
    body: string;
  };
  narrativeBeats: NarrativeBeat[];
  product: {
    eyebrow: string;
    title: string;
    body: string;
    steps: string[];
  };
  proof: {
    eyebrow: string;
    title: string;
    body: string;
    cards: ProofCard[];
  };
  closing: {
    eyebrow: string;
    title: string;
    contactRole: string;
    body: string;
    suitableLabel: string;
    suitableBody: string;
    outcomeLabel: string;
    outcomeBody: string;
    primaryAction: string;
    secondaryAction: string;
  };
};

const chapterLabelsByLocale: Record<Locale, Record<ChapterId, string>> = {
  de: {
    hero: "Start",
    intake: "Leistungen",
    cinema: "Use Cases",
    proof: "Über uns",
    close: "Kontakt",
  },
  en: {
    hero: "Home",
    intake: "Services",
    cinema: "Use Cases",
    proof: "About Us",
    close: "Contact",
  },
};

const heroContentByLocale: Record<Locale, HeroContent> = {
  de: {
    eyebrow: "KI-STRATEGIE · AUTOMATISIERUNG · DATA INTELLIGENCE",
    headline: "KI-Systeme, die Strategie in Umsetzung bringen",
    body: "ZIAN AI CONCEPTS konzipiert und baut kontrollierbare KI-Workflows für Unternehmen, die aus komplexen Prozessen messbare operative Entlastung gewinnen wollen.",
    primaryAction: "Erstgespräch buchen",
    secondaryAction: "Leistungen ansehen",
    stats: [
      { label: "Fokus", value: "Strategie" },
      { label: "Execution", value: "Automatisierung" },
      { label: "Foundation", value: "Data Intelligence" },
    ],
  },
  en: {
    eyebrow: "AI STRATEGY · AUTOMATION · DATA INTELLIGENCE",
    headline: "AI systems that turn strategy into execution",
    body: "ZIAN AI CONCEPTS designs and builds controlled AI workflows for companies that need measurable relief inside complex operational processes.",
    primaryAction: "Book first call",
    secondaryAction: "Explore services",
    stats: [
      { label: "Focus", value: "Strategy" },
      { label: "Execution", value: "Automation" },
      { label: "Foundation", value: "Data Intelligence" },
    ],
  },
};

const experienceContentByLocale: Record<Locale, ExperienceContent> = {
  de: {
    narrativeIntro: {
      eyebrow: "Methode",
      title: "KI braucht Führung.",
      body: "Die Seite zeigt bewusst keine Effekt-Sammlung, sondern eine Arbeitsweise: verstehen, entwerfen, bauen, absichern.",
    },
    narrativeBeats: [
      {
        eyebrow: "01 / Analyse",
        title: "Komplexität wird zuerst lesbar.",
        body: "ZIAN AI CONCEPTS trennt Wunsch, Risiko, Datenlage und echte Werthebel. Erst danach entsteht ein Konzept, das technisch und wirtschaftlich Sinn ergibt.",
        stat: "Use Case Audit statt KI-Theater",
        icon: Radar,
      },
      {
        eyebrow: "02 / Architektur",
        title: "KI wird in Systeme eingebettet.",
        body: "Die Lösung passt zu Prozessen, Schnittstellen, Berechtigungen und Datenflüssen. Kein isolierter Chatbot, sondern eine Erweiterung operativer Software.",
        stat: "APIs, Datenmodelle, Rollen, Workflows",
        icon: Layers3,
      },
      {
        eyebrow: "03 / Umsetzung",
        title: "Prototypen werden produktionsnah.",
        body: "Andre Zimmermann bringt 30 Jahre Entwicklungserfahrung direkt in die Implementierung: schnell genug für Momentum, stabil genug für reale Entscheidungen.",
        stat: "Hands-on durch den Firmenleiter",
        icon: Code2,
      },
      {
        eyebrow: "04 / Betrieb",
        title: "Automatisierung bleibt kontrollierbar.",
        body: "Monitoring, Fallbacks, Rechteprüfung und klare Verantwortlichkeiten sorgen dafür, dass KI nicht nur beeindruckt, sondern zuverlässig arbeitet.",
        stat: "Governance von Beginn an",
        icon: ShieldCheck,
      },
    ],
    product: {
      eyebrow: "ZIAN Concept Engine",
      title: "Von Idee zu System.",
      body: "Die visuelle Bühne steht für den Kern der Arbeit: abstrakte KI-Möglichkeiten werden in ein konkretes, kontrolliertes System überführt.",
      steps: [
        "KI-Potenzial und Datenrealität klären",
        "Architektur und Sicherheitsgrenzen setzen",
        "LLM-, Agenten- oder Automationsflow bauen",
        "In Betrieb, Monitoring und Wartung überführen",
      ],
    },
    proof: {
      eyebrow: "Andre Zimmermann",
      title: "Erfahrung ist hier kein Claim.",
      body: "ZIAN AI CONCEPTS ist bewusst persönlich positioniert. Beratung, Architektur und Umsetzung kommen aus einer technischen Führungshand.",
      cards: [
        {
          label: "Erfahrung",
          value: "30 Jahre",
          body: "Softwareentwicklung, Architektur, Integration und technische Führung aus einer Hand.",
          icon: UserRound,
        },
        {
          label: "Fokus",
          value: "AI Concepts",
          body: "KI-Strategie, LLM-Workflows, Agenten, Automatisierung und operative Software.",
          icon: BrainCircuit,
        },
        {
          label: "Arbeitsweise",
          value: "Owner-led",
          body: "Kein anonymes Delivery-Team. Andre Zimmermann leitet Konzept und Umsetzung selbst.",
          icon: Sparkles,
        },
      ],
    },
    closing: {
      eyebrow: "Nächster Schritt",
      title: "Sprechen Sie direkt mit Andre.",
      contactRole: "Andre Zimmermann / Founder & Lead Developer",
      body: "Wenn KI in Ihrem Unternehmen nicht als Showpiece, sondern als belastbare Software funktionieren soll, beginnt die Zusammenarbeit mit einem klaren technischen Gespräch.",
      suitableLabel: "Geeignet für",
      suitableBody: "KI-Strategie, interne Tools, Automatisierung, Datenworkflows, SaaS- und Enterprise-Software.",
      outcomeLabel: "Ergebnis",
      outcomeBody: "Ein belastbarer Plan, welche KI-Lösung sich lohnt und wie sie technisch sauber umgesetzt wird.",
      primaryAction: "Anfrage starten",
      secondaryAction: "Seite erneut ansehen",
    },
  },
  en: {
    narrativeIntro: {
      eyebrow: "Method",
      title: "AI needs leadership.",
      body: "The experience is not a gallery of effects. It shows the operating model: understand, design, build, control.",
    },
    narrativeBeats: [
      {
        eyebrow: "01 / Analysis",
        title: "Complexity becomes readable first.",
        body: "ZIAN AI CONCEPTS separates ambition, risk, data reality, and true leverage before a technical concept is approved.",
        stat: "Use case audit before AI theater",
        icon: Radar,
      },
      {
        eyebrow: "02 / Architecture",
        title: "AI is embedded into systems.",
        body: "The solution fits processes, APIs, permissions, and data flows. Not an isolated chatbot, but an extension of operational software.",
        stat: "APIs, data models, roles, workflows",
        icon: Layers3,
      },
      {
        eyebrow: "03 / Delivery",
        title: "Prototypes stay close to production.",
        body: "Andre Zimmermann brings 30 years of engineering experience directly into implementation: fast enough for momentum, stable enough for real decisions.",
        stat: "Owner-led implementation",
        icon: Code2,
      },
      {
        eyebrow: "04 / Operation",
        title: "Automation remains controllable.",
        body: "Monitoring, fallbacks, permission checks, and clear accountability make AI reliable after the first impressive demo.",
        stat: "Governance from day one",
        icon: ShieldCheck,
      },
    ],
    product: {
      eyebrow: "ZIAN Concept Engine",
      title: "From idea to system.",
      body: "The visual stage represents the core of the work: abstract AI potential is translated into a specific, controlled system.",
      steps: [
        "Clarify AI potential and data reality",
        "Set architecture and safety boundaries",
        "Build the LLM, agent, or automation flow",
        "Move into operations, monitoring, and care",
      ],
    },
    proof: {
      eyebrow: "Andre Zimmermann",
      title: "Experience is not a claim here.",
      body: "ZIAN AI CONCEPTS is deliberately personal. Consulting, architecture, and implementation come from one technical lead.",
      cards: [
        {
          label: "Experience",
          value: "30 years",
          body: "Software engineering, architecture, integration, and technical leadership from one hand.",
          icon: UserRound,
        },
        {
          label: "Focus",
          value: "AI Concepts",
          body: "AI strategy, LLM workflows, agents, automation, and operational software.",
          icon: BrainCircuit,
        },
        {
          label: "Operating model",
          value: "Owner-led",
          body: "No anonymous delivery team. Andre Zimmermann leads concept and implementation directly.",
          icon: Sparkles,
        },
      ],
    },
    closing: {
      eyebrow: "Next step",
      title: "Talk directly with Andre.",
      contactRole: "Andre Zimmermann / Founder & Lead Developer",
      body: "When AI should work as durable software instead of a showpiece, collaboration starts with a clear technical conversation.",
      suitableLabel: "Best fit",
      suitableBody: "AI strategy, internal tools, automation, data workflows, SaaS, and enterprise software.",
      outcomeLabel: "Outcome",
      outcomeBody: "A grounded plan for which AI solution is worth building and how to implement it cleanly.",
      primaryAction: "Start inquiry",
      secondaryAction: "Replay experience",
    },
  },
};

const sceneStops = [
  { threshold: 0, chapter: "hero" as ChapterId },
  { threshold: 0.2, chapter: "intake" as ChapterId },
  { threshold: 0.5, chapter: "cinema" as ChapterId },
  { threshold: 0.76, chapter: "proof" as ChapterId },
  { threshold: 0.9, chapter: "close" as ChapterId },
];

type SignetLayer = {
  color: string;
  depth: number;
  emissive?: string;
  emissiveIntensity?: number;
  metalness: number;
  opacity?: number;
  points: Array<[number, number]>;
  roughness: number;
  z: number;
};

const SIGNET_SCALE = 0.014;

const signetLayers: SignetLayer[] = [
  {
    color: "#050607",
    depth: 0.34,
    emissive: "#050607",
    emissiveIntensity: 0.1,
    metalness: 0.9,
    points: [
      [180, 35],
      [274, 89],
      [274, 230],
      [180, 327],
      [86, 230],
      [86, 89],
    ],
    roughness: 0.22,
    z: -0.18,
  },
  {
    color: "#111416",
    depth: 0.18,
    emissive: "#070808",
    emissiveIntensity: 0.08,
    metalness: 0.86,
    opacity: 0.86,
    points: [
      [180, 35],
      [86, 89],
      [86, 230],
      [180, 327],
      [180, 284],
      [115, 216],
      [115, 106],
      [180, 68],
    ],
    roughness: 0.24,
    z: 0.02,
  },
  {
    color: "#1b2022",
    depth: 0.18,
    emissive: "#0b0d0e",
    emissiveIntensity: 0.1,
    metalness: 0.88,
    opacity: 0.92,
    points: [
      [180, 35],
      [274, 89],
      [274, 230],
      [180, 327],
      [180, 284],
      [245, 216],
      [245, 106],
      [180, 68],
    ],
    roughness: 0.22,
    z: 0.04,
  },
  {
    color: "#090a0b",
    depth: 0.2,
    emissive: "#1a1410",
    emissiveIntensity: 0.18,
    metalness: 0.82,
    opacity: 0.84,
    points: [
      [180, 72],
      [238, 107],
      [238, 211],
      [180, 272],
      [122, 211],
      [122, 107],
    ],
    roughness: 0.18,
    z: 0.16,
  },
  {
    color: "#d7dee2",
    depth: 0.22,
    emissive: "#f4d7a1",
    emissiveIntensity: 0.08,
    metalness: 0.72,
    opacity: 0.9,
    points: [
      [114, 104],
      [246, 104],
      [246, 136],
      [174, 183],
      [246, 183],
      [246, 215],
      [114, 215],
      [114, 183],
      [186, 136],
      [114, 136],
    ],
    roughness: 0.14,
    z: 0.34,
  },
  {
    color: "#c9d3d8",
    depth: 0.08,
    emissive: "#f8fbff",
    emissiveIntensity: 0.12,
    metalness: 0.74,
    opacity: 0.5,
    points: [
      [186, 136],
      [246, 136],
      [174, 183],
      [114, 183],
    ],
    roughness: 0.2,
    z: 0.61,
  },
  {
    color: "#ffffff",
    depth: 0.05,
    emissive: "#ffffff",
    emissiveIntensity: 0.1,
    metalness: 0.2,
    opacity: 0.2,
    points: [
      [114, 104],
      [246, 104],
      [246, 136],
      [114, 136],
    ],
    roughness: 0.18,
    z: 0.64,
  },
];

const engravingLines = [
  [
    [130, 120],
    [230, 120],
  ],
  [
    [206, 142],
    [154, 177],
  ],
  [
    [130, 199],
    [230, 199],
  ],
  [
    [180, 65],
    [180, 104],
  ],
  [
    [180, 215],
    [180, 285],
  ],
] as const;

const rimLines = [
  [
    [180, 35],
    [274, 89],
    [274, 230],
    [180, 327],
    [86, 230],
    [86, 89],
    [180, 35],
  ],
  [
    [180, 65],
    [246, 104],
    [246, 215],
    [180, 285],
    [114, 215],
    [114, 104],
    [180, 65],
  ],
  [
    [110, 89],
    [180, 48],
    [250, 89],
  ],
  [
    [100, 229],
    [180, 310],
    [260, 229],
  ],
] as const;

export default function ZianAiConceptsExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressFrame = useRef<number | null>(null);
  const nextProgress = useRef(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState<ChapterId>("hero");
  const [language, setLanguage] = useState<Locale>("en");
  const reducedMotion = usePrefersReducedMotion();
  const chapterLabels = chapterLabelsByLocale[language];
  const heroContent = heroContentByLocale[language];
  const experienceContent = experienceContentByLocale[language];

  useEffect(() => {
    const root = rootRef.current;
    root?.classList.toggle("is-reduced-motion", reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (reducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.05,
      easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reducedMotion]);

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const commitProgress = () => {
        progressFrame.current = null;
        const rounded = Number(nextProgress.current.toFixed(4));
        root.style.setProperty("--scene-progress", String(rounded));
        root.dataset.scene = chapterFromProgress(rounded);

        setSceneProgress((current) =>
          Math.abs(current - rounded) > 0.0015 ? rounded : current,
        );
        setActiveChapter((current) => {
          const next = chapterFromProgress(rounded);
          return current === next ? current : next;
        });
      };

      const sceneTrigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          nextProgress.current = self.progress;

          if (progressFrame.current === null) {
            progressFrame.current = window.requestAnimationFrame(commitProgress);
          }
        },
      });

      if (reducedMotion) {
        gsap.set(root.querySelectorAll("[data-reveal], [data-beat], [data-product-step]"), {
          autoAlpha: 1,
          clearProps: "transform,filter",
        });

        return () => {
          sceneTrigger.kill();
          if (progressFrame.current !== null) {
            window.cancelAnimationFrame(progressFrame.current);
          }
        };
      }

      const revealItems = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-reveal]"),
      );

      revealItems.forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 42, filter: "blur(14px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              once: true,
            },
          },
        );
      });

      gsap.fromTo(
        root.querySelectorAll("[data-hero-reveal]"),
        { autoAlpha: 0, y: 36, filter: "blur(12px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.15,
          stagger: 0.11,
          ease: "expo.out",
          delay: 0.12,
        },
      );

      const media = gsap.matchMedia();

      media.add("(min-width: 768px)", () => {
        const storyChapter = root.querySelector<HTMLElement>("[data-story-chapter]");
        const storyLock = root.querySelector<HTMLElement>("[data-story-lock]");
        const beats = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll("[data-beat]"),
        );

        if (storyChapter && storyLock && beats.length) {
          gsap.set(beats, {
            autoAlpha: 0,
            y: 64,
            filter: "blur(16px)",
            scale: 0.985,
          });

          const storyTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: storyChapter,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              pin: storyLock,
              anticipatePin: 1,
            },
          });

          beats.forEach((beat, index) => {
            const position = index * 1.22;
            storyTimeline.to(
              beat,
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                scale: 1,
                duration: 0.5,
                ease: "power2.out",
              },
              position,
            );
            storyTimeline.to(
              beat,
              {
                autoAlpha: 0,
                y: -48,
                filter: "blur(12px)",
                scale: 0.985,
                duration: 0.42,
                ease: "power2.in",
              },
              position + 0.82,
            );
          });
        }

        const cinemaChapter = root.querySelector<HTMLElement>("[data-cinema-chapter]");
        const cinemaLock = root.querySelector<HTMLElement>("[data-cinema-lock]");
        const productSteps = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll("[data-product-step]"),
        );

        if (cinemaChapter && cinemaLock) {
          gsap.set(productSteps, {
            autoAlpha: 0.35,
            x: 28,
            filter: "blur(8px)",
          });

          const cinemaTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: cinemaChapter,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.9,
              pin: cinemaLock,
              anticipatePin: 1,
              onUpdate: (self) => {
                root.style.setProperty(
                  "--cinema-progress",
                  self.progress.toFixed(4),
                );
              },
            },
          });

          productSteps.forEach((step, index) => {
            cinemaTimeline.to(
              step,
              {
                autoAlpha: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.42,
                ease: "power2.out",
              },
              index * 0.45,
            );
          });

          cinemaTimeline.to(
            productSteps,
            {
              autoAlpha: 0.64,
              duration: 0.6,
              stagger: 0.08,
              ease: "power1.inOut",
            },
            "+=0.15",
          );
        }

        return () => {
          root.style.removeProperty("--cinema-progress");
        };
      });

      media.add("(max-width: 767px)", () => {
        gsap.set(root.querySelectorAll("[data-beat], [data-product-step]"), {
          autoAlpha: 1,
          clearProps: "transform,filter",
        });
      });

      ScrollTrigger.refresh();

      return () => {
        media.revert();
        sceneTrigger.kill();
        if (progressFrame.current !== null) {
          window.cancelAnimationFrame(progressFrame.current);
        }
      };
    },
    { dependencies: [reducedMotion], scope: rootRef },
  );


  return (
    <div
      ref={rootRef}
      className="premium-experience relative min-h-screen overflow-x-clip bg-[#030405] text-[#f8fbff]"
      data-scene="hero"
    >
      <VisualStage progress={sceneProgress} reducedMotion={reducedMotion} />
      <SiteChrome
        activeChapter={activeChapter}
        labels={chapterLabels}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="relative z-10">
        <HeroChapter content={heroContent} />
        <NarrativeLayer content={experienceContent} />
        <VisualProductMoment content={experienceContent.product} />
        <ProofChapter content={experienceContent.proof} />
        <ClosingChapter content={experienceContent.closing} />
      </main>
    </div>
  );
}

function SiteChrome({
  activeChapter,
  labels,
  language,
  onLanguageChange,
}: {
  activeChapter: ChapterId;
  labels: Record<ChapterId, string>;
  language: Locale;
  onLanguageChange: (language: Locale) => void;
}) {
  return (
    <header className="site-header fixed left-0 right-0 top-0 z-30 border-b border-white/10 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 md:h-[74px] md:px-8">
        <a
          href="#hero"
          className="group flex items-center gap-3"
          aria-label="ZIAN AI CONCEPTS home"
        >
          <span className="brand-mark grid size-10 place-items-center overflow-hidden">
            <Image
              src="/zian-monolith-signet.svg"
              alt=""
              width={32}
              height={32}
              className="size-8 object-contain"
              unoptimized
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="chrome-text font-display text-[0.82rem] uppercase tracking-normal">
              ZIAN
            </span>
            <span className="mt-1 text-[0.6rem] uppercase tracking-normal text-[#c9d3d8]/72">
              AI Concepts
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Scroll chapters"
        >
          {Object.entries(labels).map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeChapter === id ? "page" : undefined}
              className="relative px-1 py-2 text-[0.67rem] uppercase tracking-normal text-[#d7dee2]/68 transition hover:text-white data-[current=true]:text-white"
              data-current={activeChapter === id}
            >
              {label}
              <span className="absolute inset-x-1 bottom-1 h-px origin-left scale-x-0 bg-[#f4d7a1] transition-transform data-[active=true]:scale-x-100" data-active={activeChapter === id} />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center rounded-full border border-white/15 bg-black/55 p-1 shadow-[0_10px_28px_rgba(0,0,0,0.34)]"
            role="group"
            aria-label="Choose language"
          >
            {(["de", "en"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onLanguageChange(option)}
                className="relative inline-flex h-8 min-w-10 items-center justify-center rounded-full px-3 text-[0.64rem] font-semibold uppercase tracking-normal transition"
                data-active={language === option}
              >
                <span
                  className="transition data-[active=true]:text-white data-[active=false]:text-white/56"
                  data-active={language === option}
                >
                  {option}
                </span>
                <span
                  className="absolute inset-0 rounded-full border border-white/0 bg-white/0 transition data-[active=true]:border-white/20 data-[active=true]:bg-white/14"
                  data-active={language === option}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroChapter({ content }: { content: HeroContent }) {
  return (
    <ScrollChapter
      id="hero"
      className="relative flex min-h-[122svh] items-start pt-28 md:items-center md:pt-20"
    >
      <div className="mirror-aperture" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-24 md:grid-cols-[0.98fr_1.02fr] md:px-8">
        <div className="max-w-[780px] pt-[9vh] md:pt-0">
          <p
            data-hero-reveal
            className="chrome-panel mb-6 inline-flex max-w-full items-center gap-3 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-normal text-[#f4d7a1]/90"
          >
            <span className="h-px w-8 bg-[#d7dee2]" />
            {content.eyebrow}
          </p>
          <h1
            data-hero-reveal
            className="w-fit max-w-[11.5ch] text-balance text-[clamp(2.62rem,5.4vw,5.5rem)] font-semibold leading-[0.98] tracking-normal text-white"
          >
            {content.headline}
          </h1>
          <p
            data-hero-reveal
            className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-[#d7dee2]/82 md:text-[1.58rem] md:leading-[1.45]"
          >
            {content.body}
          </p>
          <div
            data-hero-reveal
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#close"
              className="gloss-button inline-flex h-12 items-center justify-center gap-2 border px-5 text-sm font-semibold uppercase tracking-normal transition"
            >
              {content.primaryAction}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#intake"
              className="inline-flex h-12 items-center justify-center px-5 text-sm font-semibold uppercase tracking-normal text-[#d7dee2]/86 transition hover:text-white"
            >
              {content.secondaryAction}
            </a>
          </div>
          <div
            data-hero-reveal
            className="mt-11 grid max-w-[760px] grid-cols-1 gap-3 sm:grid-cols-3"
            aria-label="Core capabilities"
          >
            {content.stats.map((stat, index) => (
              <div
                key={stat.label}
                className="mirror-surface min-h-24 px-4 py-3"
              >
                <p className="text-[0.55rem] font-semibold uppercase tracking-normal text-[#d7dee2]/44">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-[1.01rem] font-semibold uppercase tracking-normal text-[#d7dee2]/76">
                  {stat.label}
                </p>
                <p className="mt-1 text-[1.34rem] font-semibold uppercase tracking-normal text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block" />
      </div>
    </ScrollChapter>
  );
}

function NarrativeLayer({ content }: { content: ExperienceContent }) {
  return (
    <ScrollChapter
      id="intake"
      className="story-chapter relative h-[360vh] min-h-[1800px]"
      data-story-chapter
    >
      <div
        data-story-lock
        className="story-lock relative mx-auto grid min-h-screen w-full max-w-7xl items-center px-5 py-24 md:grid-cols-[0.86fr_1.14fr] md:px-8"
      >
        <div data-reveal className="max-w-md">
          <p className="text-[0.7rem] uppercase tracking-normal text-[#f4d7a1]/82">
            {content.narrativeIntro.eyebrow}
          </p>
          <h2 className="chrome-text font-display mt-5 text-5xl font-semibold leading-none md:text-7xl">
            {content.narrativeIntro.title}
          </h2>
          <p className="mt-6 text-base leading-8 text-[#d7dee2]/62 md:text-lg">
            {content.narrativeIntro.body}
          </p>
        </div>

        <div className="narrative-beats relative mt-12 min-h-[560px] md:mt-0">
          {content.narrativeBeats.map((beat) => (
            <NarrativeBeatCard key={beat.title} beat={beat} />
          ))}
        </div>
      </div>
    </ScrollChapter>
  );
}

function NarrativeBeatCard({ beat }: { beat: NarrativeBeat }) {
  const Icon = beat.icon;

  return (
    <article
      data-beat
      className="narrative-beat mirror-surface absolute inset-0 flex flex-col justify-center px-6 md:px-10"
    >
      <div className="chrome-panel mb-7 grid size-14 place-items-center overflow-hidden">
        <Icon className="size-6 text-[#f4d7a1]" aria-hidden="true" />
      </div>
      <p className="text-[0.7rem] uppercase tracking-normal text-[#d7dee2]">
        {beat.eyebrow}
      </p>
      <h3 className="font-display mt-4 max-w-[13ch] text-5xl font-semibold leading-[0.95] tracking-normal text-white md:text-7xl">
        {beat.title}
      </h3>
      <p className="mt-6 max-w-xl text-lg leading-8 text-[#d7dee2]/68">
        {beat.body}
      </p>
      <p className="mirror-rail mt-8 inline-flex w-fit px-4 py-3 text-xs uppercase tracking-normal text-white/72">
        {beat.stat}
      </p>
    </article>
  );
}

function VisualProductMoment({
  content,
}: {
  content: ExperienceContent["product"];
}) {
  return (
    <ScrollChapter
      id="cinema"
      className="cinema-chapter relative h-[280vh] min-h-[1500px]"
      data-cinema-chapter
    >
      <div
        data-cinema-lock
        className="cinema-lock mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-5 py-24 md:grid-cols-[1fr_0.86fr] md:px-8"
      >
        <div data-reveal>
          <p className="text-[0.7rem] uppercase tracking-normal text-[#f4d7a1]/82">
            {content.eyebrow}
          </p>
          <h2 className="chrome-text font-display mt-5 max-w-[11ch] text-6xl font-semibold leading-[0.9] tracking-normal md:text-8xl">
            {content.title}
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#d7dee2]/66">
            {content.body}
          </p>
        </div>

        <div className="grid gap-3">
          {content.steps.map((step, index) => (
            <div
              key={step}
              data-product-step
              className="mirror-rail flex min-h-20 items-center justify-between gap-5 p-4"
            >
              <span className="text-sm uppercase tracking-normal text-[#9ee8ff]/80">
                0{index + 1}
              </span>
              <span className="text-right text-lg text-white">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </ScrollChapter>
  );
}

function ProofChapter({ content }: { content: ExperienceContent["proof"] }) {
  return (
    <ScrollChapter
      id="proof"
      className="black-proof-section relative min-h-screen border-y border-white/10 py-24 text-[#f8fbff] md:py-32"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 md:grid-cols-[0.72fr_1.28fr] md:px-8">
        <div data-reveal>
          <p className="text-[0.7rem] uppercase tracking-normal text-[#f4d7a1]/78">
            {content.eyebrow}
          </p>
          <h2 className="font-display mt-5 text-5xl font-semibold leading-[0.95] tracking-normal md:text-7xl">
            {content.title}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-[#d7dee2]/68">
            {content.body}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {content.cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.label}
                data-reveal
                className="black-proof-card min-h-[320px] border border-white/12 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[0.68rem] uppercase tracking-normal text-[#d7dee2]/60">
                    {card.label}
                  </p>
                  <Icon className="size-5 text-[#f4d7a1]/72" aria-hidden="true" />
                </div>
                <p className="font-display mt-14 text-5xl font-semibold">
                  {card.value}
                </p>
                <p className="mt-6 text-base leading-7 text-[#d7dee2]/64">
                  {card.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </ScrollChapter>
  );
}

function ClosingChapter({
  content,
}: {
  content: ExperienceContent["closing"];
}) {
  return (
    <ScrollChapter
      id="close"
      className="relative flex min-h-screen items-center py-24 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 md:grid-cols-[1.02fr_0.98fr] md:px-8">
        <div data-reveal>
          <p className="text-[0.7rem] uppercase tracking-normal text-[#f4d7a1]/82">
            {content.eyebrow}
          </p>
          <h2 className="chrome-text font-display mt-5 max-w-[11ch] text-6xl font-semibold leading-[0.88] tracking-normal md:text-8xl">
            {content.title}
          </h2>
        </div>
        <div
          id="contact"
          data-reveal
          className="backdrop-chrome self-end p-5 md:p-8"
        >
          <div className="mirror-rail mb-7 inline-flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-normal text-white/72">
            <UserRound className="size-4 text-[#d7dee2]" aria-hidden="true" />
            {content.contactRole}
          </div>
          <p className="text-xl leading-9 text-[#d7dee2]/76">
            {content.body}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="mirror-surface p-4">
              <p className="text-[0.65rem] uppercase tracking-normal text-[#f4d7a1]/82">
                {content.suitableLabel}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#d7dee2]/66">
                {content.suitableBody}
              </p>
            </div>
            <div className="mirror-surface p-4">
              <p className="text-[0.65rem] uppercase tracking-normal text-[#9ee8ff]">
                {content.outcomeLabel}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#d7dee2]/66">
                {content.outcomeBody}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:andre@zian.ai?subject=Project%20inquiry%20ZIAN%20AI%20CONCEPTS"
              className="gloss-button inline-flex h-12 items-center justify-center gap-2 border px-5 text-sm font-semibold uppercase tracking-normal transition"
            >
              {content.primaryAction}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#hero"
              className="mirror-surface inline-flex h-12 items-center justify-center px-5 text-sm font-semibold uppercase tracking-normal text-white transition hover:border-white"
            >
              {content.secondaryAction}
            </a>
          </div>
        </div>
      </div>
    </ScrollChapter>
  );
}

function ScrollChapter({
  id,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  id: ChapterId;
}) {
  return (
    <section
      id={id}
      data-chapter={id}
      className={className}
      {...props}
    >
      {children}
    </section>
  );
}

function VisualStage({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_36%,rgba(244,215,161,0.10),transparent_28%),linear-gradient(115deg,rgba(248,251,255,0.12),transparent_29%),linear-gradient(180deg,#030405_0%,#090a0b_48%,#020303_100%)]" />
      <div className="absolute inset-0 stage-silk opacity-[0.3]" />
      <div className="absolute left-[7vw] top-[18vh] hidden h-[52vh] w-px bg-gradient-to-b from-transparent via-white/22 to-transparent md:block" />
      <div className="absolute bottom-[19vh] left-[8vw] hidden h-px w-[38vw] bg-gradient-to-r from-white/18 via-[#f4d7a1]/18 to-transparent md:block" />
      <div className="stage-shell absolute bottom-[10vh] right-[-24vw] h-[72vh] w-[60vw] min-w-[680px] md:bottom-[6vh] md:right-[-22vw]">
        <Canvas
          camera={{ fov: 36, position: [0, 0.08, 6.2] }}
          dpr={[1, 1.5]}
          frameloop="demand"
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#040607"]} />
          <ambientLight intensity={1.12} />
          <directionalLight color="#ffffff" intensity={2.4} position={[2.2, 4.2, 4]} />
          <pointLight color="#f4d7a1" intensity={8} distance={8} position={[-2.8, 1.4, 2.8]} />
          <pointLight color="#f8fbff" intensity={12} distance={7} position={[2.2, -1.8, 3]} />
          <ZianMonolith3D progress={progress} reducedMotion={reducedMotion} />
          <Preload all />
        </Canvas>
      </div>
      <div className="stage-left-vignette absolute inset-y-0 left-0 w-[76vw] md:w-[58vw]" />
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#040607] to-transparent" />
    </div>
  );
}

function ZianMonolith3D({
  progress,
  reducedMotion,
}: {
  progress: number;
  reducedMotion: boolean;
}) {
  const model = useMemo(() => sceneModel(progress, reducedMotion), [progress, reducedMotion]);

  return (
    <group
      position={model.position}
      rotation={model.rotation}
      scale={model.scale}
    >
      <mesh position={[0, -2.06, -0.28]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.18, 0.16, 1]}>
        <circleGeometry args={[1.35, 80]} />
        <meshBasicMaterial color="#f4d7a1" transparent opacity={0.025 + model.focus * 0.04} />
      </mesh>

      <group rotation={[0.08, -0.08, 0]}>
        {signetLayers.map((layer, index) => (
          <ExtrudedSignetLayer
            key={`${layer.color}-${index}`}
            layer={layer}
            focus={model.focus}
            pulse={model.pulse}
          />
        ))}

        <SignetLinework focus={model.focus} />
      </group>

      <group rotation={[Math.PI / 2, 0, 0]} scale={1 + model.focus * 0.18}>
        {[1.72, 2.12, 2.54].map((radius, index) => (
          <mesh key={radius} rotation={[0, 0, model.ring + index * 0.42]}>
            <torusGeometry args={[radius, 0.006 + index * 0.002, 12, 160]} />
            <meshBasicMaterial
              color={index === 1 ? "#d7dee2" : "#f4d7a1"}
              transparent
              opacity={0.18 + model.focus * 0.3 - index * 0.04}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function ExtrudedSignetLayer({
  layer,
  focus,
  pulse,
}: {
  layer: SignetLayer;
  focus: number;
  pulse: number;
}) {
  const shape = useMemo(() => createSignetShape(layer.points), [layer.points]);

  return (
    <mesh position={[0, 0, layer.z]}>
      <extrudeGeometry
        args={[
          shape,
          {
            bevelEnabled: true,
            bevelSegments: 3,
            bevelSize: 0.018,
            bevelThickness: 0.018,
            curveSegments: 2,
            depth: layer.depth,
          },
        ]}
      />
      <meshStandardMaterial
        color={layer.color}
        emissive={layer.emissive ?? "#000000"}
        emissiveIntensity={(layer.emissiveIntensity ?? 0) + pulse * 0.22}
        metalness={layer.metalness}
        opacity={layer.opacity ?? 1}
        roughness={Math.max(0.1, layer.roughness - focus * 0.08)}
        transparent={layer.opacity !== undefined}
      />
    </mesh>
  );
}

function SignetLinework({ focus }: { focus: number }) {
  return (
    <group position={[0, 0, 0.74]}>
      {engravingLines.map((line, index) => (
        <Line
          key={`engraving-${index}`}
          points={line.map(pointToVector)}
          color="#f8fbff"
          lineWidth={1}
          transparent
          opacity={0.16 + focus * 0.22}
        />
      ))}
      {rimLines.map((line, index) => (
        <Line
          key={`rim-${index}`}
          points={line.map(pointToVector)}
          color={index === 1 ? "#d7dee2" : "#f4d7a1"}
          lineWidth={index < 2 ? 1.8 : 1}
          transparent
          opacity={index < 2 ? 0.38 + focus * 0.28 : 0.18 + focus * 0.16}
        />
      ))}
    </group>
  );
}

function createSignetShape(points: Array<[number, number]>) {
  const shape = new Shape();
  const [first, ...rest] = points;
  const [firstX, firstY] = pointToXY(first);

  shape.moveTo(firstX, firstY);

  rest.forEach((point) => {
    const [x, y] = pointToXY(point);
    shape.lineTo(x, y);
  });

  shape.closePath();
  return shape;
}

function pointToVector(point: readonly [number, number]) {
  const [x, y] = pointToXY(point);
  return [x, y, 0] as [number, number, number];
}

function pointToXY(point: readonly [number, number]) {
  return [
    (point[0] - 180) * SIGNET_SCALE,
    (180 - point[1]) * SIGNET_SCALE,
  ] as [number, number];
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  return reducedMotion;
}

function chapterFromProgress(progress: number): ChapterId {
  return sceneStops.reduce<ChapterId>((current, stop) => {
    return progress >= stop.threshold ? stop.chapter : current;
  }, "hero");
}

function sceneModel(progress: number, reducedMotion: boolean) {
  const focus = clamp((progress - 0.42) / 0.26, 0, 1);
  const settle = clamp((progress - 0.77) / 0.16, 0, 1);
  const motion = reducedMotion ? 0 : 1;

  return {
    focus,
    pulse: focus * 0.42,
    ring: progress * Math.PI * 2 * motion,
    position: [
      -0.55 + focus * 0.62 - settle * 0.22,
      -0.03 + focus * 0.14,
      -0.12 + focus * 0.24,
    ] as [number, number, number],
    rotation: [
      0.18 - focus * 0.34,
      -0.62 + progress * 1.45 * motion,
      0.08 - settle * 0.08,
    ] as [number, number, number],
    scale: 1.03 + focus * 0.18 - settle * 0.08,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
