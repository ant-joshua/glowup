import { PageShell } from "../../../_components/PageShell";
import { SectionCrumb } from "../../../_components/SectionCrumb";
import { AiVideoScenarioStudio } from "@/features/ai-video/AiVideoScenarioStudio";
import { AI_VIDEO_SCENARIOS } from "@/features/ai-video/scenarios";

const scenario = AI_VIDEO_SCENARIOS.outfit;

export default function AiStudioOutfitVideoPage() {
  return (
    <PageShell
      title={scenario.pageTitle}
      description={scenario.pageDescription}
    >
      <SectionCrumb href="/ai-studio/videos" label={scenario.breadcrumbLabel} />
      <AiVideoScenarioStudio scenario={scenario} />
    </PageShell>
  );
}
