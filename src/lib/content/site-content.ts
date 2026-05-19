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
  headlineAccent: "Präzise gebaut.",
  body: "Ich entwickle durchdachte Konzepte, individuelle Software und automatisierte Abläufe – maßgeschneidert, transparent und auf messbare Ergebnisse ausgerichtet.",
  ctaPrimary: { label: "Gespräch anfragen", href: "#kontakt" } satisfies Cta,
  ctaSecondary: { label: "Mehr erfahren", href: "#leistungen" } satisfies Cta,
  /** HUD annotations floating around the 3D signet. */
  hudLabels: ["Strategie", "Code", "Automation", "Ergebnis"],
};

export type ServiceCard = {
  icon: "scan" | "code" | "grid";
  title: string;
  body: string;
};

export const servicesContent = {
  id: "leistungen",
  index: "01",
  eyebrow: "Leistungen",
  cards: [
    {
      icon: "scan",
      title: "KI-Konzepte",
      body: "Klare Strategien, die künstliche Intelligenz sinnvoll, sicher und nachvollziehbar in deinen Alltag bringen.",
    },
    {
      icon: "code",
      title: "Individuelle Software",
      body: "Maßgeschneiderte Anwendungen – gebaut exakt um deinen Prozess herum, nicht um eine Vorlage.",
    },
    {
      icon: "grid",
      title: "Kontrollierte Automatisierung",
      body: "Wiederkehrende Abläufe laufen von selbst – transparent, prüfbar und jederzeit unter deiner Kontrolle.",
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
  body: "Jedes Projekt beginnt mit deinem Ziel, nicht mit der Technologie. Ich entwickle Lösungen, die schlank bleiben, sich selbst erklären und mit dir mitwachsen.",
  link: { label: "Mein Ansatz", href: "#prozess" } satisfies Cta,
  points: [
    {
      index: "01",
      title: "Ziel zuerst",
      body: "Wir starten mit dem Ergebnis, das du wirklich brauchst.",
    },
    {
      index: "02",
      title: "Schlank gebaut",
      body: "Keine Funktionen ohne Zweck – kein technischer Ballast.",
    },
    {
      index: "03",
      title: "Transparent",
      body: "Du verstehst jederzeit, was passiert und warum.",
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
      label: "Schnellere Umsetzung",
      body: "durch klare Prozesse und Fokus.",
    },
    {
      value: "100%",
      label: "Maßgeschneidert",
      body: "keine Standardlösungen. Nur das, was du brauchst.",
    },
    {
      value: "24/7",
      label: "Automatisiert im Hintergrund",
      body: "zuverlässig, skalierbar und immer für dich da.",
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
  body: "Ein strukturierter Weg von der ersten Idee bis zur nachhaltigen Lösung.",
  steps: [
    {
      index: "01",
      icon: "search",
      title: "Analyse",
      body: "Wir klären Ziel, Kontext und Rahmen – und öffnen die richtigen Fragen.",
    },
    {
      index: "02",
      icon: "document",
      title: "Konzept",
      body: "Ich entwickle die Lösung und den Weg dorthin, inklusive realistischem Aufwand.",
    },
    {
      index: "03",
      icon: "send",
      title: "Umsetzung",
      body: "Gebaut, getestet und sauber übergeben – bereit für den Einsatz.",
    },
  ] satisfies ProcessStep[],
};

export const contactContent = {
  id: "kontakt",
  index: "05",
  eyebrow: "Kontakt",
  title: "Lass uns dein Konzept bauen.",
  body: "Erzähl mir kurz von deinem Vorhaben – du bekommst von mir einen ersten, ehrlichen Gedanken dazu zurück.",
  cta: { label: "Gespräch anfragen", href: "mailto:kontakt@zian-ai.de" } satisfies Cta,
};

export const footerContent = {
  mark: "Z",
  copyright: `© ${new Date().getFullYear()} Andre Zimmermann`,
  brand: "ZIAN AI CONCEPTS",
};
