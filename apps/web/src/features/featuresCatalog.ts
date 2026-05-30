export type FeatureDemo = {
  templateId: string;
  variables: Record<string, unknown>;
};

export type FeatureItem = {
  slug: string;
  title: string;
  description: string;
  icon: "scan-face" | "shirt" | "briefcase" | "users" | "video" | "shopping-bag";
  demo: FeatureDemo;
};

export const featuresCatalog: FeatureItem[] = [
  {
    slug: "ai-personal-analysis",
    title: "AI Personal Analysis",
    description:
      "Deep breakdowns of your face, skin, style, and grooming to establish a confident baseline.",
    icon: "scan-face",
    demo: {
      templateId: "douyin-makeup-editorial-v1",
      variables: {
        lookName: "Professional glow-up baseline",
        skinFinish: "Natural",
        platform: "Douyin",
        tone: "Educational",
        sceneDurationSec: "6",
        steps: [
          "Hook: selfie upload → scan overlay",
          "Insight: skin concern + face structure callouts",
          "Routine: 3-step plan highlight",
          "Roadmap: timeline + habit tracker reveal",
          "CTA: save + follow",
        ],
      },
    },
  },
  {
    slug: "outfit-beauty-intelligence",
    title: "Outfit & Beauty Intelligence",
    description:
      "Smart wardrobe planners, outfit generators, and custom routines tailored to your life and budget.",
    icon: "shirt",
    demo: {
      templateId: "outfit-styling-editorial-v1",
      variables: {
        occasion: "Office days + client meetings",
        styleDirection: "Modern Tailored",
        platform: "Douyin",
        mood: "Confident",
        sceneDurationSec: "6",
        pieces: [
          "Neutral blazer + tank top",
          "Straight-leg trousers",
          "Minimal sneakers → switch to loafers",
          "Structured tote + subtle jewelry",
          "Before/after silhouette reveal",
        ],
        stylingNotes: "Keep palette monochrome, focus on fit, show 1 quick accessory swap.",
      },
    },
  },
  {
    slug: "personal-branding-os",
    title: "Personal Branding OS",
    description:
      "LinkedIn optimization, social audits, and professional persona development with measurable checkpoints.",
    icon: "briefcase",
    demo: {
      templateId: "skincare-routine-editorial-v1",
      variables: {
        concern: "On-camera confidence (bright, fresh, non-greasy)",
        skinType: "Combination",
        platform: "Douyin",
        tone: "Editorial",
        heroProduct: "SPF + blur primer",
        sceneDurationSec: "6",
        steps: [
          "Hook: pro look in 30s",
          "Prep: hydration + SPF",
          "Base: blur + spot concealer",
          "Finish: setting + lip tint",
          "CTA: save + comment your skin type",
        ],
      },
    },
  },
  {
    slug: "creator-community",
    title: "Creator Community",
    description:
      "Follow and adopt real routines from top influencers and beauty experts—then remix for your own journey.",
    icon: "users",
    demo: {
      templateId: "douyin-makeup-editorial-v1",
      variables: {
        lookName: "Creator routine remix",
        skinFinish: "Glowy",
        platform: "Douyin",
        tone: "Friendly",
        sceneDurationSec: "6",
        steps: [
          "Hook: creator routine snapshot",
          "Step 1: prep",
          "Step 2: base + blush",
          "Step 3: eyes + lip",
          "CTA: follow + save",
        ],
      },
    },
  },
  {
    slug: "ai-video-studio",
    title: "AI Video Studio",
    description:
      "Auto-generated tutorials and UGC creation tools to help you build your audience and test hooks fast.",
    icon: "video",
    demo: {
      templateId: "douyin-makeup-editorial-v1",
      variables: {
        lookName: "Douyin commuting no-makeup look",
        skinFinish: "Soft Matte",
        platform: "Douyin",
        tone: "Educational",
        sceneDurationSec: "6",
        steps: [
          "Hook: before/after cepat",
          "Prep: skincare + sunscreen",
          "Base: concealer lokal + base tipis",
          "Eyes+Brow: natural lift",
          "Finish: blush + lip + CTA",
        ],
      },
    },
  },
  {
    slug: "affiliate-commerce",
    title: "Affiliate Commerce",
    description:
      "Shop directly via marketplaces and track conversion—tight loop from content → product → revenue.",
    icon: "shopping-bag",
    demo: {
      templateId: "virtual-try-on-motion-v1",
      variables: {
        garmentFocus: "Blazer fit + trousers drape",
        persona: "Young professional (Jakarta)",
        platform: "Douyin",
        movement: "Turnaround",
        sceneDurationSec: "6",
        fitHighlights: [
          "Shoulder structure",
          "Waist shaping",
          "Pant hem length",
          "Bag + shoes swap",
          "Checkout CTA overlay",
        ],
        stylingNotes: "Include subtle price tag overlay and quick product highlight cuts.",
      },
    },
  },
];

