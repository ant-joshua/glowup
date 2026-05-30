import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { featuresCatalog } from "@/features/featuresCatalog";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FeaturePixVerseDemoClient } from "./FeaturePixVerseDemoClient";

export function generateStaticParams() {
  return featuresCatalog.map((f) => ({ slug: f.slug }));
}

function getFeature(slug: string) {
  return featuresCatalog.find((f) => f.slug === slug) ?? null;
}

function GuideList({ title, items }: { title: string; items: string[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="rounded-4xl border border-outline/30 bg-surface-container-low p-6">
      <div className="text-sm font-semibold text-on-surface">{title}</div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-secondary">
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:pt-14">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/features">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <Badge
            variant="secondary"
            className="rounded-full border-0 bg-surface-container-high px-5 py-2 text-sm text-on-surface shadow-none"
          >
            PixVerse demo
          </Badge>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="flex flex-col gap-5">
            <h1 className="font-serif text-5xl leading-[0.95] tracking-tight text-on-surface sm:text-6xl">
              {feature.title}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-secondary">
              {feature.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild className="gap-2">
                <Link href="/ai-studio/videos">
                  Open AI Studio <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="gap-2">
                <Link href="/features">
                  Explore all demos <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 rounded-4xl border border-outline/30 bg-surface-container-low p-6">
              <div className="text-sm font-semibold text-on-surface">What this demo does</div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-secondary">
                <li>Generates multi-scene clips (1 clip per step)</li>
                <li>Each clip is 5–10 seconds (choose via template)</li>
                <li>Returns PixVerse-hosted URLs for video and poster frames</li>
              </ul>
            </div>
          </div>

          <FeaturePixVerseDemoClient
            templateId={feature.demo.templateId}
            variables={feature.demo.variables}
          />
        </div>

        <section className="mt-2">
          <div className="flex flex-col gap-3">
            <h2 className="font-serif text-3xl leading-tight tracking-tight text-on-surface sm:text-4xl">
              Panduan singkat
            </h2>
            <p className="max-w-3xl text-base leading-7 text-secondary sm:text-lg">
              {feature.guide.intro}
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-4xl border border-outline/30 bg-surface-container-lowest p-6 shadow-ambient-sm">
              <div className="text-sm font-semibold text-on-surface">Ringkasan</div>
              <div className="mt-3 space-y-3 text-sm leading-6 text-secondary">
                <p>
                  Demo ini menghasilkan beberapa clip pendek (multi-scene) supaya kamu bisa nyusun
                  pacing yang rapi untuk video sekitar 30 detik.
                </p>
                <p>
                  Untuk hasil terbaik, jaga consistency (lighting, persona, wardrobe) dan gunakan 5–6
                  scene dengan durasi 5–6 detik per scene.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <GuideList title="Yang kamu dapat" items={feature.guide.whatYouGet} />
              <GuideList title="Cara kerja demo" items={feature.guide.howDemoWorks} />
              <GuideList title="Tips prompt" items={feature.guide.promptTips} />
              <GuideList title="Cara susun jadi 30 detik" items={feature.guide.assembleSteps} />
              <div className="sm:col-span-2">
                <GuideList title="Troubleshooting" items={feature.guide.troubleshooting} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
