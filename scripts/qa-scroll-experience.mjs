import { chromium } from "@playwright/test";
import { PNG } from "pngjs";

const targetUrl = process.env.TARGET_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true });
const consoleErrors = [];
const consoleWarnings = [];

try {
  const desktop = await runViewport("desktop", {
    width: 1440,
    height: 1000,
  });
  const mobile = await runViewport("mobile", {
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const reducedMotion = await runReducedMotion();

  const failures = [
    desktop.canvas.nonBlankSamples < 4
      ? `desktop canvas only returned ${desktop.canvas.nonBlankSamples} nonblank samples`
      : null,
    mobile.canvas.nonBlankSamples < 2
      ? `mobile canvas only returned ${mobile.canvas.nonBlankSamples} nonblank samples`
      : null,
    desktop.samples.some((sample) => sample.overflowX > 2)
      ? "desktop has horizontal overflow"
      : null,
    mobile.samples.some((sample) => sample.overflowX > 2)
      ? "mobile has horizontal overflow"
      : null,
    desktop.samples.some((sample) => sample.overlaps.length > 0)
      ? "desktop has visible text overlaps"
      : null,
    mobile.samples.some((sample) => sample.overlaps.length > 0)
      ? "mobile has visible text overlaps"
      : null,
    reducedMotion.reducedClass ? null : "reduced-motion class was not applied",
    reducedMotion.visibleBeats >= 4 ? null : "reduced-motion did not expose all narrative beats",
    reducedMotion.storyPinned ? "reduced-motion left story pin fixed" : null,
    consoleErrors.length ? "browser console errors were captured" : null,
  ].filter(Boolean);

  const report = {
    targetUrl,
    desktop,
    mobile,
    reducedMotion,
    consoleErrors,
    consoleWarnings,
    status: failures.length ? "fail" : "pass",
    failures,
  };

  console.log(JSON.stringify(report, null, 2));

  if (failures.length) {
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}

async function runViewport(name, options) {
  const context = await browser.newContext({
    viewport: { width: options.width, height: options.height },
    deviceScaleFactor: options.deviceScaleFactor ?? 1,
    hasTouch: options.hasTouch ?? false,
    isMobile: options.isMobile ?? false,
  });
  const page = await context.newPage();
  attachDiagnostics(page, name);

  await openExperience(page);

  const canvas = await sampleCanvas(page);
  const samples = [];
  const positions = [0, 0.18, 0.38, 0.58, 0.82, 0.98];

  for (const ratio of positions) {
    await page.evaluate((value) => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      window.scrollTo({
        top: maxScroll * value,
        behavior: "instant",
      });
    }, ratio);
    await page.waitForTimeout(name === "mobile" ? 220 : 380);
    samples.push(await sampleLayout(page, ratio));
  }

  await context.close();

  return {
    viewport: options,
    canvas,
    samples,
    scenesSeen: [...new Set(samples.map((sample) => sample.scene))],
  };
}

async function runReducedMotion() {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  attachDiagnostics(page, "reduced-motion");

  await openExperience(page);
  await page.waitForTimeout(350);

  const result = await page.evaluate(() => {
    const root = document.querySelector(".premium-experience");
    const storyLock = document.querySelector("[data-story-lock]");
    const beats = [...document.querySelectorAll("[data-beat]")];

    return {
      reducedClass: root?.classList.contains("is-reduced-motion") ?? false,
      storyPinned: storyLock
        ? getComputedStyle(storyLock).position === "fixed"
        : false,
      visibleBeats: beats.filter((beat) => {
        const style = getComputedStyle(beat);
        const rect = beat.getBoundingClientRect();

        return (
          style.visibility !== "hidden" &&
          Number(style.opacity) > 0.5 &&
          rect.width > 0 &&
          rect.height > 0
        );
      }).length,
      storyHeight: Math.round(
        document.querySelector(".story-chapter")?.getBoundingClientRect()
          .height ?? 0,
      ),
    };
  });

  await context.close();
  return result;
}

async function openExperience(page) {
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 3000 }).catch(() => {});
  await page.locator("canvas").waitFor({ state: "visible", timeout: 10000 });
  await page.waitForTimeout(500);
}

function attachDiagnostics(page, viewportName) {
  page.on("console", (message) => {
    const entry = {
      viewport: viewportName,
      type: message.type(),
      text: message.text(),
    };

    if (message.type() === "error") {
      consoleErrors.push(entry);
    }

    if (message.type() === "warning" || message.type() === "warn") {
      consoleWarnings.push(entry);
    }
  });

  page.on("pageerror", (error) => {
    consoleErrors.push({
      viewport: viewportName,
      type: "pageerror",
      text: error.message,
    });
  });
}

async function sampleCanvas(page) {
  const meta = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");

    if (!canvas) {
      return {
        exists: false,
        width: 0,
        height: 0,
        rect: null,
        nonBlankSamples: 0,
        pixels: [],
      };
    }

    const rect = canvas.getBoundingClientRect();

    return {
      exists: true,
      width: canvas.width,
      height: canvas.height,
      rect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      nonBlankSamples: 0,
      pixels: [],
    };
  });

  if (!meta.exists) {
    return meta;
  }

  const pngBuffer = await page.locator("canvas").screenshot({
    animations: "disabled",
    timeout: 10000,
  });
  const png = PNG.sync.read(pngBuffer);
  const pixels = [];
  const cols = [0.28, 0.38, 0.5, 0.62, 0.72];
  const rows = [0.28, 0.4, 0.5, 0.6, 0.72];

  for (const xRatio of cols) {
    for (const yRatio of rows) {
      const x = Math.max(0, Math.min(png.width - 1, Math.floor(png.width * xRatio)));
      const y = Math.max(0, Math.min(png.height - 1, Math.floor(png.height * yRatio)));
      const index = (png.width * y + x) << 2;
      const rgba = [
        png.data[index],
        png.data[index + 1],
        png.data[index + 2],
        png.data[index + 3],
      ];

      pixels.push({
        x,
        y,
        rgba,
        luminance: rgba[0] + rgba[1] + rgba[2],
      });
    }
  }

  return {
    ...meta,
    screenshotWidth: png.width,
    screenshotHeight: png.height,
    nonBlankSamples: pixels.filter((pixel) => pixel.luminance > 36).length,
    pixels,
  };
}

async function sampleLayout(page, ratio) {
  return page.evaluate((value) => {
    const labelFor = (element) => {
      const text = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const name =
        element.getAttribute("data-chapter") ??
        element.getAttribute("id") ??
        element.tagName.toLowerCase();

      return `${name}: ${text.slice(0, 42)}`;
    };

    const rectFor = (selector) => {
      const element = document.querySelector(selector);

      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();

      return {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        height: Math.round(rect.height),
        position: getComputedStyle(element).position,
      };
    };

    const inViewport = (selector) => {
      const element = document.querySelector(selector);

      if (!element) {
        return false;
      }

      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const root = document.querySelector(".premium-experience");
    const overlapTargets = [
      ...document.querySelectorAll(
        "h1,h2,h3,p,a,[data-product-step],[data-beat]",
      ),
    ].filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);

      return (
        !element.closest("header") &&
        rect.width > 4 &&
        rect.height > 4 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0.08
      );
    });

    const overlaps = [];

    for (let a = 0; a < overlapTargets.length; a += 1) {
      for (let b = a + 1; b < overlapTargets.length; b += 1) {
        const first = overlapTargets[a];
        const second = overlapTargets[b];

        if (first.contains(second) || second.contains(first)) {
          continue;
        }

        const firstRect = first.getBoundingClientRect();
        const secondRect = second.getBoundingClientRect();
        const width = Math.min(firstRect.right, secondRect.right) - Math.max(firstRect.left, secondRect.left);
        const height = Math.min(firstRect.bottom, secondRect.bottom) - Math.max(firstRect.top, secondRect.top);

        if (width > 8 && height > 8) {
          overlaps.push({
            first: labelFor(first),
            second: labelFor(second),
            width: Math.round(width),
            height: Math.round(height),
          });
        }
      }
    }

    return {
      ratio: value,
      scrollY: Math.round(window.scrollY),
      scene: root?.getAttribute("data-scene") ?? null,
      activeNav:
        document.querySelector('[aria-current="page"]')?.textContent?.trim() ??
        null,
      overflowX: Math.max(
        0,
        Math.round(document.documentElement.scrollWidth - window.innerWidth),
      ),
      overlaps: overlaps.slice(0, 4),
      storyLock: rectFor("[data-story-lock]"),
      cinemaLock: rectFor("[data-cinema-lock]"),
      closeVisible: inViewport("#close"),
    };
  }, ratio);
}
