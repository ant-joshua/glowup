import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getBaseUrl } from "../../_lib/getBaseUrl";

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
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {data.personas.map((persona) => {
          const selected = persona.id === data.selectedPersonaId;

          return (
            <div
              key={persona.id}
              className={[
                "rounded-xl border bg-white p-4 dark:bg-zinc-950",
                selected
                  ? "border-emerald-300 dark:border-emerald-800"
                  : "border-zinc-200 dark:border-zinc-800",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {persona.title}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-mono">{persona.id}</span>
                  </div>
                </div>
                {selected ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200">
                    Selected
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Traits
                </div>
                <div className="flex flex-wrap gap-2">
                  {persona.traits.map((trait) => (
                    <span
                      key={trait}
                      className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                    >
                      {trait}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Style keywords
                </div>
                <div className="flex flex-wrap gap-2">
                  {persona.styleKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
