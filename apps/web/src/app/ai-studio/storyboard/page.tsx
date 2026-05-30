"use client";

import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { useEffect, useState } from "react";

type StoryboardScene = {
  id: string;
  title: string;
  durationSec: number;
  description: string;
  visualDirections: string;
  transition: string;
};

type StoryboardOutput = {
  platform: string;
  durationSec: number;
  scenes: StoryboardScene[];
  scriptExcerpt: string;
};

type StoryboardExampleResponse = {
  ok: true;
  example: {
    input: {
      platform: string;
      script?: { hook: string; body: string; cta: string };
    };
    output: StoryboardOutput;
  };
  updatedAt: string;
};

type StoryboardGenerateResponse = {
  ok: true;
  input: { platform: string; text: string };
  output: StoryboardOutput;
  updatedAt: string;
};

function buildDefaultText(example: StoryboardExampleResponse["example"]["input"]) {
  const script = example.script;
  if (!script) {
    return "";
  }
  return [script.hook, script.body, script.cta].filter(Boolean).join("\n\n");
}

export default function AiStudioStoryboardPage() {
  const [formPlatform, setFormPlatform] = useState("");
  const [formText, setFormText] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StoryboardGenerateResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ai-studio/storyboard");
        const data = (await res.json()) as StoryboardExampleResponse;
        if (!res.ok || !data.ok) {
          throw new Error("Gagal memuat data.");
        }
        if (cancelled) {
          return;
        }
        setFormPlatform(data.example.input.platform);
        setFormText(buildDefaultText(data.example.input));
        setUpdatedAt(data.updatedAt);
        setResult({
          ok: true,
          input: {
            platform: data.example.input.platform,
            text: buildDefaultText(data.example.input),
          },
          output: data.example.output,
          updatedAt: data.updatedAt,
        });
      } catch (err) {
        if (cancelled) {
          return;
        }
        setError(err instanceof Error ? err.message : "Terjadi error.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-studio/storyboard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ platform: formPlatform, text: formText }),
      });
      const data = (await res.json()) as StoryboardGenerateResponse;
      if (!res.ok || !data.ok) {
        throw new Error("Gagal generate storyboard.");
      }
      setResult(data);
      setUpdatedAt(data.updatedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      title="AI Studio · Storyboard"
      description="Generate storyboard via mock API PRD-004."
    >
      <SectionCrumb href="/ai-studio" label="← Kembali ke PRD-004 AI Studio" />
      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label
              className="text-sm text-zinc-600 dark:text-zinc-400"
              htmlFor="platform"
            >
              Platform
            </label>
            <input
              id="platform"
              value={formPlatform}
              onChange={(e) => setFormPlatform(e.target.value)}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-zinc-700"
              placeholder="TikTok / Instagram Reels / YouTube"
              disabled={loading || submitting}
            />
          </div>
          <div className="flex items-end justify-between gap-3">
            <button
              type="submit"
              className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              disabled={loading || submitting}
            >
              {submitting ? "Generating..." : "Generate"}
            </button>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {updatedAt ? <span className="font-mono">{updatedAt}</span> : null}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1">
          <label className="text-sm text-zinc-600 dark:text-zinc-400" htmlFor="text">
            Script / Text
          </label>
          <textarea
            id="text"
            value={formText}
            onChange={(e) => setFormText(e.target.value)}
            rows={6}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-zinc-700"
            placeholder="Hook → problem → solution → CTA"
            disabled={loading || submitting}
          />
        </div>
      </form>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-zinc-950 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {result.output.platform}
              </div>
              <div className="mt-1 text-sm font-medium">
                Durasi: {result.output.durationSec}s
              </div>
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Excerpt:{" "}
              <span className="font-mono">{result.output.scriptExcerpt}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {result.output.scenes.map((scene) => (
              <div
                key={scene.id}
                className="rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium">{scene.title}</div>
                  <div className="shrink-0 text-sm text-zinc-600 dark:text-zinc-400">
                    {scene.durationSec}s
                  </div>
                </div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {scene.description}
                </div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Visual: {scene.visualDirections}
                </div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Transition: {scene.transition}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
