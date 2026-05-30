import type { Template } from "../jobs/types";

export const templates: Template[] = [
  {
    id: "makeup-tutorial-v1",
    title: "Makeup Tutorial (V1)",
    description: "Tutorial pendek 9:16 untuk audience profesional, step-by-step, clean lighting.",
    fields: [
      { key: "topic", label: "Topic", type: "text", required: true },
      { key: "platform", label: "Platform", type: "select", required: true, options: ["TikTok", "Instagram Reels", "YouTube Shorts"] },
      { key: "tone", label: "Tone", type: "select", required: true, options: ["Educational", "Professional", "Friendly", "Luxury"] },
      { key: "steps", label: "Steps (1 per line)", type: "list", required: true },
      { key: "sceneDurationSec", label: "Durasi per scene (detik)", type: "select", required: true, options: ["5", "6", "7", "8", "9", "10"] },
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
      "Scene {sceneIndex}/{sceneTotal}: {scene}. Makeup tutorial: {topic}. Full steps: {steps}. Tone: {tone}. Platform: {platform}. Aspect ratio {aspectRatio}. Clean studio lighting, close-up shots, clear text overlays, crisp cuts, professional look.",
  },
];
