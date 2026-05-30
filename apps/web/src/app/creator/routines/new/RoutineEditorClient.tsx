"use client";

import { useMemo, useState } from "react";

type RoutineDraft = {
  title: string;
  description: string;
  category: string;
  durationDays: number;
};

export function RoutineEditorClient({
  creatorUsername,
  categoryHints,
  existingTitles,
}: {
  creatorUsername: string;
  categoryHints: string[];
  existingTitles: string[];
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categoryHints[0] ?? "skincare");
  const [durationDays, setDurationDays] = useState(7);
  const [submitted, setSubmitted] = useState<RoutineDraft | null>(null);

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted({ title: title.trim(), description: description.trim(), category, durationDays });
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm font-medium">Routine editor (mock)</div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Draft ini tidak disimpan. Creator: @{creatorUsername}
        </div>

        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: 14 Hari Skincare Basics"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Ringkas, fokus ke outcome."
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
              >
                {categoryHints.map((hint) => (
                  <option key={hint} value={hint}>
                    {hint}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Duration (days)</span>
              <input
                type="number"
                min={1}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-fit rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            Preview draft
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-medium">Preview</div>
          {submitted ? (
            <pre className="mt-3 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              {JSON.stringify(submitted, null, 2)}
            </pre>
          ) : (
            <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Isi form lalu klik preview.
            </div>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-medium">Referensi titles (mock)</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
            {existingTitles.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
