/**
 * All copy for the landing page. Single source of truth — the section
 * components render straight from here, so content stays easy to edit.
 * Themed to ZIAN AI CONCEPTS / Andre Zimmermann; matches the design mockup.
 */

export type NavLink = { label: string; href: string };
export type Cta = { label: string; href: string };

export const headerContent = {
  brand: "ZIAN AI CONCEPTS",
  links: [
    { label: "Leistungen", href: "#leistungen" },
    { label: "Ansatz", href: "#ansatz" },
    { label: "Prozess", href: "#prozess" },
    { label: "Über mich", href: "#ansatz" },
    { label: "Kontakt", href: "#kontakt" },
  ] satisfies NavLink[],
  cta: { label: "Gespräch anfragen", href: "#kontakt" } satisfies Cta,
};

export const heroContent = {
  eyebrow: "Premium Konzepte. Klare Umsetzung.",
  headline: "KI-Konzepte, Software und Automatisierung —",
  headlineLines: ["KI-Konzepte,", "Software und", "Automatisierung —"],
  headlineAccent: "Präzise gebaut.",
  body: "Ich entwickle durchdachte Konzepte, individuelle Software und smarte Automatisierungslösungen, die Prozesse vereinfachen, Ergebnisse verbessern und skalieren.",
  ctaPrimary: { label: "Gespräch anfragen", href: "#kontakt" } satisfies Cta,
  ctaSecondary: { label: "Mehr erfahren", href: "#leistungen" } satisfies Cta,
  /** HUD annotations floating around the 3D signet. */
  hudLabels: ["Klar.", "Präzise.", "Effizient.", "Skalierbar."],
};

export type ServiceCard = {
  icon: "nodes" | "code" | "bot";
  title: string;
  body: string;
};

export const servicesContent = {
  id: "leistungen",
  index: "01",
  eyebrow: "Leistungen",
  cards: [
    {
      icon: "nodes",
      title: "KI-Konzepte",
      body: "Ich entwickle KI-Konzepte, die Mehrwert schaffen – strategisch, machbar und auf dein Ziel ausgerichtet.",
    },
    {
      icon: "code",
      title: "Individuelle Software",
      body: "Maßgeschneiderte Softwarelösungen, die sich deinem Business anpassen – nicht umgekehrt.",
    },
    {
      icon: "bot",
      title: "Kontrollierte Automatisierung",
      body: "Ich automatisiere repetitive Aufgaben zuverlässig – mit klaren Regeln, voller Kontrolle.",
    },
  ] satisfies ServiceCard[],
};

export type ApproachPoint = {
  index: string;
  title: string;
  body: string;
};

export const approachContent = {
  id: "ansatz",
  index: "02",
  eyebrow: "Ansatz",
  title: "Premium heißt durchdacht — nicht überladen.",
  body: "Ich setze auf Klarheit, strategisches Denken, saubere Umsetzung und ehrliche Ergebnisse. Kein Buzzword-Bingo. Keine Komplexität um der Komplexität willen.",
  link: { label: "Mehr erfahren", href: "#prozess" } satisfies Cta,
  points: [
    {
      index: "01",
      title: "Ziel zuerst",
      body: "Wir definieren gemeinsam das Ziel, bevor wir bauen.",
    },
    {
      index: "02",
      title: "Schlank gebaut",
      body: "Ich entwickle nur das, was wirklich nötig ist – effizient und stabil.",
    },
    {
      index: "03",
      title: "Transparent",
      body: "Du weißt jederzeit, was passiert – klar, ehrlich und verständlich.",
    },
  ] satisfies ApproachPoint[],
};

export type StatItem = {
  value: string;
  label: string;
  body: string;
};

export const statsContent = {
  id: "zahlen",
  index: "03",
  eyebrow: "Zahlen. Die zählen.",
  stats: [
    {
      value: "3×",
      label: "",
      body: "Projekte mit KI-Unternehmen erfolgreich umgesetzt in 12 Monaten",
    },
    {
      value: "100%",
      label: "",
      body: "Automatisierungslösungen oder Softwarelieferungen nach Ziel – ohne unnötige Extras",
    },
    {
      value: "24/7",
      label: "KI, Automatisierung & Systeme",
      body: "im Einsatz – keine Ausfälle, zuverlässig und stabil.",
    },
  ] satisfies StatItem[],
};

export type ProcessStep = {
  index: string;
  icon: "search" | "document" | "send";
  title: string;
  body: string;
};

export const processContent = {
  id: "prozess",
  index: "04",
  eyebrow: "Prozess",
  title: "So arbeite ich.",
  body: "Ein strukturierter Weg von der ersten Idee bis zum zuverlässigen System.",
  steps: [
    {
      index: "01",
      icon: "search",
      title: "Analyse",
      body: "Wir analysieren dein Problem und definieren das Ziel klar.",
    },
    {
      index: "02",
      icon: "document",
      title: "Konzept",
      body: "Ich entwickle ein passendes Konzept – effizient und realistisch.",
    },
    {
      index: "03",
      icon: "send",
      title: "Umsetzung",
      body: "Ich setze um – mit Fokus auf Qualität, Stabilität und Ergebnis.",
    },
  ] satisfies ProcessStep[],
};

export const contactContent = {
  id: "kontakt",
  index: "05",
  eyebrow: "Kontakt",
  title: "Lass uns dein Konzept bauen.",
  body: "Bereit für ein smarteres, effizienteres, zukunftssicheres System? Ich freue mich auf dich.",
  cta: { label: "Gespräch anfragen", href: "mailto:kontakt@zian-ai.de" } satisfies Cta,
};

export const footerContent = {
  mark: "Z",
  copyright: "© 2025 Andre Zimmermann",
  brand: "ZIAN AI CONCEPTS",
};
