import { LinkCards } from "../_components/LinkCards";
import { PageShell } from "../_components/PageShell";

export default function IntelligenceLandingPage() {
  return (
    <PageShell
      title="PRD-005 Intelligence"
      description="Personal Transformation Intelligence Engine (UI scaffold)."
    >
      <LinkCards
        items={[
          {
            href: "/intelligence/goals",
            title: "Goal Selection",
            description: "Pilih tujuan transformasi.",
          },
          {
            href: "/intelligence/persona",
            title: "Persona Selection",
            description: "Pilih persona / gaya target.",
          },
          {
            href: "/intelligence/recommendations",
            title: "Recommendations",
            description: "Rekomendasi personal (mock).",
          },
          {
            href: "/intelligence/coach",
            title: "Coach",
            description: "AI coach (mock).",
          },
        ]}
      />
    </PageShell>
  );
}

