import { PageShell } from "../../_components/PageShell";
import { SectionCrumb } from "../../_components/SectionCrumb";
import { fetchMockJson } from "../../_lib/mockApi";

type CoreProfileResponse = {
  ok: boolean;
  user: {
    id: string;
    name: string;
    age: number;
    gender: string;
    heightCm: number;
    weightKg: number;
    occupation: string;
    budgetMonthlyIdr: number;
  };
  goals: Array<{ id: string; label: string }>;
  updatedAt: string;
};

function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export const dynamic = "force-dynamic";

export default async function CoreProfilePage() {
  const data = await fetchMockJson<CoreProfileResponse>("/api/core/profile");

  return (
    <PageShell
      title="Core · Profile"
      description="Informasi dasar user + goals dari mock API."
    >
      <SectionCrumb href="/core" label="← Kembali ke PRD-001 Core" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-medium">Profil</div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="col-span-2">
              <dt className="text-zinc-500 dark:text-zinc-400">Nama</dt>
              <dd className="text-zinc-950 dark:text-zinc-50">{data.user.name}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Usia</dt>
              <dd className="text-zinc-950 dark:text-zinc-50">{data.user.age}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Gender</dt>
              <dd className="text-zinc-950 dark:text-zinc-50">{data.user.gender}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Tinggi</dt>
              <dd className="text-zinc-950 dark:text-zinc-50">{data.user.heightCm} cm</dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Berat</dt>
              <dd className="text-zinc-950 dark:text-zinc-50">{data.user.weightKg} kg</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-zinc-500 dark:text-zinc-400">Pekerjaan</dt>
              <dd className="text-zinc-950 dark:text-zinc-50">{data.user.occupation}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-zinc-500 dark:text-zinc-400">Budget bulanan</dt>
              <dd className="text-zinc-950 dark:text-zinc-50">
                {formatIdr(data.user.budgetMonthlyIdr)}
              </dd>
            </div>
          </dl>
          <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            Terakhir update: {new Date(data.updatedAt).toLocaleString("id-ID")}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-medium">Goals</div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {data.goals.map((goal) => (
              <li
                key={goal.id}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                {goal.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
