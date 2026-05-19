# Technische Spezifikation — ZIAN AI CONCEPTS 3D Experience

> **Dokumenttyp:** Ist-Zustand-Spezifikation (Referenzdokumentation)
> **Stand:** 2026-05-19 · Branch `feat/zian-3d-landing-page`
> **Projekt:** `zian-ai-concepts` v0.1.0 (privat)

Dieses Dokument beschreibt die tatsächlich implementierte Architektur der
scroll-getriebenen 3D-Logo-Landingpage. Es ist eine Bestandsaufnahme — keine
Roadmap. Offene Punkte aus dem Review vom 2026-05-18 sind in [Abschnitt 11](#11-bekannte-einschränkungen)
zusammengefasst, aber nicht Gegenstand der Spezifikation.

---

## 1. Überblick

Die Anwendung ist eine **Single-Page-Landingpage** für die Marke „ZIAN AI
CONCEPTS" (Andre Zimmermann). Kernstück ist ein **3D-Signet**, das beim Scrollen
rotiert und sich in 22 Einzelteile zerlegt, die in fünf Wellen aus dem Viewport
fliegen. Darunter liegt klassischer HTML-Content in sechs Sektionen.

Die gesamte Bewegung ist **rein scroll-gesteuert** (kein Autoplay, keine
Timeline) und damit **vollständig reversibel** — Zurückscrollen baut das Signet
wieder zusammen. `prefers-reduced-motion` deaktiviert sämtliche Bewegung.

### Designprinzipien

| Prinzip | Umsetzung |
|---|---|
| Eine Bewegungsquelle | Globaler Scroll-Fortschritt `0..1` treibt alles |
| Keine React-Re-Renders im Loop | Scroll-State liegt in einem `ref`, gelesen pro Frame |
| Eine Uhr | `gsap.ticker` taktet Lenis **und** ScrollTrigger |
| Reversibilität | Alle Posen sind reine Funktionen von `progress` |
| Reduced-Motion First-Class | Eigener Pfad ohne Smooth-Scroll/Scrub |

---

## 2. Technologie-Stack

| Schicht | Technologie | Version | Anmerkung |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.2.6 | Dev-Server via **Webpack** (`next dev --webpack`) |
| UI-Runtime | React / React DOM | 19.2.6 | |
| 3D-Renderer | Three.js | 0.182.0 | bewusst gepinnt (s. u.) |
| 3D-React-Bindung | @react-three/fiber | 9.6.1 | |
| 3D-Helfer | @react-three/drei | 10.7.7 | `Environment`, `Line`, `OrthographicCamera` |
| Scroll-Animation | GSAP + ScrollTrigger | 3.15.0 | |
| Smooth-Scroll | Lenis | 1.3.23 | |
| Styling | Tailwind CSS | 4.3.0 | v4, `@import "tailwindcss"` |
| Sprache | TypeScript | 6.0.3 | |
| Paketmanager | pnpm | — | `pnpm-workspace.yaml` vorhanden |

**Three.js-Pinning:** `three` ist auf `0.182.0` festgenagelt, weil das aktuelle
React-Three-Fiber-Release intern noch `THREE.Clock` nutzt — neuere Three-Versionen
emittieren dafür Deprecation-Warnungen. `@types/three` ist passend auf `0.182.0`
gepinnt. *(Hinweis: Die README nennt abweichend `0.183.0` — `package.json` ist
maßgeblich.)*

### Skripte (`package.json`)

| Befehl | Wirkung |
|---|---|
| `pnpm dev` | Dev-Server, Webpack, `127.0.0.1:3000` |
| `pnpm dev:turbo` | Dev-Server mit Turbopack |
| `pnpm build` | Produktionsbuild |
| `pnpm start` | Produktionsserver |
| `pnpm lint` | ESLint (`eslint-config-next`) |

---

## 3. Architektur

### 3.1 Schichtenmodell (Z-Stapel)

Die Seite besteht aus drei übereinanderliegenden, voll-viewport-großen Schichten
plus einem CSS-Glanz-Overlay:

```
┌─ <main class="premium-experience"> ──────────────────────┐
│                                                          │
│  z-30  .journey-canvas   ← 3D-Logo (fixed, R3F-Canvas)   │
│        pointer-events-none · aria-hidden                 │
│                                                          │
│  z-10  Content-Spalte    ← 6 HTML-Sektionen (scrollt)    │
│                                                          │
│  z-1   ::before          ← CSS-Glanz/Lichtstreif-Overlay │
│                                                          │
│  z-0   .ambient-field    ← bewegter Hintergrund (fixed)  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

Das 3D-Canvas liegt **über** dem Content (`z-30`), ist aber
`pointer-events-none` und `aria-hidden` — es fängt keine Eingaben ab und ist
für Screenreader unsichtbar. Die fliegenden Logo-Teile dürfen so visuell über
dem Text schweben, ohne ihn zu blockieren.

### 3.2 Dateistruktur

```
src/
├── app/
│   ├── layout.tsx          Root-Layout, <html lang="de">, Metadata, Viewport
│   ├── page.tsx            Rendert <ZianAiConceptsExperience/>
│   └── globals.css         Tailwind-Import, Theme, Ambient-Field, Reveal-CSS
│
├── components/
│   ├── zian-ai-concepts-experience.tsx   Top-Level-Client-Komponente
│   ├── scene/
│   │   ├── journey-logo.tsx        R3F-Canvas, Licht, Disassembling-Loop
│   │   └── responsive-camera.tsx   Viewport-abhängiger ortho. Zoom
│   └── sections/
│       ├── hero-section.tsx        Wortmarke + Scroll-Hinweis
│       ├── services-section.tsx    01 — Leistungen
│       ├── approach-section.tsx    02 — Ansatz
│       ├── stats-section.tsx       03 — Zahlen
│       ├── process-section.tsx     04 — Prozess
│       ├── contact-section.tsx     05 — Kontakt + Footer
│       └── reveal.tsx              Scroll-Wipe-Wrapper
│
└── lib/
    ├── content/site-content.ts     Sämtliche Texte (Single Source of Truth)
    ├── logo/
    │   ├── parts.ts                22 Part-Definitionen des Signets
    │   ├── geometry.ts             2D-Pfade → Three-Geometrien & Materialien
    │   └── choreography.ts         Batches, Posen-Interpolation pro Frame
    └── scroll/
        ├── scroll-context.ts       ScrollState-Typ + React-Context
        └── use-scroll-rig.ts       Lenis + ScrollTrigger-Setup
```

### 3.3 Server- vs. Client-Komponenten

- **Server (RSC):** `layout.tsx`, `page.tsx` und alle reinen Content-Sektionen
  (`hero/services/approach/stats/process/contact`) — sie rendern nur statisches
  Markup aus `site-content.ts`.
- **Client (`"use client"`):** `zian-ai-concepts-experience.tsx`, `journey-logo.tsx`,
  `responsive-camera.tsx`, `reveal.tsx`, `use-scroll-rig.ts`, `scroll-context.ts`
  — alles, was Browser-APIs, GSAP, Lenis oder R3F berührt.

---

## 4. Scroll-System

### 4.1 `useScrollRig` (`lib/scroll/use-scroll-rig.ts`)

Das Herz der Bewegung. Der Hook richtet beim Mount ein:

1. **Plugin-Registrierung** — `ScrollTrigger` wird einmalig registriert
   (Modul-Flag `pluginRegistered` verhindert Doppelregistrierung).
2. **Reduced-Motion-Check** — bei `prefers-reduced-motion: reduce` wird **kein**
   Lenis und **kein** ScrollTrigger erzeugt; `progress` bleibt `0`, das Signet
   ruht montiert im Hero. Der Hook kehrt früh zurück.
3. **Lenis** — Smooth-Scroll mit `lerp: 0.1`, `smoothWheel: true`.
4. **Eine Uhr** — `gsap.ticker` treibt `lenis.raf()`; `lagSmoothing(0)`
   verhindert GSAP-Sprünge nach Tab-Inaktivität. Lenis' `scroll`-Event ruft
   `ScrollTrigger.update()`.
5. **Ein Page-Trigger** — ein einzelner `ScrollTrigger` von `0` bis `"max"` mit
   `scrub: true`. `onUpdate` schreibt `self.progress` (0..1) in `state.current.progress`.

**Rückgabe:** ein `RefObject<ScrollState>`. Bewusst ein Ref — Schreiben löst
**keine** Re-Renders aus; der R3F-Loop liest den Wert pro Frame.

**Cleanup:** `pageTrigger.kill()`, Ticker-Callback entfernen, Lenis-Listener ab,
`lenis.destroy()`.

**Dev-Hilfe:** Außerhalb von Produktion wird die Lenis-Instanz als
`window.__lenis` exponiert.

### 4.2 `ScrollState` & Context (`lib/scroll/scroll-context.ts`)

```ts
type ScrollState = {
  progress: number;   // normalisierter Seiten-Fortschritt 0..1
  reduced: boolean;   // true bei prefers-reduced-motion
};
```

`ScrollContext` ist ein `RefObject<ScrollState> | null`. `useScrollState()`
liest den Ref und wirft, wenn außerhalb des Providers verwendet. Der Provider
sitzt **innerhalb** des R3F-`<Canvas>` (R3F hat einen eigenen Reconciler-Tree,
daher muss der Context dort neu bereitgestellt werden).

### 4.3 Datenfluss

```
   Scroll-Eingabe (Wheel/Touch)
            │
            ▼
   Lenis (Smooth-Scroll, lerp 0.1)
            │  on("scroll")
            ▼
   ScrollTrigger.update()  ──►  Page-Trigger.onUpdate
            │                          │
   gsap.ticker (eine Uhr)              ▼
            │                  state.current.progress = 0..1
            ▼                          │
   lenis.raf(time)                     │  (ref, kein Re-Render)
                                       ▼
                          useFrame() im R3F-Loop liest progress
                                       │
                                       ▼
                          applyPose() pro Teil pro Frame
```

---

## 5. 3D-Szene

### 5.1 Canvas-Setup (`scene/journey-logo.tsx`)

`<JourneyLogo>` rendert einen R3F-`<Canvas>`:

- **Kamera:** orthografisch, Startposition `[0, 0, 7]`, `near 0.1`, `far 100`.
  Der Zoom wird zur Laufzeit von `ResponsiveCamera` überschrieben.
- **Pixelverhältnis:** `dpr={[1, 2]}` — gedeckelt auf 2× für Retina-Schärfe
  ohne 3×/4×-Overdraw.
- **GL-Kontext:** `alpha: true` (transparenter Hintergrund — die CSS-Schichten
  scheinen durch), `antialias: true`, `powerPreference: "high-performance"`,
  `toneMapping: ACESFilmicToneMapping`.

### 5.2 Responsive Kamera (`scene/responsive-camera.tsx`)

Eine orthografische Kamera zeigt das Signet auf jedem Bildschirm gleich groß.
Der Zoom wird aus der **Viewport-Höhe** abgeleitet:

```
fraction = viewportWidth < 640 ? 0.30 : 0.46
zoom     = clamp( fraction * viewportHeight / 3.5,  56,  260 )
```

`LOGO_WORLD_HEIGHT = 3.5` ist die scheinbare Höhe des montierten Signets in
Weltkoordinaten (inkl. `LOGO_SCALE`). Auf schmalen Screens (< 640 px) belegt das
Logo einen kleineren Höhenanteil (0.30 statt 0.46).

### 5.3 Beleuchtung

| Lichtquelle | Parameter |
|---|---|
| `ambientLight` | Intensität 0.34 |
| `directionalLight` ×3 | Key (warm `#f7f7ef`, 0.86), Fill (`#d7d9d0`, 0.34), Rim/hinten (`#dce7d8`, 0.52) |
| `pointLight` ×3 | warmes Key (3.4), neutrales Fill (1.7), goldener Akzent hinten (`#f4d7a1`, 2.2) |
| `<Environment preset="city">` | `environmentIntensity={0.12}` — dezente Reflexionen auf den metallischen Materialien |

> ⚠️ `<Environment preset="city">` lädt eine HDR-Datei von einem externen Host
> (`raw.githack.com`). Siehe [Abschnitt 11](#11-bekannte-einschränkungen).

### 5.4 Render-Loop (`DisassemblingLogo`)

- **Aufbau:** `buildJourney()` wird **einmal** via `useMemo` ausgeführt (Geometrie­
  konstruktion ist teuer).
- **Per-Part-Refs:** ein `partRefs`-Array hält die `THREE.Group` je Teil.
- **`useFrame`:**
  1. Liest `progress`/`reduced` aus dem Scroll-Ref; bei Reduced-Motion gilt `p = 0`.
  2. Ruft `applyPose(part, p, group)` für jedes der 22 Teile.
  3. Steuert die `liftRef`-Gruppe: **Idle-Schweben** (Sinus, nur solange montiert,
     `p < 0.06`) und **Aufstieg** — das Signet hebt um bis zu 6 Welteinheiten ab,
     während es sich zerlegt (`p` von 0.04 bis ~0.26), damit kein Trümmerteil
     über dem Content liegen bleibt.
- **Lift-Basis:** `LOGO_LIFT = 1.9` — hebt das Signet in den oberen Hero-Bereich.

---

## 6. Geometrie & Materialien (`lib/logo/geometry.ts`)

Das Signet wird **prozedural aus 2D-Pfaden** gebaut — keine externen 3D-Assets.

### 6.1 Pfade

| Pfad | Beschreibung |
|---|---|
| `outerPath` | äußeres Hexagon (Silhouette), 6 Punkte |
| `innerPath` | inneres Hexagon (Kern), 6 Punkte |
| `zianZPath` | „Z"-Letterform, 10 Punkte |
| `rearZPath` | gespiegeltes „Z" für die Rückseite |
| `frontFacets` | 6 art-direktierte Front-Facetten (Punkte + Farbe + Opazität + Roughness) |

### 6.2 Geometrien (`createLogoGeometry`)

14 `THREE.BufferGeometry`-Instanzen:

- **`ExtrudeGeometry`** (mit Bevel): `shell`, `core`, `z`, `edge`
- **`ShapeGeometry`** (flach): `rearPanel`, `rearInset`, `rearZ`, `facet0…5`
- **`SphereGeometry`**: `rivet` (Radius 0.018)

`shell/core/z/edge` werden mit `.center()` zentriert. Für **alle** Geometrien
wird `computeBoundingBox()` aufgerufen — die Choreografie braucht die Bounding-
Box, um den Pivot (Schwerpunkt) jedes Teils zu bestimmen.

### 6.3 Materialien (`createLogoMaterials`)

17 Material-Instanzen, gemischt aus:

- `MeshStandardMaterial` — `shell`, `core`, `zSide`, `rearZ`, `rearShadow`, `rim`, 6× Facette
- `MeshPhysicalMaterial` (mit Clearcoat) — `z`, `rearPanel`, `rearInset`
- `MeshBasicMaterial` — `rearRivet`

Durchgängig hoch-metallisch (`metalness` 0.68–1.0), viele teils transparent
(`opacity` 0.06–0.92). Die Farbpalette ist dunkel-monochrom mit warmem
Gold-Akzent (`#f4d7a1`).

> Geometrie & Materialien sind laut Quelltext-Kommentar **verbatim** aus einer
> früheren `zian-logo-3d.tsx` portiert, damit das montierte Logo pixelidentisch
> bleibt.

---

## 7. Logo-Teile (`lib/logo/parts.ts`)

Das Signet zerfällt in **22 choreografierbare Teile** (`PARTS`), `LOGO_SCALE = 1.06`:

| Gruppe | Anzahl | IDs / `order` |
|---|---|---|
| Heck-Nieten | 6 | `rear-rivet-0…5`, `order` 0–5 |
| Strukturteile | 9 | `rear-z`(6), `rear-inset`(7), `rear-panel`(8), `rear-shadow`(9), `core`(15), `shell`(16), `rim`(17), `z-side`(18), `z-main`(19) |
| Front-Facetten | 6 | `facet-0…5`, `order` 10–15 |
| Wireframe-Käfig | 1 | `wireframe` (`order` 12) — als **eine** starre Einheit |

Jede Definition (`PartDef`) trägt `homePosition`, `homeScale` und `order`.
`order` bestimmt die **Reihenfolge der Demontage** (niedrig = löst sich früh).

### Teil-Arten

- **`mesh`** — eine solide Geometrie + Material (`MeshPartDef`).
- **`lines`** — Wireframe-Bündel aus `LineDef`s (Punkte, Farbe, Linienbreite,
  Opazität, optional gestrichelt). Der Käfig umfasst Außen-/Innenkonturen vorne
  und hinten, 6 Tiefenrippen und mehrere Akzentlinien — alle gemeinsam
  choreografiert.

---

## 8. Choreografie (`lib/logo/choreography.ts`)

### 8.1 Konzept

Beim Scrollen rotiert das Signet um die eigene Y-Achse und stößt seine 22 Teile
in **5 gestaffelten Wellen** (Batches) ab. Jedes Teil durchläuft drei Phasen:
**montiert → abgelöst → abgeflogen**. Alles ist eine reine Funktion von
`progress` und damit voll reversibel.

### 8.2 Timing-Konstanten

| Konstante | Wert | Bedeutung |
|---|---|---|
| `BATCH_COUNT` | 5 | Anzahl der Demontage-Wellen |
| `BATCH_FIRST` | 0.07 | `progress`, bei dem die 1. Welle startet |
| `BATCH_STEP` | 0.02 | Abstand zwischen den Wellen |
| `DETACH_DURATION` | 0.05 | Dauer der Phase montiert→abgelöst |
| `DEPART_DURATION` | 0.10 | Dauer der Phase abgelöst→abgeflogen |
| `STAGGER` | 0.008 | Versatz zwischen Teilen einer Welle |
| `SPIN_RANGE` | 0.38 | `progress`-Fenster, über das die Drehung aufgebaut wird |
| `SPIN_TURNS` | 2 | Y-Achsen-Umdrehungen während der Demontage |
| `DETACH_DISTANCE` | 2.3 | Flugweite in die abgelöste Pose |
| `DEPART_DISTANCE` | 9.5 | Flugweite in die finale Off-Screen-Pose |

### 8.3 `buildJourney()`

Einmaliger, memoisierter Aufbau:

1. Geometrien & Materialien erzeugen.
2. **Batch-Zuordnung:** `PARTS` nach `order` sortieren; Rang → Batch via
   `floor(rank * 5 / total)`.
3. Pro Teil:
   - **Pivot** = Schwerpunkt im montierten Logo (aus Bounding-Box für Meshes,
     aus `homePosition` für Lines).
   - **`meshOffset`** = Versatz des gerenderten Inhalts innerhalb der Pivot-Gruppe.
   - **`detachDirection`** = Auswärtsrichtung: Mischung aus radialer Richtung
     (vom Zentrum weg) und einem fächerförmigen Winkel-Term, plus Z-Bias nach
     vorn/hinten.
   - **`detached`-Pose** = Pivot + Richtung × 2.3, dazu eine getumblte Quaternion.
   - **`departed`-Pose** = Pivot + (Richtung leicht nach unten) × 9.5, stärker
     getumbelt — Trümmer fallen leicht nach unten aus dem Bild.

### 8.4 `applyPose(part, progress, group)`

Pro Frame und Teil ausgeführt — **rein und allokationsfrei** (Scratch-Vektoren/
-Quaternionen auf Modulebene wiederverwendet).

Zeitfenster des Teils:
```
detachStart = BATCH_FIRST + batch · BATCH_STEP + delay
detachEnd   = detachStart + DETACH_DURATION
departEnd   = detachEnd  + DEPART_DURATION
```

Spin: `spin = clamp01(progress / 0.38) · 2 · 2π`.

| Bedingung | Verhalten |
|---|---|
| `progress ≤ detachStart` | **Montiert** — Teil reitet das rotierende Signet (Position via `spunPosition`, Quaternion = Spin). Scale 1. |
| `progress < detachEnd` | **Ablösung** — `lerp`/`slerp` vom Spin-Heim zur `detached`-Pose, `easeOutCubic`. |
| `progress < departEnd` | **Abflug** — `lerp`/`slerp` von `detached` zu `departed`, `easeInCubic`, Scale schrumpft auf 0.15. |
| sonst | **Weg** — fixiert in `departed`-Pose, Scale 0.15. |

`spunPosition` rotiert einen Punkt um die Y-Achse durch das Logo-Zentrum
(2D-Rotationsmatrix auf X/Z).

---

## 9. Content-Sektionen

### 9.1 Inhalt (`lib/content/site-content.ts`)

**Single Source of Truth** für sämtliche Texte. Jede Sektion bezieht ihren
Inhalt aus einem typisierten Export (`heroContent`, `servicesContent`, …). Die
Inhalte sind als Demo-Content gekennzeichnet, thematisch auf ZIAN AI CONCEPTS
zugeschnitten.

| Export | Sektion | Kerninhalt |
|---|---|---|
| `heroContent` | Hero | Eyebrow, Titel, Tagline, Scroll-Hinweis |
| `servicesContent` | 01 Leistungen | 3 Karten |
| `approachContent` | 02 Ansatz | Statement + 3 Prinzipien |
| `statsContent` | 03 Zahlen | 3 Kennzahlen |
| `processContent` | 04 Prozess | 3 Schritte |
| `contactContent` | 05 Kontakt | CTA + `mailto:`-Link |

### 9.2 Layout der Sektionen

Alle in `zian-ai-concepts-experience.tsx` in fester Reihenfolge gerendert:
Hero → Services → Approach → Stats → Process → Contact.

- Hero: `min-h-[100svh]`, Wortmarke unten zentriert; das 3D-Signet schwebt
  darüber im fixierten Canvas.
- Sektionen 01–05: gleiche Struktur (`max-w-6xl`, Eyebrow mit Index-Nummer,
  H2, Karten-/Listen-Grid). Jede Sektion hat eine `id` (`leistungen`, `ansatz`,
  `zahlen`, `prozess`, `kontakt`) für Anker-Navigation.
- Contact: schließt mit einem `<footer>` (Copyright-Jahr dynamisch, Wortmarke).

### 9.3 Reveal-Effekt (`sections/reveal.tsx`)

Wrapper um jeden Sektionsinhalt. Ein eigener `ScrollTrigger` pro Instanz
(`start: "top 92%"`, `end: "top 44%"`, `scrub: 0.6`) schreibt direkt ins DOM:

- `clip-path: inset(0 0 <hidden>% 0)` — der Inhalt wird geometrisch von oben
  nach unten **aufgewischt** (nicht eingeblendet).
- `transform: translate3d(0, <hidden·42>px, 0)` — leichter Aufwärts-Versatz.

Bei `prefers-reduced-motion` wird `clipPath`/`transform` sofort auf `none`
gesetzt und kein Trigger erzeugt. Die CSS-Klasse `.reveal` startet voll
geclippt (`inset(0 0 100% 0)`), damit vor JS-Hydration nichts aufblitzt.

---

## 10. Styling & Visuelles

### 10.1 Tailwind v4 (`globals.css`)

- `@import "tailwindcss"` — kein klassisches Config-File; das Theme wird
  inline via `@theme inline` definiert (`--color-background`, `--color-foreground`,
  `--font-sans`, `--font-display`).
- **Farben:** Hintergrund `#010202`/`#040607`, Vordergrund `#f8fbff`,
  Akzent gold `#f4d7a1`. Dark-Only (`colorScheme: "dark"`).
- **Schrift:** `Aptos` mit System-Fallbacks (`SF Pro`, `Inter`, `Helvetica`).

### 10.2 Ambient-Field

Drei gestapelte `<div>`s (`.ambient-field__depth/__warp/__grain`), gesteuert
über CSS-Custom-Properties (`--ambient-*`), die in
`zian-ai-concepts-experience.tsx` als **statisches** `ambientStyle`-Objekt
gesetzt werden. Radiale/konische Gradienten, `blur`, `mix-blend-mode: screen`,
eine Maske für die Körnung — ergeben einen ruhigen, atmosphärischen Hintergrund.
(Aktuell statisch; die Transition-Regeln deuten auf vorgesehene Animierbarkeit hin.)

### 10.3 Reduced-Motion

Zwei Mechanismen greifen ineinander:

1. **JS:** `useScrollRig` und `Reveal` prüfen `matchMedia` und überspringen
   Lenis/ScrollTrigger; `DisassemblingLogo` rechnet mit `p = 0`.
2. **CSS:** Die Klasse `.is-reduced-motion` (auf `<main>`) drückt
   `animation-duration`/`transition-duration` aller Elemente auf `0.001ms`.

Resultat bei Reduced-Motion: Das Signet ruht montiert im Hero, alle Sektionen
sind sofort sichtbar, kein Smooth-Scroll.

---

## 11. Bekannte Einschränkungen

Aus dem Multi-Agent-Review vom 2026-05-18 (Gate-Verdikt: **RED — nicht
deployen**). Build, Lint, `tsc` und `pnpm audit` laufen sauber durch; die
folgenden Punkte sind **funktional/Compliance**, nicht Code-Hygiene. Sie sind
hier nur dokumentiert, nicht behoben:

1. **Externe HDR-Quelle** — `<Environment preset="city">` lädt eine HDR-Datei
   von `raw.githack.com` (→ `raw.githubusercontent.com`). Sollte selbst gehostet
   und aus der CSP `connect-src` entfernt werden.
2. **Keine SEO-Metadaten** — kein Open Graph, Twitter-Card, `metadataBase`,
   `robots.ts`, `sitemap.ts` oder Manifest. `layout.tsx` setzt nur Titel +
   Description.
3. **Kein Lazy-Loading des Logos** — `ZianLogo3D` blockiert den Hero-LCP;
   ~567 KB gzip First-Load-JS.
4. **Kein WebGL-Fallback** — kein `webglcontextlost`-Handler; kein Fallback,
   falls WebGL fehlt.
5. **Accessibility/Schrift** — Variable-Font-Gewichte 800/850/900 außerhalb der
   300–700-Achse; blasse Label-Tönungen unter WCAG-AA-Kontrast; Platzhalter-
   Kontaktadresse (`kontakt@zian-ai.de`).

> Eine separate To-be-Spezifikation für diese Punkte ist **nicht** Teil dieses
> Dokuments.

---

## 12. Glossar

| Begriff | Bedeutung |
|---|---|
| **Signet** | Das 3D-Logo — ein hexagonales „Z"-Emblem |
| **Journey** | Die memoisierte Sammlung aller 22 Teile inkl. Choreografie-Daten |
| **Part** | Ein einzelnes choreografierbares Teil (Mesh oder Lines) |
| **Batch** | Eine von 5 Demontage-Wellen |
| **Pose** | Position + Quaternion eines Teils zu einem `progress`-Wert |
| **Pivot** | Schwerpunkt eines Teils im montierten Logo (Rotations-/Flugzentrum) |
| **Progress** | Normalisierter Seiten-Scroll, 0..1 — die einzige Bewegungsquelle |
| **Rig** | Das Scroll-Setup (Lenis + ScrollTrigger) aus `useScrollRig` |
```
