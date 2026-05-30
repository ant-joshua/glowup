import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";

import { MarketingAssetPlaygroundClient } from "./MarketingAssetPlaygroundClient";

export default function AiStudioMarketingPage() {
  return (
    <PageShell
      title="Marketing Asset Playground"
      description="Generate landing page images and marketing videos with PixVerse CLI, then archive the JSON outputs into docs."
    >
      <SectionCrumb href="/ai-studio" label="← Kembali ke PRD-004 AI Studio" />
      <MarketingAssetPlaygroundClient />
    </PageShell>
  );
}
