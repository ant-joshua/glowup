import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getBaseUrl } from "../../_lib/getBaseUrl";
import { CoachClient } from "./CoachClient";

export const dynamic = "force-dynamic";

type CoachMessage = {
  id: string;
  role: "user" | "coach";
  content: string;
  createdAt: string;
};

type CoachThreadResponse = {
  ok: boolean;
  thread: { threadId: string; messages: CoachMessage[] };
  updatedAt: string;
};

async function getThread() {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/intelligence/coach`, {
    cache: "no-store",
  });
  return (await res.json()) as CoachThreadResponse;
}

export default async function IntelligenceCoachPage() {
  const data = await getThread();

  return (
    <PageShell
      title="Intelligence · Coach"
      description="Chat singkat dengan coach (mock)."
    >
      <SectionCrumb
        href="/intelligence"
        label="← Kembali ke PRD-005 Intelligence"
      />
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Thread:{" "}
        <span className="font-mono text-zinc-950 dark:text-zinc-50">
          {data.thread.threadId}
        </span>
        {" · "}
        Updated:{" "}
        <span className="font-mono text-zinc-950 dark:text-zinc-50">
          {data.updatedAt}
        </span>
      </div>
      <CoachClient initialMessages={data.thread.messages} />
    </PageShell>
  );
}
