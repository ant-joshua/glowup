import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/core", label: "PRD-001 Core" },
  { href: "/creator", label: "PRD-002 Creator" },
  { href: "/commerce", label: "PRD-003 Commerce" },
  { href: "/ai-studio", label: "PRD-004 AI Studio" },
  { href: "/intelligence", label: "PRD-005 Intelligence" },
  { href: "/clinic", label: "PRD-006 Clinic" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          GlowUp OS
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm text-zinc-700 dark:text-zinc-200">
          {NAV_ITEMS.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

