import type {
  MarketingImageAsset,
  MarketingJobInput,
  MarketingVideoAsset,
} from "./types";

function compactSentence(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

function joinList(values: string[]) {
  return values
    .map((value) => compactSentence(value))
    .filter(Boolean)
    .join(", ");
}

function buildStoryboardSequence(storyboard: string[]) {
  return storyboard
    .map((scene, index) => `Scene ${index + 1}: ${compactSentence(scene)}.`)
    .filter(Boolean)
    .join(" ");
}

export function buildMarketingImageAssets(input: MarketingJobInput) {
  return input.imageShots
    .map((shot, index): MarketingImageAsset => {
      const cleanedShot = compactSentence(shot);

      return {
        id: `image_${index + 1}`,
        title: cleanedShot || `Image ${index + 1}`,
        status: "queued",
        prompt: [
          `Landing page marketing still for ${input.productName}.`,
          `Campaign: ${input.campaignName}.`,
          `Audience: ${input.audience}.`,
          `Page goal: ${input.pageGoal}.`,
          `Value proposition: ${input.valueProp}.`,
          `CTA message: ${input.cta}.`,
          `Visual direction: ${input.visualStyle}.`,
          `Brand notes: ${input.brandNotes}.`,
          `Shot focus: ${cleanedShot}.`,
          "Luxury editorial composition, premium product marketing, refined lighting, highly usable as landing page visual.",
        ].join(" "),
      };
    })
    .slice(0, 4);
}

export function buildMarketingVideoAssets(input: MarketingJobInput) {
  return input.videoBeats
    .map((beat, index): MarketingVideoAsset => {
      const cleanedBeat = compactSentence(beat);
      const storyboard = input.videoStoryboard
        .map((scene) => compactSentence(scene))
        .filter(Boolean)
        .slice(0, 6);
      const storyMode = input.videoStoryMode;

      return {
        id: `video_${index + 1}`,
        title: cleanedBeat || `Video ${index + 1}`,
        storyMode,
        storyboard,
        status: "queued",
        prompt: [
          `Landing page marketing video clip for ${input.productName}.`,
          `Campaign: ${input.campaignName}.`,
          `Audience: ${input.audience}.`,
          `Page goal: ${input.pageGoal}.`,
          `Value proposition: ${input.valueProp}.`,
          `CTA message: ${input.cta}.`,
          `Visual direction: ${input.visualStyle}.`,
          `Brand notes: ${input.brandNotes}.`,
          `Scene beat: ${cleanedBeat}.`,
          `Supporting visual system: ${joinList(input.imageShots)}.`,
          storyMode === "multi-shot"
            ? `Use multi-shot storytelling with clear sequential scenes for easy stitching. ${buildStoryboardSequence(
                storyboard,
              )}`
            : "Use a single continuous cinematic shot with refined camera choreography and a coherent emotional arc.",
          "Create a premium, high-conversion landing page hero clip with elegant motion, refined camera movement, and editorial product storytelling.",
        ].join(" "),
      };
    })
    .slice(0, 4);
}
