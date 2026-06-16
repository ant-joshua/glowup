import { readCoreStore, todayDateId } from "../../../../_lib/coreStore";

function firstName(full: string) {
  const v = full.trim();
  if (!v) return "there";
  return v.split(/\s+/)[0] ?? v;
}

function pickFocus(store: Awaited<ReturnType<typeof readCoreStore>>) {
  const latest = store.analyses.at(-1);
  const kind = latest?.kind ?? "skin";
  if (kind === "style") {
    return {
      tag: "Today’s Focus",
      title: "Polish & Fit",
      description:
        "Prioritaskan fit yang rapi, grooming konsisten, dan 1 signature detail untuk terlihat lebih premium.",
    };
  }
  if (kind === "color") {
    return {
      tag: "Today’s Focus",
      title: "Warm Neutrals",
      description:
        "Pilih palet earthy yang hangat dan kontras lembut untuk tampilan yang lebih harmonis.",
    };
  }
  return {
    tag: "Today’s Focus",
    title: "Hydration & Barrier",
    description:
      "Fokus pada skin barrier hari ini. Minimal actives, prioritaskan hidrasi, dan sunscreen yang konsisten.",
  };
}

function toImageUrl(prompt: string, imageSize: string) {
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${encodeURIComponent(imageSize)}`;
}

export async function GET() {
  const store = await readCoreStore();
  const date = todayDateId();
  const entry = store.progressEntries.find((e) => e.date === date);
  const completed = new Set(entry?.completedActionIds ?? []);

  const actions = store.roadmap.weeks
    .flatMap((w) => w.actions)
    .slice(0, 6)
    .map((a) => ({
      id: a.id,
      title: a.title,
      subtitle: a.cadence,
      completed: completed.has(a.id),
    }));

  const focus = pickFocus(store);
  const tipTitle = "The Atelier Edits";
  const tipSubtitle = "Layering yang rapi akan terlihat lebih mahal daripada item yang trendi.";
  const imageUrl = toImageUrl(
    "editorial beauty flatlay, premium skincare bottles and textures on warm stone surface, soft natural window light, shallow depth of field, high-end magazine aesthetic, ultra realistic, 50mm",
    "landscape_16_9",
  );

  return Response.json({
    ok: true,
    date,
    greetingName: firstName(store.user.name),
    focus,
    tasks: actions,
    tip: { title: tipTitle, description: tipSubtitle, imageUrl },
  });
}

