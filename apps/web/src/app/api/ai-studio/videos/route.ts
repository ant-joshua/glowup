const videos = [
  {
    id: "vid_0001",
    title: "3 Langkah Skincare untuk Professional Sibuk",
    platform: "TikTok",
    status: "published",
    durationSec: 32,
    createdAt: "2026-05-18T00:00:00.000Z",
    assets: {
      thumbnailUrl: "https://example.com/images/videos/vid_0001.jpg",
      videoUrl: "https://example.com/videos/vid_0001.mp4",
    },
  },
  {
    id: "vid_0002",
    title: "Before/After Glow-Up Journey (Storyboard Draft)",
    platform: "Instagram Reels",
    status: "draft",
    durationSec: 45,
    createdAt: "2026-05-19T00:00:00.000Z",
    assets: {
      thumbnailUrl: "https://example.com/images/videos/vid_0002.jpg",
      videoUrl: null,
    },
  },
  {
    id: "vid_0003",
    title: "Office Style: Blazer yang Mudah Dipadu-padankan",
    platform: "YouTube Shorts",
    status: "rendering",
    durationSec: 58,
    createdAt: "2026-05-20T00:00:00.000Z",
    assets: {
      thumbnailUrl: "https://example.com/images/videos/vid_0003.jpg",
      videoUrl: null,
    },
  },
] as const;

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") ?? "").trim().toLowerCase();

  const items = status
    ? videos.filter((v) => v.status.toLowerCase() === status)
    : [...videos];

  return Response.json({
    ok: true,
    query: {
      status: searchParams.get("status") ?? "",
    },
    items,
    total: items.length,
    updatedAt: "2026-05-20T00:00:00.000Z",
  });
}

