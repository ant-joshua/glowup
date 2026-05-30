import type { Template } from "../jobs/types";

export const templates: Template[] = [
  {
    id: "glowup-investor-demo-landscape-v1",
    title: "GlowUp Investor Demo (Landscape)",
    description:
      "Multi-scene investor-ready montage covering GlowUp analysis, skincare, outfits, brand growth, creators, and commerce.",
    fields: [
      {
        key: "platform",
        label: "Platform",
        type: "select",
        required: true,
        options: ["Landing Page", "Investor Deck", "YouTube"],
      },
      {
        key: "tone",
        label: "Tone",
        type: "select",
        required: true,
        options: ["Editorial", "Confident", "Cinematic", "Minimal"],
      },
      { key: "steps", label: "Storyboard scenes", type: "list", required: true },
      {
        key: "sceneDurationSec",
        label: "Scene duration",
        type: "select",
        required: true,
        options: ["5", "6", "7", "8", "9", "10"],
      },
    ],
    defaults: {
      model: "v6",
      quality: "720p",
      aspectRatio: "16:9",
      durationSec: 6,
      audio: true,
      multiShot: true,
    },
    promptTemplate:
      "Scene {sceneIndex}/{sceneTotal}: {scene}. Investor demo montage for GlowUp. Show premium editorial product storytelling that clearly communicates the product in under one minute. Cover: selfie upload, face analysis overlays, skincare ritual design, outfit intelligence, personal branding glow-up, creator routine feed, affiliate commerce checkout, and a confident CTA. Tone: {tone}. Platform: {platform}. Aspect ratio {aspectRatio}. Clean premium UI overlays, warm cream palette, terracotta accents, smooth camera language, tasteful motion graphics.",
  },
  {
    id: "skincare-routine-editorial-v1",
    title: "Skincare Routine Editorial",
    description:
      "Beauty-first routine breakdown for testing future skincare-step generation flows.",
    fields: [
      { key: "concern", label: "Skin concern", type: "text", required: true },
      {
        key: "skinType",
        label: "Skin type",
        type: "select",
        required: true,
        options: ["Combination", "Dry", "Oily", "Sensitive"],
      },
      {
        key: "platform",
        label: "Platform",
        type: "select",
        required: true,
        options: ["Douyin", "TikTok", "Instagram Reels", "YouTube Shorts"],
      },
      {
        key: "tone",
        label: "Tone",
        type: "select",
        required: true,
        options: ["Clinical", "Editorial", "Soft Luxury", "Friendly"],
      },
      { key: "heroProduct", label: "Hero product", type: "text" },
      { key: "steps", label: "Routine steps", type: "list", required: true },
      {
        key: "sceneDurationSec",
        label: "Scene duration",
        type: "select",
        required: true,
        options: ["5", "6", "7", "8", "9", "10"],
      },
    ],
    defaults: {
      model: "v6",
      quality: "720p",
      aspectRatio: "9:16",
      durationSec: 6,
      audio: true,
      multiShot: true,
    },
    promptTemplate:
      "Scene {sceneIndex}/{sceneTotal}: {scene}. Premium skincare routine for {skinType} skin focused on {concern}. Hero product: {heroProduct}. Full steps: {steps}. Tone: {tone}. Platform: {platform}. Aspect ratio {aspectRatio}. Soft vanity lighting, editorial beauty close-ups, elegant overlays, aspirational but practical rhythm.",
  },
  {
    id: "outfit-styling-editorial-v1",
    title: "Outfit Styling Editorial",
    description:
      "Wardrobe storytelling template for testing future outfit generator and styling flows.",
    fields: [
      { key: "occasion", label: "Occasion", type: "text", required: true },
      {
        key: "styleDirection",
        label: "Style direction",
        type: "select",
        required: true,
        options: ["Minimal", "Power Dressing", "Soft Feminine", "Modern Tailored"],
      },
      {
        key: "platform",
        label: "Platform",
        type: "select",
        required: true,
        options: ["Douyin", "TikTok", "Instagram Reels", "YouTube Shorts"],
      },
      {
        key: "mood",
        label: "Model mood",
        type: "select",
        required: true,
        options: ["Confident", "Relaxed", "Luxury", "Playful"],
      },
      { key: "pieces", label: "Wardrobe pieces", type: "list", required: true },
      { key: "stylingNotes", label: "Styling notes", type: "textarea" },
      {
        key: "sceneDurationSec",
        label: "Scene duration",
        type: "select",
        required: true,
        options: ["5", "6", "7", "8", "9", "10"],
      },
    ],
    defaults: {
      model: "v6",
      quality: "720p",
      aspectRatio: "9:16",
      durationSec: 6,
      audio: true,
      multiShot: true,
    },
    promptTemplate:
      "Scene {sceneIndex}/{sceneTotal}: {scene}. Build an editorial outfit story for {occasion}. Style direction: {styleDirection}. Mood: {mood}. Key pieces: {pieces}. Styling notes: {stylingNotes}. Platform: {platform}. Aspect ratio {aspectRatio}. Full-body shots, texture details, smooth transitions, premium fashion film energy.",
  },
  {
    id: "douyin-makeup-editorial-v1",
    title: "Douyin Makeup Editorial",
    description:
      "Makeup tutorial multi-scene template optimized for Douyin pacing and vertical framing.",
    fields: [
      { key: "lookName", label: "Look name", type: "text", required: true },
      {
        key: "skinFinish",
        label: "Skin finish",
        type: "select",
        required: true,
        options: ["Natural", "Soft Matte", "Glowy"],
      },
      {
        key: "platform",
        label: "Platform",
        type: "select",
        required: true,
        options: ["Douyin", "TikTok", "Instagram Reels", "YouTube Shorts"],
      },
      {
        key: "tone",
        label: "Tone",
        type: "select",
        required: true,
        options: ["Educational", "Confident", "Friendly", "Luxury"],
      },
      { key: "steps", label: "Makeup steps", type: "list", required: true },
      {
        key: "sceneDurationSec",
        label: "Scene duration",
        type: "select",
        required: true,
        options: ["5", "6", "7", "8", "9", "10"],
      },
    ],
    defaults: {
      model: "v6",
      quality: "720p",
      aspectRatio: "9:16",
      durationSec: 6,
      audio: true,
      multiShot: true,
    },
    promptTemplate:
      "Scene {sceneIndex}/{sceneTotal}: {scene}. Douyin makeup tutorial for look: {lookName}. Skin finish: {skinFinish}. Full steps: {steps}. Tone: {tone}. Platform: {platform}. Aspect ratio {aspectRatio}. Clean vanity lighting, close-up texture shots, quick cuts, minimal but premium on-screen text, satisfying before/after reveal.",
  },
  {
    id: "virtual-try-on-motion-v1",
    title: "Virtual Try-On Motion",
    description:
      "Motion study playground for future user try-on video and digital fitting experiences.",
    fields: [
      { key: "garmentFocus", label: "Garment focus", type: "text", required: true },
      { key: "persona", label: "Persona", type: "text", required: true },
      {
        key: "platform",
        label: "Platform",
        type: "select",
        required: true,
        options: ["Douyin", "TikTok", "Instagram Reels", "YouTube Shorts"],
      },
      {
        key: "movement",
        label: "Movement direction",
        type: "select",
        required: true,
        options: ["Walk-in reveal", "Turnaround", "Mirror check", "Runway glide"],
      },
      { key: "fitHighlights", label: "Fit highlights", type: "list", required: true },
      { key: "stylingNotes", label: "Scene notes", type: "textarea" },
      {
        key: "sceneDurationSec",
        label: "Scene duration",
        type: "select",
        required: true,
        options: ["5", "6", "7", "8", "9", "10"],
      },
    ],
    defaults: {
      model: "v6",
      quality: "720p",
      aspectRatio: "9:16",
      durationSec: 6,
      audio: true,
      multiShot: true,
    },
    promptTemplate:
      "Scene {sceneIndex}/{sceneTotal}: {scene}. Create a virtual try-on motion study for {persona} featuring {garmentFocus}. Movement: {movement}. Fit highlights: {fitHighlights}. Styling notes: {stylingNotes}. Platform: {platform}. Aspect ratio {aspectRatio}. Mirror-friendly framing, realistic fabric motion, confident body language, premium fitting-room atmosphere.",
  },
];
