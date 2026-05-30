import { LinkCards } from "../_components/LinkCards";
import { PageShell } from "../_components/PageShell";

export default function ClinicLandingPage() {
  return (
    <PageShell
      title="PRD-006 Clinic"
      description="Clinic, Professional Services & Expert Marketplace (UI scaffold)."
    >
      <LinkCards
        items={[
          {
            href: "/clinic/search",
            title: "Search",
            description: "Cari expert/clinic berdasarkan kebutuhan.",
          },
          {
            href: "/clinic/experts/dr-001",
            title: "Expert Profile",
            description: "Detail profile expert (dynamic route).",
          },
          {
            href: "/clinic/booking",
            title: "Booking",
            description: "Flow pemesanan slot (mock).",
          },
        ]}
      />
    </PageShell>
  );
}

