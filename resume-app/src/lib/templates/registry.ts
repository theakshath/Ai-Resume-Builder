/**
 * TEMPLATE REGISTRY — Single source of truth for all resume template IDs.
 *
 * Every template in the Templates page must have a stable entry here.
 * The builder, preview, PDF export, and Firestore all use these IDs.
 *
 * visualStyle maps to the 4 actual rendering themes in LiveResumePaperPreview.
 */

export type VisualTemplateStyle = "modern" | "executive" | "minimalist" | "creative";

export const DEFAULT_TEMPLATE_ID = "modern-professional";

export interface TemplateRegistryEntry {
  id: string;
  name: string;
  /** Which of the 4 live-preview rendering themes to use */
  visualStyle: VisualTemplateStyle;
}

/**
 * Full registry of all templates available in the application.
 * The Templates page IDs must exactly match these IDs.
 */
export const TEMPLATE_REGISTRY: TemplateRegistryEntry[] = [
  // ── Modern ──────────────────────────────────────────────────────────
  { id: "modern-professional",  name: "Modern Professional",       visualStyle: "modern" },
  { id: "dark-professional",    name: "Dark Professional",         visualStyle: "creative" },
  { id: "modern-gradient",      name: "Modern Gradient",           visualStyle: "modern" },
  { id: "modern-tech",          name: "Modern Tech",               visualStyle: "modern" },

  // ── Minimal ─────────────────────────────────────────────────────────
  { id: "minimal-clean",        name: "Minimal Clean",             visualStyle: "minimalist" },
  { id: "minimalist-mono",      name: "Minimalist Mono",           visualStyle: "minimalist" },
  { id: "ats-standard",         name: "ATS Universal Standard",    visualStyle: "minimalist" },
  { id: "academic",             name: "Academic",                  visualStyle: "minimalist" },

  // ── Professional / Executive ─────────────────────────────────────────
  { id: "elegant-classic",      name: "Elegant Classic",           visualStyle: "executive" },
  { id: "executive-clean",      name: "Executive Clean",           visualStyle: "executive" },
  { id: "business-professional",name: "Business Professional",     visualStyle: "executive" },

  // ── Tech ─────────────────────────────────────────────────────────────
  { id: "tech-elite",           name: "Tech Elite",                visualStyle: "creative" },
  { id: "tech-specialist",      name: "Tech Specialist",           visualStyle: "modern" },
  { id: "bold-modern",          name: "Bold Modern",               visualStyle: "modern" },

  // ── Creative ────────────────────────────────────────────────────────
  { id: "creative-sidebar",     name: "Creative Sidebar",          visualStyle: "creative" },
  { id: "creative-modern",      name: "Creative Modern",           visualStyle: "creative" },
  { id: "creative-bold",        name: "Creative Bold",             visualStyle: "creative" },
  { id: "creative-elegant",     name: "Creative Elegant",          visualStyle: "creative" },
];

/** Fast O(1) lookup map: templateId → TemplateRegistryEntry */
export const TEMPLATE_MAP: Record<string, TemplateRegistryEntry> = Object.fromEntries(
  TEMPLATE_REGISTRY.map((t) => [t.id, t])
);

/**
 * Resolve a raw template ID (from URL param, Firestore, etc.) to a
 * canonical registry entry.  Falls back to the default if unknown.
 */
export function resolveTemplate(templateId: string | null | undefined): TemplateRegistryEntry {
  if (templateId && TEMPLATE_MAP[templateId]) {
    return TEMPLATE_MAP[templateId];
  }
  // Legacy: if someone saved a raw visualStyle value ("modern", "executive", etc.)
  // before the registry existed, map it to the default template for that style.
  const legacyMap: Record<string, string> = {
    modern:     "modern-professional",
    executive:  "executive-clean",
    minimalist: "minimalist-mono",
    creative:   "creative-sidebar",
  };
  if (templateId && legacyMap[templateId]) {
    return TEMPLATE_MAP[legacyMap[templateId]]!;
  }
  return TEMPLATE_MAP[DEFAULT_TEMPLATE_ID]!;
}

/** Get the visual rendering style for any template ID. */
export function getVisualStyle(templateId: string | null | undefined): VisualTemplateStyle {
  return resolveTemplate(templateId).visualStyle;
}
