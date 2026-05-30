import Link from "next/link";
import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { getBaseUrl } from "../../_lib/getBaseUrl";

export const dynamic = "force-dynamic";

type SearchItem = {
  id: string;
  type: "expert" | "clinic";
  name: string;
  category: string;
  location: string;
  rating: number;
  startingPriceIdr: number;
  tags: string[];
  nextAvailableAt: string;
};

type SearchResponse = {
  ok: boolean;
  query: { q: string | null; category: string | null; location: string | null };
  totals: { all: number; experts: number; clinics: number };
  results: { experts: SearchItem[]; clinics: SearchItem[] };
  generatedAt: string;
};

async function searchClinic(params: {
  q?: string;
  category?: string;
  location?: string;
}) {
  const baseUrl = await getBaseUrl();
  const url = new URL(`${baseUrl}/api/clinic/search`);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.category) url.searchParams.set("category", params.category);
  if (params.location) url.searchParams.set("location", params.location);

  const res = await fetch(url, { cache: "no-store" });
  return (await res.json()) as SearchResponse;
}

function formatPriceIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ClinicSearchPage({
  searchParams,
}: {
  searchParams?: { q?: string; category?: string; location?: string };
}) {
  const data = await searchClinic({
    q: searchParams?.q,
    category: searchParams?.category,
    location: searchParams?.location,
  });

  return (
    <PageShell
      title="Clinic · Search"
      description="Cari expert / clinic (mock)."
    >
      <SectionCrumb href="/clinic" label="← Kembali ke PRD-006 Clinic" />

      <form className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              Query
            </span>
            <input
              name="q"
              defaultValue={data.query.q ?? ""}
              placeholder="mis. acne, laser, trainer..."
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              Category
            </span>
            <input
              name="category"
              defaultValue={data.query.category ?? ""}
              placeholder="mis. Dermatology"
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              Location
            </span>
            <input
              name="location"
              defaultValue={data.query.location ?? ""}
              placeholder="mis. Jakarta"
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600"
            />
          </label>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            Search
          </button>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Total:{" "}
            <span className="font-mono text-zinc-950 dark:text-zinc-50">
              {data.totals.all}
            </span>{" "}
            (experts{" "}
            <span className="font-mono text-zinc-950 dark:text-zinc-50">
              {data.totals.experts}
            </span>
            , clinics{" "}
            <span className="font-mono text-zinc-950 dark:text-zinc-50">
              {data.totals.clinics}
            </span>
            )
          </div>
        </div>
      </form>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Generated:{" "}
        <span className="font-mono text-zinc-950 dark:text-zinc-50">
          {data.generatedAt}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {data.results.experts.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {item.name}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  {item.category} · {item.location} · rating{" "}
                  <span className="font-mono">{item.rating}</span>
                </div>
              </div>
              <Link
                href={`/clinic/experts/${item.id}`}
                className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                Detail
              </Link>
            </div>

            <div className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
              Mulai{" "}
              <span className="font-mono">{formatPriceIdr(item.startingPriceIdr)}</span>{" "}
              · available{" "}
              <span className="font-mono">{item.nextAvailableAt}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}

        {data.results.clinics.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                {item.name}
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                {item.category} · {item.location} · rating{" "}
                <span className="font-mono">{item.rating}</span>
              </div>
            </div>

            <div className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
              Mulai{" "}
              <span className="font-mono">{formatPriceIdr(item.startingPriceIdr)}</span>{" "}
              · available{" "}
              <span className="font-mono">{item.nextAvailableAt}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
