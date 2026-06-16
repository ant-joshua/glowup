"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Persona = {
  id: string;
  title: string;
  traits: string[];
  styleKeywords: string[];
};

export function PersonaClient({
  personas,
  selectedPersonaId,
}: {
  personas: Persona[];
  selectedPersonaId: string | null;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState(selectedPersonaId);

  async function choose(personaId: string) {
    setBusyId(personaId);
    try {
      const res = await fetch("/api/intelligence/persona", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selectedPersonaId: personaId }),
      });
      const json = (await res.json()) as { ok?: boolean; selectedPersonaId?: string };
      if (res.ok && json.ok === true && json.selectedPersonaId) {
        setSelected(json.selectedPersonaId);
        toast.success("Persona updated.");
        router.refresh();
      } else {
        toast.error("Failed to update persona.");
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {personas.map((persona) => {
        const isSelected = persona.id === selected;
        return (
          <Card
            key={persona.id}
            className={isSelected ? "border-emerald-300 dark:border-emerald-800" : undefined}
          >
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{persona.title}</CardTitle>
                  <CardDescription>
                    <span className="font-mono">{persona.id}</span>
                  </CardDescription>
                </div>
                {isSelected ? <Badge>Selected</Badge> : null}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold tracking-wide text-secondary">Traits</div>
                <div className="flex flex-wrap gap-2">
                  {persona.traits.map((trait) => (
                    <Badge key={trait} variant="secondary">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold tracking-wide text-secondary">
                  Style keywords
                </div>
                <div className="flex flex-wrap gap-2">
                  {persona.styleKeywords.map((kw) => (
                    <Badge key={kw} variant="outline">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                variant={isSelected ? "secondary" : "default"}
                onClick={() => choose(persona.id)}
                disabled={busyId != null}
              >
                {busyId === persona.id ? "Saving…" : isSelected ? "Selected" : "Select"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
