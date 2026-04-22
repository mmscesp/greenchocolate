import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

const projectRoot = process.cwd();
const previewUrl = process.argv[2] ?? "http://localhost:3000/en/scm-ig-preview";
const folderName = process.argv[3] ?? "scm-ig-preview";
const slideCountLimit = Number.parseInt(process.argv[4] ?? "", 10);
const outputDir = path.join(projectRoot, "output", "ig-renders", folderName);

const edgeCandidates = [
  process.env.PLAYWRIGHT_EXECUTABLE_PATH,
  "C:\\Program Files (x86)\\Microsoft\\EdgeCore\\147.0.3912.72\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\EdgeCore\\147.0.3912.60\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

async function resolveBrowserExecutable() {
  for (const candidate of edgeCandidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error(
    "No supported Edge executable found. Set PLAYWRIGHT_EXECUTABLE_PATH to a local browser path.",
  );
}

async function main() {
  const executablePath = await resolveBrowserExecutable();
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1720, height: 1400 },
      deviceScaleFactor: 1,
    });

    await page.goto(previewUrl, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images).map(
          (image) =>
            image.complete
              ? Promise.resolve()
              : new Promise((resolve) => {
                  image.addEventListener("load", resolve, { once: true });
                  image.addEventListener("error", resolve, { once: true });
                }),
        ),
      );
    });

    const detectedSlideCount = await page.locator(".export-slide").count();
    const slideCount = Number.isFinite(slideCountLimit) && slideCountLimit > 0
      ? Math.min(detectedSlideCount, slideCountLimit)
      : detectedSlideCount;

    if (detectedSlideCount === 0) {
      throw new Error(`No .export-slide elements found at ${previewUrl}`);
    }

    const firstSlideDimensions = await page.locator(".export-slide").first().evaluate(
      (node) => {
        const element = node;
        const declaredHeight = Number.parseFloat(element.style.height || "1080");
        return {
          width: 1080,
          height: Number.isFinite(declaredHeight) ? Math.round(declaredHeight) : 1080,
        };
      },
    );

    for (let index = 0; index < slideCount; index += 1) {
      const stagingId = await page.evaluate(async (slideIndex) => {
        const source = document.querySelectorAll(".export-slide")[slideIndex];
        if (!source) {
          throw new Error(`Missing slide at index ${slideIndex}`);
        }

        const existing = document.getElementById("__scm-export-stage__");
        if (existing) {
          existing.remove();
        }

        const stage = document.createElement("div");
        stage.id = "__scm-export-stage__";
        stage.style.position = "fixed";
        stage.style.inset = "0";
        stage.style.width = "100vw";
        stage.style.height = "100vh";
        stage.style.background = "rgba(0, 0, 0, 0.88)";
        stage.style.display = "flex";
        stage.style.alignItems = "center";
        stage.style.justifyContent = "center";
        stage.style.zIndex = "2147483647";
        stage.style.pointerEvents = "none";

        const clone = source.cloneNode(true);
        if (!(clone instanceof HTMLElement)) {
          throw new Error("Failed to clone export slide");
        }

        clone.id = "__scm-export-slide__";
        const sourceElement = source;
        const declaredHeight = Number.parseFloat(sourceElement.style.height || "1080");
        clone.style.position = "relative";
        clone.style.left = "auto";
        clone.style.top = "auto";
        clone.style.width = "1080px";
        clone.style.height = `${Number.isFinite(declaredHeight) ? Math.round(declaredHeight) : 1080}px`;
        clone.style.transform = "none";
        clone.style.transformOrigin = "top left";
        clone.style.scale = "1";
        clone.classList.remove("scale-[0.357]");
        clone.classList.add("scale-100");

        stage.appendChild(clone);
        document.body.appendChild(stage);

        const cloneImages = Array.from(clone.querySelectorAll("img"));
        await Promise.all(
          cloneImages.map(
            (image) =>
              image.complete
                ? Promise.resolve()
                : new Promise((resolve) => {
                    image.addEventListener("load", resolve, { once: true });
                    image.addEventListener("error", resolve, { once: true });
                  }),
          ),
        );

        return clone.id;
      }, index);

      const target = page.locator(`#${stagingId}`);
      await target.screenshot({
        path: path.join(outputDir, `slide-${String(index + 1).padStart(2, "0")}.jpg`),
        type: "jpeg",
        quality: 95,
      });

      await page.evaluate(() => {
        document.getElementById("__scm-export-stage__")?.remove();
      });
    }

    const manifest = {
      previewUrl,
      outputDir,
      slideCount,
      generatedAt: new Date().toISOString(),
      format: "jpg",
      width: firstSlideDimensions.width,
      height: firstSlideDimensions.height,
    };

    await fs.writeFile(
      path.join(outputDir, "manifest.json"),
      JSON.stringify(manifest, null, 2),
      "utf8",
    );

    console.log(`Rendered ${slideCount} slide JPGs to ${outputDir}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
