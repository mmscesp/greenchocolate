export type ScmIgTemplateKind =
  | "explainer"
  | "audit"
  | "blueprint"
  | "debunk"
  | "spotlight"
  | "single-post";

export type ScmIgTemplateDefinition = {
  slug: ScmIgTemplateKind;
  label: string;
  category: "carousel" | "single-post";
  aspectRatio: "1:1" | "4:5";
  status: "ready" | "planned";
  previewPath: string;
  defaultOutputFolder: string;
  sourceDirectory: string;
  notes: string;
};

export const SCM_IG_TEMPLATES: ScmIgTemplateDefinition[] = [
  {
    slug: "explainer",
    label: "The Explainer",
    category: "carousel",
    aspectRatio: "1:1",
    status: "ready",
    previewPath: "/en/scm-ig-preview",
    defaultOutputFolder: "explainer",
    sourceDirectory: "C:/Users/ousss/Projects/SCM/scm-ig-template",
    notes:
      "Contextual deep dive carousel. Current production-ready template and render baseline.",
  },
  {
    slug: "audit",
    label: "The Audit",
    category: "carousel",
    aspectRatio: "1:1",
    status: "ready",
    previewPath: "/en/scm-ig-preview/audit",
    defaultOutputFolder: "audit",
    sourceDirectory: "C:/Users/ousss/Projects/SCM/scm-ig-templates/New folder",
    notes: "4-slide red flags checklist carousel with saffron warning styling.",
  },
  {
    slug: "blueprint",
    label: "The Blueprint",
    category: "carousel",
    aspectRatio: "1:1",
    status: "ready",
    previewPath: "/en/scm-ig-preview/blueprint",
    defaultOutputFolder: "blueprint",
    sourceDirectory: "C:/Users/ousss/Projects/SCM/scm-ig-templates/New folder",
    notes: "4-slide data-drop carousel with brutalist blueprint/stat treatment.",
  },
  {
    slug: "debunk",
    label: "The Debunk",
    category: "carousel",
    aspectRatio: "1:1",
    status: "ready",
    previewPath: "/en/scm-ig-preview/debunk",
    defaultOutputFolder: "debunk",
    sourceDirectory: "C:/Users/ousss/Projects/SCM/scm-ig-templates/New folder",
    notes: "3-slide myth-vs-reality split-screen comparison carousel.",
  },
  {
    slug: "spotlight",
    label: "The Spotlight",
    category: "carousel",
    aspectRatio: "1:1",
    status: "ready",
    previewPath: "/en/scm-ig-preview/spotlight",
    defaultOutputFolder: "spotlight",
    sourceDirectory: "C:/Users/ousss/Projects/SCM/scm-ig-templates/New folder",
    notes: "5-slide area spotlight carousel with visual listicle framing.",
  },
  {
    slug: "single-post",
    label: "Single Post",
    category: "single-post",
    aspectRatio: "4:5",
    status: "ready",
    previewPath: "/en/scm-ig-preview/single-post",
    defaultOutputFolder: "single-post",
    sourceDirectory: "C:/Users/ousss/Projects/SCM/scm-ig-templates/New folder",
    notes: "Single 4:5 typographic statement or quote post.",
  },
];

export function getScmIgTemplate(slug: string) {
  return SCM_IG_TEMPLATES.find((template) => template.slug === slug);
}
