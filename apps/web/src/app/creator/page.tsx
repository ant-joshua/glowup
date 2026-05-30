import { LinkCards } from "../_components/LinkCards";
import { PageShell } from "../_components/PageShell";

export default function CreatorLandingPage() {
  return (
    <PageShell
      title="PRD-002 Creator"
      description="Creator Economy & Community Platform (UI scaffold)."
    >
      <LinkCards
        items={[
          {
            href: "/creator/profile",
            title: "Creator Profile",
            description: "Profil creator, bio, stats, dan badge.",
          },
          {
            href: "/creator/routines",
            title: "Routine List",
            description: "Daftar routines yang dibuat/disimpan.",
          },
          {
            href: "/creator/routines/new",
            title: "Routine Editor",
            description: "Form editor untuk membuat routine baru.",
          },
          {
            href: "/creator/feed",
            title: "Feed",
            description: "Timeline konten dan update creator.",
          },
        ]}
      />
    </PageShell>
  );
}

