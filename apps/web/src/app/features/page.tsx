import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { featuresCatalog } from "@/features/featuresCatalog";
import {
  ArrowRight,
  Briefcase,
  ScanFace,
  Shirt,
  ShoppingBag,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

const FEATURE_ICONS = {
  "scan-face": ScanFace,
  shirt: Shirt,
  briefcase: Briefcase,
  users: Users,
  video: Video,
  "shopping-bag": ShoppingBag,
} as const;

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-xl supports-backdrop-filter:bg-surface/60">
        <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-serif text-2xl font-bold tracking-tight text-on-surface">
              GlowUp
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild>
              <Link href="/#pricing">Start Your Journey</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden pb-20 pt-12 md:pt-16">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-primary/8 to-transparent" />
          <div className="pointer-events-none absolute left-[10%] top-24 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
          <div className="pointer-events-none absolute right-[6%] top-24 h-72 w-72 rounded-full bg-tertiary/10 blur-3xl" />

          <div className="container mx-auto max-w-6xl px-4">
            <Badge
              variant="secondary"
              className="rounded-full border-0 bg-surface-container-high px-5 py-2 text-sm text-on-surface shadow-none hover:bg-surface-container-high"
            >
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              Product overview
            </Badge>

            <h1 className="mt-8 max-w-[18ch] font-serif text-5xl font-normal leading-[0.96] tracking-tight text-on-surface md:text-7xl">
              Everything you need to become visually unforgettable.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-secondary md:text-xl">
              GlowUp combines face analysis, outfit intelligence, skincare
              ritual design, personal brand growth, and creator-led routines in
              one clean, premium system.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-16 px-10 text-lg">
                <Link href="/">
                  Back to Landing
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-16 px-10 text-lg"
              >
                <Link href="/core">Open App</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="pb-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="rounded-[2rem] bg-surface-container-lowest shadow-ambient-sm">
              <div className="grid divide-y divide-outline/20">
                {featuresCatalog.map((item) => {
                  const Icon = FEATURE_ICONS[item.icon];
                  return (
                    <Link
                      key={item.title}
                      href={`/features/${item.slug}`}
                      className="group flex flex-col gap-4 px-6 py-7 transition-colors hover:bg-surface-container-low md:flex-row md:items-start md:justify-between md:gap-8"
                    >
                      <div className="flex gap-4">
                        <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-container-high text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-on-surface">
                            {item.title}
                          </p>
                          <p className="mt-2 max-w-2xl text-sm leading-7 text-secondary">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start text-sm font-semibold text-secondary transition-colors group-hover:text-primary md:self-center">
                        Explore
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] bg-surface-container-low px-6 py-8 shadow-ambient-sm">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-secondary">
                Next
              </p>
              <p className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-on-surface">
                Watch the hero campaign, then dive into your analysis.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-16 px-10 text-lg">
                  <Link href="/">
                    View Hero Film
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-16 px-10 text-lg"
                >
                  <Link href="/features/ai-personal-analysis">Start Analysis</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
