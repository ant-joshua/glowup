"use client";

import { useMemo, useState } from "react";

type CoachMessage = {
  id: string;
  role: "user" | "coach";
  content: string;
  createdAt: string;
};

type CoachPostResponse = {
  ok: boolean;
  output?: { message?: string };
  message?: string;
};

function toLocalId() {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function CoachClient({
  initialMessages,
}: {
  initialMessages: CoachMessage[];
}) {
  const [messages, setMessages] = useState<CoachMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSend) return;

    setError(null);
    setLoading(true);

    const userMessage: CoachMessage = {
      id: toLocalId(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/intelligence/coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = (await res.json()) as CoachPostResponse;

      if (!res.ok || data.ok !== true) {
        setError(data.message ?? "Gagal mengirim pesan.");
        return;
      }

      const coachMessage: CoachMessage = {
        id: toLocalId(),
        role: "coach",
        content: data.output?.message ?? "",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, coachMessage]);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={[
              "rounded-xl border p-3 text-sm",
              msg.role === "coach"
                ? "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                : "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-100",
            ].join(" ")}
          >
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">
              {msg.role}
            </div>
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pertanyaan/commitment kamu..."
          rows={3}
          className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600"
        />
        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={!canSend}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
          {error ? (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
