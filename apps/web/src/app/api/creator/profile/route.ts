import { normalizeProfilePatch, readCreatorStore, writeCreatorStore } from "../../../_lib/creatorStore";

export async function GET() {
  const store = await readCreatorStore();
  return Response.json({ ok: true, creator: store.creator });
}

export async function PUT(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const patch = normalizeProfilePatch(body);
  if (!patch) {
    return Response.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const store = await readCreatorStore();
  const nextCreator = {
    ...store.creator,
    displayName: patch.displayName ?? store.creator.displayName,
    bio: patch.bio ?? store.creator.bio,
    links: patch.links ? { ...store.creator.links, ...patch.links } : store.creator.links,
    avatar:
      patch.avatarUrl && patch.avatarUrl.length > 0
        ? { ...store.creator.avatar, url: patch.avatarUrl }
        : store.creator.avatar,
  };

  const saved = await writeCreatorStore({ ...store, creator: nextCreator });
  return Response.json({ ok: true, creator: saved.creator });
}
