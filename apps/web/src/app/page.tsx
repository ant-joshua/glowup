import Link from "next/link";
import { PageShell } from "./_components/PageShell";

export default function Home() {
  return (
    <PageShell
      title="PRD UI + Mock API Scaffold"
      description="Fondasi UI untuk PRD-001..PRD-006 (App Router) dengan navigasi area dan halaman-halaman minimal per PRD."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/core"
          className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          <div className="text-sm font-medium">PRD-001 Core</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Profile, analysis, roadmap, progress
          </div>
        </Link>
        <Link
          href="/creator"
          className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          <div className="text-sm font-medium">PRD-002 Creator</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Creator profile, routines, feed
          </div>
        </Link>
        <Link
          href="/commerce"
          className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          <div className="text-sm font-medium">PRD-003 Commerce</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Catalog, product detail, shopping list, affiliate analytics
          </div>
        </Link>
        <Link
          href="/ai-studio"
          className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          <div className="text-sm font-medium">PRD-004 AI Studio</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Script, storyboard, videos
          </div>
        </Link>
        <Link
          href="/intelligence"
          className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          <div className="text-sm font-medium">PRD-005 Intelligence</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Goals, persona, recommendations, coach
          </div>
        </Link>
        <Link
          href="/clinic"
          className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          <div className="text-sm font-medium">PRD-006 Clinic</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Search, expert profile, booking
          </div>
        </Link>
      </div>
      <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        <div>
          Healthcheck:{" "}
          <Link href="/api/health" className="text-zinc-950 dark:text-zinc-50">
            /api/health
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
