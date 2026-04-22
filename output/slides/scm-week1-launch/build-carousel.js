const path = require("path");
const PptxGenJS = require("pptxgenjs");
const {
  imageSizingCrop,
  imageSizingContain,
} = require("./pptxgenjs_helpers/image");
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("./pptxgenjs_helpers/layout");
const { safeOuterShadow } = require("./pptxgenjs_helpers/util");

const root = path.resolve(__dirname, "..", "..", "..");
const outDir = __dirname;

const assets = {
  logo: path.join(root, "public", "images", "SCM_Logo_SVG.svg"),
  skyline: path.join(root, "public", "images", "hero", "barcelona-skyline-mobile.webp"),
  city: path.join(root, "public", "images", "cities", "barcelona-city.webp"),
  vsAmsterdam: path.join(root, "public", "images", "editorial", "barcelona-vs-amsterdam.webp"),
  lostTourist: path.join(root, "public", "images", "editorial", "lost-tourist.webp"),
  legalFlags: path.join(root, "public", "images", "editorial", "spain-legal-flags.webp"),
};

const colors = {
  bg: "0B1320",
  bg2: "132238",
  bg3: "1A2D45",
  panel: "112131",
  panel2: "17283C",
  text: "F5F7FA",
  muted: "8EA4BE",
  line: "2B415A",
  teal: "00C9B1",
  tealSoft: "6BE7D7",
  gold: "E7A63B",
  goldSoft: "F3C66A",
  moss: "A8A555",
  danger: "F17B7B",
};

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "IG_PORTRAIT", width: 8, height: 10 });
pptx.layout = "IG_PORTRAIT";
pptx.author = "OpenAI Codex";
pptx.company = "SocialClubsMaps";
pptx.subject = "SCM Week 1 launch carousel";
pptx.title = "Barcelona has clubs. Most people get the legal reality wrong.";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Playfair Display",
  bodyFontFace: "Plus Jakarta Sans",
  lang: "en-US",
};

function addBase(slide, opts = {}) {
  const imagePath = opts.imagePath;

  slide.background = { color: colors.bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 8,
    h: 10,
    line: { color: colors.bg, transparency: 100 },
    fill: { color: colors.bg },
  });

  if (imagePath) {
    slide.addImage({
      path: imagePath,
      ...imageSizingCrop(imagePath, 0, 0, 8, 10),
      transparency: 5,
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 8,
      h: 10,
      line: { color: colors.bg, transparency: 100 },
      fill: {
        color: "091018",
        transparency: opts.overlayTransparency ?? 24,
      },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 8,
      h: 10,
      line: { color: colors.bg, transparency: 100 },
      fill: {
        color: colors.bg,
        transparency: opts.topFadeTransparency ?? 48,
      },
    });
  }

  slide.addShape(pptx.ShapeType.line, {
    x: 0.6,
    y: 0.75,
    w: 6.8,
    h: 0,
    line: { color: colors.line, pt: 1.1, transparency: 25 },
  });

  slide.addShape(pptx.ShapeType.line, {
    x: 0.6,
    y: 9.22,
    w: 6.8,
    h: 0,
    line: { color: colors.line, pt: 1.1, transparency: 25 },
  });

  slide.addImage({
    path: assets.logo,
    ...imageSizingContain(assets.logo, 0.62, 0.28, 0.62, 0.62),
  });

  slide.addText("SOCIALCLUBSMAPS", {
    x: 1.28,
    y: 0.31,
    w: 2.6,
    h: 0.22,
    fontFace: "Plus Jakarta Sans",
    fontSize: 10,
    color: colors.text,
    bold: true,
    charSpace: 0.8,
    margin: 0,
  });

  slide.addText("Independent. Verified. Built for people who want to do this right.", {
    x: 4.44,
    y: 0.31,
    w: 2.95,
    h: 0.22,
    fontFace: "Plus Jakarta Sans",
    fontSize: 7.6,
    color: colors.muted,
    align: "right",
    margin: 0,
  });

  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

function addFooter(slide, index, total, kicker) {
  slide.addText(`0${index} / 0${total}`, {
    x: 0.65,
    y: 9.32,
    w: 0.72,
    h: 0.22,
    fontFace: "JetBrains Mono",
    fontSize: 8,
    color: colors.muted,
    margin: 0,
  });

  slide.addText(kicker, {
    x: 1.48,
    y: 9.3,
    w: 5.0,
    h: 0.24,
    fontFace: "Plus Jakarta Sans",
    fontSize: 8,
    color: colors.muted,
    margin: 0,
  });

  slide.addText("4/20 launch", {
    x: 6.4,
    y: 9.28,
    w: 0.95,
    h: 0.24,
    fontFace: "Plus Jakarta Sans",
    fontSize: 8.4,
    color: colors.goldSoft,
    bold: true,
    align: "right",
    margin: 0,
  });
}

function addQuoteBlock(slide, lines, opts = {}) {
  slide.addText(lines.join("\n"), {
    x: opts.x ?? 0.75,
    y: opts.y ?? 2.1,
    w: opts.w ?? 5.65,
    h: opts.h ?? 2.6,
    fontFace: "Playfair Display",
    fontSize: opts.fontSize ?? 25,
    bold: false,
    color: opts.color ?? colors.text,
    margin: 0,
    breakLine: false,
    valign: "mid",
    fit: "shrink",
  });
}

function addLabel(slide, text, x, y, w, fill, textColor = colors.text) {
  slide.addText(text, {
    x,
    y,
    w,
    h: 0.34,
    fontFace: "Plus Jakarta Sans",
    fontSize: 8,
    color: textColor,
    bold: true,
    align: "center",
    valign: "mid",
    fill: { color: fill, transparency: 6 },
    line: { color: fill, transparency: 100 },
    radius: 0.16,
    margin: { top: 0.08, right: 0.12, bottom: 0.08, left: 0.12 },
  });
}

function addBulletCard(slide, x, y, w, h, title, body, accent = colors.teal) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.12,
    line: { color: colors.line, pt: 1.1, transparency: 18 },
    fill: { color: colors.panel2, transparency: 6 },
    shadow: safeOuterShadow("000000", 0.18, 45, 1.2, 1.2),
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: x + 0.18,
    y: y + 0.18,
    w: 0.22,
    h: 0.22,
    rectRadius: 0.08,
    line: { color: accent, transparency: 100 },
    fill: { color: accent },
  });

  slide.addText(title, {
    x: x + 0.5,
    y: y + 0.13,
    w: w - 0.7,
    h: 0.34,
    fontFace: "Plus Jakarta Sans",
    fontSize: 12,
    bold: true,
    color: colors.text,
    margin: 0,
  });

  slide.addText(body, {
    x: x + 0.18,
    y: y + 0.62,
    w: w - 0.35,
    h: h - 0.78,
    fontFace: "Plus Jakarta Sans",
    fontSize: 10.2,
    color: colors.muted,
    valign: "top",
    margin: 0,
    fit: "shrink",
  });
}

function addStatBlock(slide, x, y, title, value, note, valueColor) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w: 2.1,
    h: 1.55,
    rectRadius: 0.12,
    line: { color: colors.line, pt: 1, transparency: 15 },
    fill: { color: colors.panel, transparency: 6 },
  });
  slide.addText(title, {
    x: x + 0.2,
    y: y + 0.18,
    w: 1.7,
    h: 0.22,
    fontFace: "Plus Jakarta Sans",
    fontSize: 8,
    color: colors.muted,
    bold: true,
    charSpace: 0.5,
    margin: 0,
  });
  slide.addText(value, {
    x: x + 0.2,
    y: y + 0.46,
    w: 1.7,
    h: 0.45,
    fontFace: "Playfair Display",
    fontSize: 22,
    color: valueColor,
    bold: true,
    margin: 0,
  });
  slide.addText(note, {
    x: x + 0.2,
    y: y + 1.04,
    w: 1.7,
    h: 0.26,
    fontFace: "Plus Jakarta Sans",
    fontSize: 8.2,
    color: colors.muted,
    margin: 0,
  });
}

// Slide 1
{
  const slide = pptx.addSlide();
  addBase(slide, {
    imagePath: assets.skyline,
    overlayTransparency: 38,
    topFadeTransparency: 62,
  });
  addLabel(slide, "BARCELONA • WEEK 1 LAUNCH", 0.72, 1.1, 1.9, colors.teal, colors.bg);
  addQuoteBlock(slide, ["Barcelona has clubs.", "Most people get the", "legal reality wrong."], {
    x: 0.72,
    y: 2.1,
    w: 5.1,
    h: 2.4,
    fontSize: 25.5,
  });
  slide.addText("That is exactly why SocialClubsMaps exists.", {
    x: 0.75,
    y: 4.95,
    w: 4.35,
    h: 0.34,
    fontFace: "Plus Jakarta Sans",
    fontSize: 11.5,
    color: colors.tealSoft,
    bold: true,
    margin: 0,
  });
  slide.addText(
    "Not for hype. Not for shortcuts. For visitors who want clarity, context, and a better filter before they trust anything.",
    {
      x: 0.75,
      y: 5.4,
      w: 4.6,
      h: 1.15,
      fontFace: "Plus Jakarta Sans",
      fontSize: 11.2,
      color: colors.text,
      margin: 0,
      fit: "shrink",
    }
  );
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.75,
    y: 7.15,
    w: 3.6,
    h: 1.0,
    rectRadius: 0.14,
    line: { color: colors.teal, pt: 1.2 },
    fill: { color: colors.panel, transparency: 12 },
  });
  slide.addText("Do it right, not fast.", {
    x: 0.98,
    y: 7.43,
    w: 2.2,
    h: 0.28,
    fontFace: "Plus Jakarta Sans",
    fontSize: 13.4,
    bold: true,
    color: colors.text,
    margin: 0,
  });
  slide.addText("Launching officially today.", {
    x: 0.98,
    y: 7.73,
    w: 2.1,
    h: 0.2,
    fontFace: "Plus Jakarta Sans",
    fontSize: 8.8,
    color: colors.muted,
    margin: 0,
  });
  addFooter(slide, 1, 6, "Read before you trust the wrong source.");
}

// Slide 2
{
  const slide = pptx.addSlide();
  addBase(slide);
  addLabel(slide, "WHY PEOPLE GET IT WRONG", 0.72, 1.08, 1.75, colors.gold, colors.bg);
  addQuoteBlock(slide, ["Most advice online", "collapses three", "different things"], {
    x: 0.72,
    y: 1.8,
    w: 4.55,
    h: 2.1,
    fontSize: 24,
  });
  addBulletCard(slide, 0.74, 4.5, 2.12, 2.1, "Law", "What Spanish law actually says, and where the risk begins.", colors.teal);
  addBulletCard(slide, 2.95, 4.5, 2.12, 2.1, "Practice", "What clubs, locals, and police often treat as normal.", colors.gold);
  addBulletCard(slide, 5.16, 4.5, 2.12, 2.1, "Policy", "What one specific club decides to allow, reject, or require.", colors.moss);
  slide.addShape(pptx.ShapeType.line, {
    x: 1.78,
    y: 6.84,
    w: 4.35,
    h: 0,
    line: { color: colors.line, pt: 1.1, transparency: 28 },
  });
  slide.addText("When people confuse those three, they either get overconfident or get played.", {
    x: 0.78,
    y: 7.08,
    w: 6.2,
    h: 0.42,
    fontFace: "Plus Jakarta Sans",
    fontSize: 12.6,
    color: colors.text,
    bold: true,
    margin: 0,
    align: "center",
  });
  addFooter(slide, 2, 6, "The point is not fear. The point is a better read.");
}

// Slide 3
{
  const slide = pptx.addSlide();
  addBase(slide, {
    imagePath: assets.legalFlags,
    overlayTransparency: 75,
    topFadeTransparency: 82,
  });
  addLabel(slide, "THE LEGAL REALITY", 0.72, 1.08, 1.38, colors.teal, colors.bg);
  addQuoteBlock(slide, ["Private is not public.", "Tolerated is not", "risk-free."], {
    x: 0.72,
    y: 1.78,
    w: 4.65,
    h: 2.1,
    fontSize: 24,
  });
  addStatBlock(slide, 0.74, 4.55, "PUBLIC-SPACE FINES", "EUR601-30000", "commonly cited range for public possession / use", colors.goldSoft);
  addStatBlock(slide, 2.98, 4.55, "BARCELONA 2024", "30 closures", "reported first closure orders in the city's campaign", colors.tealSoft);
  addStatBlock(slide, 5.22, 4.55, "MAIN RISK SIGNAL", "commercial look", "tourist-business behavior raises exposure", colors.danger);
  slide.addText("SCM is built to help you separate useful information from false confidence.", {
    x: 0.76,
    y: 7.18,
    w: 4.2,
    h: 0.42,
    fontFace: "Plus Jakarta Sans",
    fontSize: 11.6,
    color: colors.text,
    bold: true,
    margin: 0,
  });
  slide.addText("Information, not legal advice. Always verify club status independently.", {
    x: 0.76,
    y: 7.62,
    w: 4.75,
    h: 0.28,
    fontFace: "Plus Jakarta Sans",
    fontSize: 8.5,
    color: colors.muted,
    margin: 0,
  });
  addFooter(slide, 3, 6, "Clarity first. Confidence second.");
}

// Slide 4
{
  const slide = pptx.addSlide();
  addBase(slide, {
    imagePath: assets.vsAmsterdam,
    overlayTransparency: 48,
    topFadeTransparency: 60,
  });
  addLabel(slide, "BARCELONA IS NOT AMSTERDAM", 0.72, 1.08, 2.08, colors.gold, colors.bg);
  addQuoteBlock(slide, ["This city sits inside", "tourism pressure,", "commercial pressure,", "and local scrutiny."], {
    x: 0.72,
    y: 1.65,
    w: 4.55,
    h: 2.55,
    fontSize: 20.5,
  });
  addBulletCard(slide, 0.78, 5.15, 3.1, 1.78, "What bad content does", "Turns clubs into entertainment products for passing tourists.", colors.danger);
  addBulletCard(slide, 4.12, 5.15, 3.1, 1.78, "What better content does", "Explains the city, the tension, and why discretion matters.", colors.teal);
  slide.addText("That is the lane SCM is choosing from day one.", {
    x: 0.78,
    y: 7.55,
    w: 3.95,
    h: 0.3,
    fontFace: "Plus Jakarta Sans",
    fontSize: 11.5,
    color: colors.text,
    bold: true,
    margin: 0,
  });
  addFooter(slide, 4, 6, "The category does not need more hype.");
}

// Slide 5
{
  const slide = pptx.addSlide();
  addBase(slide, {
    imagePath: assets.city,
    overlayTransparency: 78,
    topFadeTransparency: 82,
  });
  addLabel(slide, "WHY SCM EXISTS", 0.72, 1.08, 1.25, colors.teal, colors.bg);
  addQuoteBlock(slide, ["A small verified set", "beats a giant", "unvetted list."], {
    x: 0.72,
    y: 1.78,
    w: 4.5,
    h: 2.15,
    fontSize: 24,
  });
  addBulletCard(slide, 0.76, 4.55, 3.12, 1.63, "Registry & statutes", "Does the club still look like a private association, not a public-facing shop?", colors.teal);
  addBulletCard(slide, 4.08, 4.55, 3.12, 1.63, "Physical & access posture", "Does the place behave with discretion, controlled access, and basic seriousness?", colors.gold);
  addBulletCard(slide, 0.76, 6.43, 3.12, 1.63, "Onboarding sanity", "Does the process feel responsible, or does it scream shortcut culture?", colors.moss);
  addBulletCard(slide, 4.08, 6.43, 3.12, 1.63, "Ongoing trust", "Would we still feel good sending a careful visitor there tomorrow?", colors.tealSoft);
  addFooter(slide, 5, 6, "Selected, never bought.");
}

// Slide 6
{
  const slide = pptx.addSlide();
  addBase(slide, {
    imagePath: assets.skyline,
    overlayTransparency: 46,
    topFadeTransparency: 60,
  });
  addLabel(slide, "OFFICIAL LAUNCH", 0.72, 1.08, 1.14, colors.gold, colors.bg);
  addQuoteBlock(slide, ["Launching officially", "today.", "4/20 felt fitting."], {
    x: 0.72,
    y: 1.84,
    w: 4.42,
    h: 2.25,
    fontSize: 23,
  });
  slide.addText("If Barcelona is on your radar, start with the map built for people who want to do this right, not fast.", {
    x: 0.76,
    y: 4.9,
    w: 4.55,
    h: 1.0,
    fontFace: "Plus Jakarta Sans",
    fontSize: 12.6,
    color: colors.text,
    margin: 0,
    fit: "shrink",
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.76,
    y: 6.35,
    w: 4.35,
    h: 1.32,
    rectRadius: 0.14,
    line: { color: colors.teal, pt: 1.5 },
    fill: { color: colors.panel, transparency: 8 },
    shadow: safeOuterShadow("000000", 0.16, 45, 1.1, 1.1),
  });
  slide.addText("socialclubsmaps.com", {
    x: 1.02,
    y: 6.68,
    w: 2.7,
    h: 0.26,
    fontFace: "Plus Jakarta Sans",
    fontSize: 16,
    bold: true,
    color: colors.text,
    margin: 0,
  });
  slide.addText("Start with the Safety Kit. Then move smarter.", {
    x: 1.02,
    y: 7.06,
    w: 2.9,
    h: 0.22,
    fontFace: "Plus Jakarta Sans",
    fontSize: 9.2,
    color: colors.muted,
    margin: 0,
  });
  slide.addText("@socialclubsmaps", {
    x: 5.65,
    y: 8.1,
    w: 1.45,
    h: 0.2,
    fontFace: "JetBrains Mono",
    fontSize: 8.2,
    color: colors.muted,
    margin: 0,
    align: "right",
  });
  addFooter(slide, 6, 6, "Built for people who want a better filter.");
}

const outputPath = path.join(outDir, "scm-week1-launch-carousel.pptx");
pptx.writeFile({ fileName: outputPath });
