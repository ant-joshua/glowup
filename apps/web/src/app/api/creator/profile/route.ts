const payload = {
  ok: true,
  creator: {
    id: "cr_0007",
    userId: "usr_0001",
    username: "alya.glow",
    displayName: "Alya Putri",
    bio: "Skincare minimalis + gaya smart-casual untuk kerja. Fokus: barrier, sunscreen, dan wardrobe capsule.",
    verified: true,
    avatar: {
      url: "https://example.invalid/avatars/cr_0007.png",
      blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
    },
    links: {
      instagram: "https://instagram.com/alya.glow",
      tiktok: "https://tiktok.com/@alya.glow",
      youtube: null,
      website: "https://example.invalid/alya",
    },
    stats: {
      followers: 12840,
      following: 214,
      routines: 12,
      collections: 3,
    },
    updatedAt: "2026-05-01T00:00:00.000Z",
  },
};

export function GET() {
  return Response.json(payload);
}
