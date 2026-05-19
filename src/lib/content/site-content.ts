/**
 * All copy for the landing page. Single source of truth — the section
 * components render straight from here, so content stays easy to edit.
 * Demo content, themed to ZIAN AI CONCEPTS / Andre Zimmermann.
 */

export const heroContent = {
  eyebrow: "Andre Zimmermann",
  title: "ZIAN AI CONCEPTS",
  tagline:
    "Premium-KI-Konzepte, individuelle Software und kontrollierte Automatisierung.",
  scrollHint: "Scrollen",
};

export type ServiceCard = {
  title: string;
  body: string;
};

export const servicesContent = {
  id: "leistungen",
  index: "01",
  eyebrow: "Leistungen",
  title: "Was aus deiner Idee entsteht",
  cards: [
    {
      title: "KI-Konzepte",
      body: "Klare Strategien, die künstliche Intelligenz sinnvoll, sicher und nachvollziehbar in deinen Alltag bringen.",
    },
    {
      title: "Individuelle Software",
      body: "Maßgeschneiderte Anwendungen — gebaut exakt um deinen Prozess herum, nicht um eine Vorlage.",
    },
    {
      title: "Kontrollierte Automatisierung",
      body: "Wiederkehrende Abläufe laufen von selbst — transparent, prüfbar und jederzeit unter deiner Kontrolle.",
    },
  ] satisfies ServiceCard[],
};

export type ApproachPoint = {
  title: string;
  body: string;
};

export const approachContent = {
  id: "ansatz",
  index: "02",
  eyebrow: "Ansatz",
  title: "Premium heißt durchdacht — nicht überladen.",
  body: "Jedes Projekt beginnt mit deinem Ziel, nicht mit der Technologie. Ich entwerfe Lösungen, die schlank bleiben, sich selbst erklären und mit dir mitwachsen.",
  points: [
    {
      title: "Ziel zuerst",
      body: "Wir starten mit dem Ergebnis, das du wirklich brauchst.",
    },
    {
      title: "Schlank gebaut",
      body: "Keine Funktion ohne Zweck — kein technischer Ballast.",
    },
    {
      title: "Transparent",
      body: "Du verstehst jederzeit, was passiert und warum.",
    },
  ] satisfies ApproachPoint[],
};

export type StatItem = {
  value: string;
  label: string;
};

export const statsContent = {
  id: "zahlen",
  index: "03",
  eyebrow: "Zahlen",
  title: "Konzepte, die sich auszahlen.",
  stats: [
    { value: "3×", label: "schnellere Umsetzung" },
    { value: "100%", label: "maßgeschneidert" },
    { value: "24/7", label: "automatisiert im Hintergrund" },
  ] satisfies StatItem[],
};

export type ProcessStep = {
  index: string;
  title: string;
  body: string;
};

export const processContent = {
  id: "prozess",
  index: "04",
  eyebrow: "Prozess",
  title: "So arbeite ich",
  steps: [
    {
      index: "01",
      title: "Analyse",
      body: "Wir klären Ziel, Kontext und Rahmen — ehrlich und ohne Fachjargon.",
    },
    {
      index: "02",
      title: "Konzept",
      body: "Ich entwerfe die Lösung und den Weg dorthin, inklusive realistischem Aufwand.",
    },
    {
      index: "03",
      title: "Umsetzung",
      body: "Gebaut, getestet und sauber übergeben — bereit für den Einsatz.",
    },
  ] satisfies ProcessStep[],
};

export const contactContent = {
  id: "kontakt",
  index: "05",
  eyebrow: "Kontakt",
  title: "Lass uns dein Konzept bauen.",
  body: "Erzähl mir kurz von deinem Vorhaben — du bekommst von mir einen ersten, ehrlichen Gedanken dazu zurück.",
  ctaLabel: "Gespräch anfragen",
  ctaHref: "mailto:kontakt@zian-ai.de",
};
