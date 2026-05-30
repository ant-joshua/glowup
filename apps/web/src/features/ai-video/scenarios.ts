export type AiVideoScenario = {
  slug: "skincare" | "outfit" | "try-on";
  route: string;
  templateId: string;
  pageTitle: string;
  pageDescription: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  intro: string;
  outcome: string;
  notes: string[];
  seededValues: Record<string, string>;
};

export const AI_VIDEO_SCENARIOS: Record<AiVideoScenario["slug"], AiVideoScenario> = {
  skincare: {
    slug: "skincare",
    route: "/ai-studio/videos/skincare",
    templateId: "skincare-routine-editorial-v1",
    pageTitle: "Skincare Video Studio",
    pageDescription:
      "Prototype a future skincare-step generator using the shared AI video engine.",
    breadcrumbLabel: "← Kembali ke AI Video Playground",
    eyebrow: "Skin Ritual Director",
    title: "Turn routines into polished skincare narratives.",
    intro:
      "This focused studio keeps the reusable video logic underneath, but gives skincare planning its own editorial surface for testing tone, sequence, and beauty framing.",
    outcome: "Best for guided routines, beauty tips, and step-by-step ritual videos.",
    notes: [
      "Start from a real skin concern and keep each step visually distinct.",
      "Use the tone field to test whether the routine should feel clinical, soft luxury, or editorial.",
      "Treat the hero product as the emotional anchor of the sequence.",
    ],
    seededValues: {
      concern: "Post-acne marks with uneven texture",
      skinType: "Combination",
      platform: "TikTok",
      tone: "Editorial",
      heroProduct: "Barrier Repair Serum",
      steps: "Double cleanse\nHydrating toner\nBarrier repair serum\nMoisturizer\nSPF finish",
      sceneDurationSec: "6",
    },
  },
  outfit: {
    slug: "outfit",
    route: "/ai-studio/videos/outfit",
    templateId: "outfit-styling-editorial-v1",
    pageTitle: "Outfit Video Studio",
    pageDescription:
      "Prototype a future outfit generator using the shared AI video engine.",
    breadcrumbLabel: "← Kembali ke AI Video Playground",
    eyebrow: "Outfit Story Generator",
    title: "Translate styling logic into premium outfit motion.",
    intro:
      "This studio isolates the fashion use case so you can refine occasion, mood, and layering decisions before the dedicated outfit generator ships.",
    outcome: "Best for day-to-night styling, capsule wardrobe flows, and occasion-based looks.",
    notes: [
      "List wardrobe pieces in the exact order they should reveal on camera.",
      "Use style direction to test how strong the system should steer aesthetic choices.",
      "Add styling notes when you want texture, fit, or accessory callouts to shape the prompt.",
    ],
    seededValues: {
      occasion: "Creative agency office to dinner",
      styleDirection: "Modern Tailored",
      platform: "Instagram Reels",
      mood: "Confident",
      pieces: "Ivory blazer\nSilk camisole\nWide-leg trousers\nLeather belt\nGold earrings",
      stylingNotes:
        "Keep the silhouette clean, premium, and confident with fabric movement close-ups.",
      sceneDurationSec: "6",
    },
  },
  "try-on": {
    slug: "try-on",
    route: "/ai-studio/videos/try-on",
    templateId: "virtual-try-on-motion-v1",
    pageTitle: "Try-On Motion Studio",
    pageDescription:
      "Prototype a future user try-on video feature using the shared AI video engine.",
    breadcrumbLabel: "← Kembali ke AI Video Playground",
    eyebrow: "Virtual Try-On Motion",
    title: "Study motion language for digital fitting and garment reveal.",
    intro:
      "This surface is for the next step after static outfit generation: seeing how the user could move, turn, and present a selected garment in video.",
    outcome: "Best for virtual fitting, movement testing, and try-on storytelling.",
    notes: [
      "Use movement direction to test whether the render feels natural for try-on previews.",
      "Fit highlights should focus on silhouette, drape, and comfort cues the user cares about.",
      "Scene notes are where you define mirror, runway, or walk-in framing language.",
    ],
    seededValues: {
      garmentFocus: "Sand oversized blazer with tailored trousers",
      persona: "Young professional building a polished work wardrobe",
      platform: "TikTok",
      movement: "Walk-in reveal",
      fitHighlights: "Shoulder structure\nWaist balance\nTrouser drape\nComfort while walking",
      stylingNotes:
        "Use mirror-friendly framing, soft luxury lighting, and a confident but natural pace.",
      sceneDurationSec: "6",
    },
  },
};
