import { LinkCards } from "../_components/LinkCards";
import { PageShell } from "../_components/PageShell";

export default function AiStudioLandingPage() {
  return (
    <PageShell
      title="PRD-004 AI Studio"
      description="AI Video Studio & UGC Generation (UI scaffold)."
    >
      <LinkCards
        items={[
          {
            href: "/ai-studio/marketing",
            title: "Marketing Asset Playground",
            description:
              "Generate landing page videos and images via PixVerse CLI with docs JSON archive.",
          },
          {
            href: "/ai-studio/videos/skincare",
            title: "Skincare Video Studio",
            description: "Focused flow for skincare-step video generation.",
          },
          {
            href: "/ai-studio/videos/outfit",
            title: "Outfit Video Studio",
            description:
              "Dedicated flow for outfit generator video experiments.",
          },
          {
            href: "/ai-studio/videos/try-on",
            title: "Try-On Motion Studio",
            description: "Dedicated flow for user try-on motion studies.",
          },
          {
            href: "/ai-studio/script",
            title: "Script Generator",
            description: "Generate script untuk video.",
          },
          {
            href: "/ai-studio/storyboard",
            title: "Storyboard Generator",
            description: "Generate storyboard untuk produksi.",
          },
          {
            href: "/ai-studio/videos",
            title: "Videos",
            description: "Daftar video yang dihasilkan (mock).",
          },
        ]}
      />
    </PageShell>
  );
}
