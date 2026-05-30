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

