"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/#product", label: "Product" },
  { href: "/#pillars", label: "Pillars" },
  { href: "/#modules", label: "Modules" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/core", label: "App" },
];

export function TopNav() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")
      .matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    return isDark ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          GlowUp
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-1 text-foreground/80 hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              document.documentElement.classList.toggle("dark", next === "dark");
              localStorage.setItem("theme", next);
            }}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground/80 shadow-xs hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            <span className="hidden sm:inline">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
            <span className="inline-flex h-4 w-4 items-center justify-center">
              {theme === "dark" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M21 14.5a8 8 0 0 1-10.5-10A7 7 0 1 0 21 14.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
