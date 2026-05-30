import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { featuresCatalog } from "@/features/featuresCatalog";
import {
  ScanFace,
  Shirt,
  Briefcase,
  Users,
  Video,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

function Icon({ name }: { name: (typeof featuresCatalog)[number]["icon"] }) {
  const props = { className: "h-5 w-5" };
  if (name === "scan-face") return <ScanFace {...props} />;
  if (name === "shirt") return <Shirt {...props} />;
  if (name === "briefcase") return <Briefcase {...props} />;
  if (name === "users") return <Users {...props} />;
  if (name === "video") return <Video {...props} />;
  return <ShoppingBag {...props} />;
}

export default function FeaturesIndexPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:pt-14">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="secondary"
            className="rounded-full border-0 bg-surface-container-high px-5 py-2 text-sm text-on-surface shadow-none"
          >
            Demos powered by PixVerse
          </Badge>
          <Link
            href="/ai-studio/videos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary"
          >
            Open AI Studio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-on-surface sm:text-5xl">
          Feature demos
        </h1>
        <p className="max-w-2xl text-base leading-7 text-secondary sm:text-lg">
          Setiap halaman feature punya demo generator yang menjalankan PixVerse
          worker untuk bikin clip per scene (5–10 detik), lalu bisa kamu gabung
          jadi video 30 detik.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuresCatalog.map((feature) => (
          <Link key={feature.slug} href={`/features/${feature.slug}`} className="group">
            <Card
              className={cn(
                "h-full overflow-hidden rounded-4xl border-outline/30 bg-surface-container-lowest shadow-ambient-sm transition-all",
                "hover:-translate-y-0.5 hover:shadow-ambient",
              )}
            >
              <div className="flex h-full flex-col gap-5 p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-primary">
                    <Icon name={feature.icon} />
                  </div>
                  <span className="rounded-full border border-outline/30 bg-surface px-4 py-2 text-xs font-semibold text-secondary">
                    Demo
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  <div className="font-serif text-2xl leading-tight tracking-tight text-on-surface">
                    {feature.title}
                  </div>
                  <div className="text-base leading-7 text-secondary">
                    {feature.description}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-sm font-semibold text-secondary">
                  <span>Open demo</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}

