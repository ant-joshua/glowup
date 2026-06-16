"use client";

import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TodayPayload = {
  ok: true;
  date: string;
  greetingName: string;
  focus: { tag: string; title: string; description: string };
  tasks: Array<{ id: string; title: string; subtitle?: string; completed: boolean }>;
  tip: { title: string; description: string; imageUrl: string };
};

export default function DailyDashboardPage() {
  const [data, setData] = useState<TodayPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/core/dashboard/today", { cache: "no-store" });
      const json = (await res.json()) as unknown;
      if (res.ok && json && typeof json === "object" && (json as { ok?: unknown }).ok === true) {
        setData(json as TodayPayload);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function toggle(taskId: string) {
    setToggling(taskId);
    try {
      await fetch(`/api/core/dashboard/tasks/${encodeURIComponent(taskId)}/toggle`, { method: "POST" });
      await load();
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="pt-8 px-6 max-w-lg mx-auto md:max-w-2xl lg:max-w-3xl md:pt-12">
      {/* Greeting Hero */}
      <section className="pl-2 mb-10">
        <h1 className="font-serif text-4xl md:text-5xl text-secondary font-normal tracking-tight opacity-90">
          Good morning,
        </h1>
        <h2 className="font-serif text-5xl md:text-6xl text-on-surface font-bold mt-1 tracking-tighter">
          {loading ? "…" : `${data?.greetingName ?? "there"}.`}
        </h2>
      </section>

      {/* Focus Card */}
      <section className="bg-surface-container-low rounded-[1.5rem] p-6 md:p-8 mb-10 relative overflow-hidden shadow-ambient-sm">
        {/* Decorative Glow Accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-linear-to-br from-primary to-primary-container opacity-10 blur-3xl rounded-full" />
        <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">
          {data?.focus?.tag ?? "Today’s Focus"}
        </p>
        <h3 className="font-serif text-3xl text-on-surface mb-3 leading-tight relative z-10">
          {data?.focus?.title ?? "Deep Hydration & Recovery"}
        </h3>
        <p className="font-sans text-sm md:text-base text-secondary max-w-[85%] leading-relaxed relative z-10">
          {data?.focus?.description ??
            "Focus on restoring your skin barrier today. Skip the actives and lean heavily into ceramides and hyaluronic acid."}
        </p>
      </section>

      {/* Routine Checklist */}
      <section className="mb-12">
        <div className="flex items-center justify-between gap-3 pl-2">
          <h4 className="font-serif text-2xl text-on-surface mb-5">Morning Ritual</h4>
          <Link href="/core/roadmap" className="text-sm font-semibold text-primary hover:underline">
            View roadmap
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {(data?.tasks ?? []).map((task) => {
            const isCompleted = task.completed;
            const busy = toggling === task.id;
            return (
              <button
                key={task.id}
                disabled={busy}
                onClick={() => toggle(task.id)}
                className={
                  isCompleted
                    ? "w-full text-left bg-surface-container-low rounded-[1.5rem] p-4 flex items-center gap-4 transition-all duration-300"
                    : "w-full text-left bg-surface-container-lowest rounded-[1.5rem] p-4 flex items-center gap-4 border border-outline/15 shadow-ambient-sm hover:shadow-ambient transition-all duration-300 transform hover:-translate-y-0.5 group"
                }
              >
                <div
                  className={
                    isCompleted
                      ? "w-7 h-7 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary shadow-[0_4px_12px_rgba(0,106,96,0.2)] shrink-0"
                      : "w-7 h-7 rounded-full border-[1.5px] border-primary/40 flex items-center justify-center bg-surface-container-lowest shrink-0 group-hover:border-primary/60 transition-colors"
                  }
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-3" /> : null}
                </div>
                <div className="flex-1 flex flex-col">
                  <span
                    className={
                      isCompleted
                        ? "font-sans text-base text-secondary line-through opacity-70"
                        : "font-sans text-base text-on-surface font-semibold"
                    }
                  >
                    {busy ? "…" : task.title}
                  </span>
                  {!isCompleted && task.subtitle ? (
                    <span className="font-sans text-xs text-secondary mt-0.5">{task.subtitle}</span>
                  ) : null}
                </div>
              </button>
            );
          })}
          {!loading && (data?.tasks?.length ?? 0) === 0 ? (
            <div className="rounded-[1.5rem] bg-surface-container-low p-4 text-sm text-secondary">
              No tasks yet. Generate a roadmap first.
            </div>
          ) : null}
        </div>
      </section>

      {/* Daily Tip */}
      <section className="mb-8">
        <div className="flex items-center justify-between gap-3 pl-2">
          <h4 className="font-serif text-2xl text-on-surface mb-5">The Atelier Edits</h4>
          <Link href="/start-analysis" className="text-sm font-semibold text-primary hover:underline">
            New analysis
          </Link>
        </div>
        <div className="relative rounded-[1.5rem] overflow-hidden shadow-ambient bg-surface-container group cursor-pointer">
          <div className="h-64 w-full relative">
            <Image
              alt="Skincare bottles flatlay"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              fill
              sizes="(max-width: 1024px) 100vw, 768px"
              src={
                data?.tip?.imageUrl ??
                "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=editorial%20beauty%20flatlay%2C%20premium%20skincare%20bottles%20and%20textures%20on%20warm%20stone%20surface%2C%20soft%20natural%20window%20light%2C%20shallow%20depth%20of%20field%2C%20high-end%20magazine%20aesthetic%2C%20ultra%20realistic%2C%2050mm&image_size=landscape_16_9"
              }
            />
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-on-surface/90 via-on-surface/30 to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 w-full p-6">
            <span className="inline-block px-3 py-1 bg-surface-container-lowest/20 backdrop-blur-md text-surface-container-lowest font-sans text-[10px] uppercase tracking-widest rounded-full mb-3 border border-surface-container-lowest/20">
              Daily Insight
            </span>
            <h5 className="font-serif text-surface-container-lowest text-xl md:text-2xl mb-2 leading-snug">
              {data?.tip?.title ?? "The Architecture of Layering"}
            </h5>
            <p className="font-sans text-surface-container-lowest/80 text-sm max-w-[90%]">
              {data?.tip?.description ??
                "Apply products from thinnest to thickest consistency to ensure maximum absorption and a flawless canvas."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
