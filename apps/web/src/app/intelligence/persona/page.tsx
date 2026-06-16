import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getBaseUrl } from "../../_lib/getBaseUrl";
import { PersonaClient } from "./PersonaClient";

export const dynamic = "force-dynamic";

type Persona = {
  id: string;
  title: string;
  traits: string[];
  styleKeywords: string[];
};

type PersonaResponse = {
  ok: boolean;
  personas: Persona[];
  selectedPersonaId: string | null;
  generatedAt: string;
  updatedAt: string;
};

async function getPersona() {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/intelligence/persona`, {
    cache: "no-store",
  });
  return (await res.json()) as PersonaResponse;
}

export default async function IntelligencePersonaPage() {
  const data = await getPersona();

  return (
    <PageShell
      title="Intelligence · Persona"
      description="Daftar persona / gaya target (mock)."
    >
      <SectionCrumb
        href="/intelligence"
        label="← Kembali ke PRD-005 Intelligence"
      />

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Generated:{" "}
        <span className="font-mono text-zinc-950 dark:text-zinc-50">
          {data.generatedAt}
        </span>
        {" · "}
        Updated:{" "}
        <span className="font-mono text-zinc-950 dark:text-zinc-50">
          {data.updatedAt}
        </span>
      </div>

      <PersonaClient personas={data.personas} selectedPersonaId={data.selectedPersonaId} />
    </PageShell>
  );
}
