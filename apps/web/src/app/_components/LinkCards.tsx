import Link from "next/link";

export type LinkCardItem = {
  href: string;
  title: string;
  description?: string;
};

export function LinkCards({ items }: { items: LinkCardItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          <div className="text-sm font-medium">{item.title}</div>
          {item.description ? (
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {item.description}
            </div>
          ) : null}
        </Link>
      ))}
    </div>
  );
}

