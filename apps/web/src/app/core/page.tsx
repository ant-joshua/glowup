import { LinkCards } from "../_components/LinkCards";
import { PageShell } from "../_components/PageShell";

export default function CoreLandingPage() {
  return (
    <PageShell
      title="PRD-001 Core"
      description="Core Platform & AI Transformation Engine (UI scaffold)."
    >
      <LinkCards
        items={[
          {
            href: "/core/profile",
            title: "Profile",
            description: "Informasi dasar user dan preferensi.",
          },
          {
            href: "/core/analysis",
            title: "AI Analysis",
            description: "Ringkasan analisis dan insight awal.",
          },
          {
            href: "/core/roadmap",
            title: "Roadmap",
            description: "Rencana transformasi (milestones & steps).",
          },
          {
            href: "/core/progress",
            title: "Progress",
            description: "Tracking progres dan pencapaian.",
          },
        ]}
      />
    </PageShell>
  );
}

