"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type CoachMessage = {
  id: string;
  role: "user" | "coach";
  content: string;
  createdAt: string;
};

type CoachThread = {
  threadId: string;
  messages: CoachMessage[];
};

type CoachPostResponse = {
  ok: boolean;
  output?: { message?: string };
  thread?: CoachThread;
  message?: string;
  error?: string;
};

function toLocalId() {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function CoachClient({
  initialMessages,
}: {
  initialMessages: CoachMessage[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<CoachMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetBusy, setResetBusy] = useState(false);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading],
  );

  async function resetThread() {
    setResetBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/intelligence/coach/reset", { method: "POST" });
      const data = (await res.json()) as CoachPostResponse;
      if (!res.ok || data.ok !== true || !data.thread) {
        setError(data.message ?? "Gagal reset thread.");
        return;
      }
      setMessages(data.thread.messages);
      toast.success("Thread reset.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi error.");
    } finally {
      setResetBusy(false);
    }
  }

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

      if (data.thread?.messages) {
        setMessages(data.thread.messages);
      } else {
        const coachMessage: CoachMessage = {
          id: toLocalId(),
          role: "coach",
          content: data.output?.message ?? "",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, coachMessage]);
      }
      setInput("");
      toast.success("Terkirim.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={resetThread} disabled={resetBusy}>
            {resetBusy ? "Resetting…" : "Reset"}
          </Button>
          {error ? <div className="text-sm text-destructive">{error}</div> : null}
        </div>

        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={
              msg.role === "coach"
                ? "border-zinc-200 dark:border-zinc-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-100"
            }
          >
            <CardContent className="space-y-2 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                {msg.role}
              </div>
              <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pertanyaan/commitment kamu..."
          rows={3}
        />
        <div className="flex items-center justify-between gap-3">
          <Button type="submit" disabled={!canSend}>
            {loading ? "Mengirim..." : "Kirim"}
          </Button>
        </div>
      </form>
    </div>
  );
}
