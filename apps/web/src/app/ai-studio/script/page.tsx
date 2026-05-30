"use client";

import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { useEffect, useMemo, useState } from "react";

type ScriptProductInput = { id: string | null; name: string };

type ScriptOutput = {
  hook: string;
  body: string;
  cta: string;
  affiliateMentions: Array<{
    productId: string | null;
    label: string;
    disclosure: string;
  }>;
};

type ScriptApiOkResponse = {
  ok: true;
  supportedTones: string[];
  example: {
    input: {
      goal: string;
      audience: string;
      platform: string;
      tone: string;
      products: ScriptProductInput[];
    };
    output: ScriptOutput;
  };
  updatedAt: string;
};

type ScriptApiGenerateResponse = {
  ok: true;
  input: {
    goal: string;
    audience: string;
    platform: string;
    tone: string;
    products: ScriptProductInput[];
  };
  output: ScriptOutput;
  updatedAt: string;
};

function parseProducts(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export default function AiStudioScriptPage() {
  const [supportedTones, setSupportedTones] = useState<string[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [formGoal, setFormGoal] = useState("");
  const [formAudience, setFormAudience] = useState("");
  const [formPlatform, setFormPlatform] = useState("");
  const [formTone, setFormTone] = useState("");
  const [formProductsRaw, setFormProductsRaw] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScriptApiGenerateResponse | null>(null);

  const payload = useMemo(() => {
    const products = parseProducts(formProductsRaw);
    return {
      goal: formGoal,
      audience: formAudience,
      platform: formPlatform,
      tone: formTone,
      products,
    };
  }, [formAudience, formGoal, formPlatform, formProductsRaw, formTone]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ai-studio/script");
        const data = (await res.json()) as ScriptApiOkResponse;
        if (!res.ok || !data.ok) {
          throw new Error("Gagal memuat data.");
        }
        if (cancelled) {
          return;
        }
        setSupportedTones(data.supportedTones);
        setUpdatedAt(data.updatedAt);
        setFormGoal(data.example.input.goal);
        setFormAudience(data.example.input.audience);
        setFormPlatform(data.example.input.platform);
        setFormTone(data.example.input.tone);
        setFormProductsRaw(data.example.input.products.map((p) => p.name).join("\n"));
        setResult({
          ok: true,
          input: data.example.input,
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
      const res = await fetch("/api/ai-studio/script", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ScriptApiGenerateResponse;
      if (!res.ok || !data.ok) {
        throw new Error("Gagal generate script.");
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
      title="AI Studio · Script"
      description="Generate script video via mock API PRD-004."
    >
      <SectionCrumb href="/ai-studio" label="← Kembali ke PRD-004 AI Studio" />
      <form onSubmit={onSubmit} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-600 dark:text-zinc-400" htmlFor="goal">
              Goal
            </label>
            <input
              id="goal"
              value={formGoal}
              onChange={(e) => setFormGoal(e.target.value)}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-zinc-700"
              placeholder="contoh: glowing untuk ngantor"
              disabled={loading || submitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-600 dark:text-zinc-400" htmlFor="audience">
              Audience
            </label>
            <input
              id="audience"
              value={formAudience}
              onChange={(e) => setFormAudience(e.target.value)}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-zinc-700"
              placeholder="contoh: professional super sibuk"
              disabled={loading || submitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-600 dark:text-zinc-400" htmlFor="platform">
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
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-600 dark:text-zinc-400" htmlFor="tone">
              Tone
            </label>
            <select
              id="tone"
              value={formTone}
              onChange={(e) => setFormTone(e.target.value)}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-zinc-700"
              disabled={loading || submitting}
            >
              {supportedTones.length === 0 ? (
                <option value="Educational">Educational</option>
              ) : (
                supportedTones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <label className="text-sm text-zinc-600 dark:text-zinc-400" htmlFor="products">
            Products (1 per baris, opsional)
          </label>
          <textarea
            id="products"
            value={formProductsRaw}
            onChange={(e) => setFormProductsRaw(e.target.value)}
            rows={4}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-zinc-700"
            placeholder="Daily Glow Cleanser"
            disabled={loading || submitting}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
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
      </form>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-zinc-950 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-sm font-medium">Output</div>
            <div className="mt-3 flex flex-col gap-3 text-sm">
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Hook</div>
                <pre className="mt-1 whitespace-pre-wrap rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  {result.output.hook}
                </pre>
              </div>
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Body</div>
                <pre className="mt-1 whitespace-pre-wrap rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  {result.output.body}
                </pre>
              </div>
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">CTA</div>
                <pre className="mt-1 whitespace-pre-wrap rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  {result.output.cta}
                </pre>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-sm font-medium">Affiliate Mentions</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {result.output.affiliateMentions.map((mention, idx) => (
                <div
                  key={`${mention.label}-${idx}`}
                  className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800"
                >
                  <div className="font-medium">{mention.label}</div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {mention.disclosure}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
