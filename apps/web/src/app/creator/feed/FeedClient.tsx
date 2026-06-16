"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Bookmark, Share2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type RoutineRef = { id: string; title: string; durationDays: number };

type FeedItem = {
  id: string;
  type: string;
  creator: { id: string; username: string; displayName: string; verified: boolean; avatarUrl?: string };
  createdAt: string;
  updatedAt: string;
  text: string;
  routine?: RoutineRef;
  media: Array<{ kind: string; url: string }>;
  metrics: { likes: number; comments: number; saves: number; shares: number };
  tags: string[];
  viewer?: { liked: boolean; saved: boolean };
  status: "draft" | "published";
  publishedAt: string | null;
};

type PostDraft = {
  type: string;
  text: string;
  tags: string;
  mediaUrl: string;
  routineId: string;
  status: "draft" | "published";
};

function parseTags(value: string) {
  return value
    .split(",")
    .map((v) => v.trim().replaceAll("#", ""))
    .filter(Boolean)
    .slice(0, 12);
}

export function FeedClient({
  initialItems,
  routines,
  creator,
}: {
  initialItems: FeedItem[];
  routines: RoutineRef[];
  creator: { username: string; displayName: string; avatarUrl?: string };
}) {
  const router = useRouter();
  const [items, setItems] = useState<FeedItem[]>(initialItems);
  const [scope, setScope] = useState<"all" | "published" | "drafts">("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [postDraft, setPostDraft] = useState<PostDraft>(() => ({
    type: "transformation-update",
    text: "",
    tags: "",
    mediaUrl: "",
    routineId: "",
    status: "published",
  }));

  const [editDraft, setEditDraft] = useState<PostDraft>(() => ({
    type: "transformation-update",
    text: "",
    tags: "",
    mediaUrl: "",
    routineId: "",
    status: "published",
  }));

  const routineMap = useMemo(() => new Map(routines.map((r) => [r.id, r])), [routines]);
  const visibleItems = useMemo(() => {
    if (scope === "all") return items;
    if (scope === "drafts") return items.filter((it) => it.status === "draft");
    return items.filter((it) => it.status === "published");
  }, [items, scope]);

  async function interact(postId: string, action: "like" | "save" | "share") {
    setItems((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const viewer = p.viewer ?? { liked: false, saved: false };
        const next = { ...p, viewer: { ...viewer }, metrics: { ...p.metrics } };
        if (action === "like") {
          const liked = !viewer.liked;
          next.viewer.liked = liked;
          next.metrics.likes = Math.max(0, next.metrics.likes + (liked ? 1 : -1));
        }
        if (action === "save") {
          const saved = !viewer.saved;
          next.viewer.saved = saved;
          next.metrics.saves = Math.max(0, next.metrics.saves + (saved ? 1 : -1));
        }
        if (action === "share") {
          next.metrics.shares = Math.max(0, next.metrics.shares + 1);
        }
        return next;
      }),
    );

    try {
      const res = await fetch(`/api/creator/feed/${encodeURIComponent(postId)}/interact`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = (await res.json()) as { ok?: boolean; post?: FeedItem };
      if (res.ok && json.ok === true && json.post) {
        setItems((prev) => prev.map((p) => (p.id === postId ? json.post! : p)));
      }
    } catch {
    }
  }

  async function createPost() {
    setIsPosting(true);
    setPostError(null);
    try {
      const res = await fetch("/api/creator/feed", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: postDraft.type,
          text: postDraft.text,
          tags: parseTags(postDraft.tags),
          mediaUrl: postDraft.mediaUrl,
          routineId: postDraft.routineId || undefined,
          status: postDraft.status,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; post?: FeedItem };
      if (!res.ok || json.ok !== true || !json.post) {
        setPostError(json.error ?? "post_failed");
        return;
      }
      setItems((prev) => [json.post!, ...prev].slice(0, 60));
      setPostDraft({ type: "transformation-update", text: "", tags: "", mediaUrl: "", routineId: "", status: "published" });
      setComposerOpen(false);
      router.refresh();
    } catch {
      setPostError("post_failed");
    } finally {
      setIsPosting(false);
    }
  }

  function openEdit(item: FeedItem) {
    setEditId(item.id);
    setEditDraft({
      type: item.type,
      text: item.text,
      tags: item.tags.join(", "),
      mediaUrl: item.media[0]?.url ?? "",
      routineId: item.routine?.id ?? "",
      status: item.status,
    });
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editId) return;
    setIsPosting(true);
    try {
      const res = await fetch(`/api/creator/feed/${encodeURIComponent(editId)}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: editDraft.type,
          text: editDraft.text,
          tags: parseTags(editDraft.tags),
          mediaUrl: editDraft.mediaUrl,
          routineId: editDraft.routineId || undefined,
          status: editDraft.status,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; post?: FeedItem };
      if (!res.ok || json.ok !== true || !json.post) {
        toast.error("Failed to update post.");
        return;
      }
      setItems((prev) => prev.map((p) => (p.id === editId ? json.post! : p)));
      setEditOpen(false);
      setEditId(null);
      router.refresh();
      toast.success("Post updated.");
    } finally {
      setIsPosting(false);
    }
  }

  async function removePost(postId: string) {
    setBusyId(postId);
    try {
      const res = await fetch(`/api/creator/feed/${encodeURIComponent(postId)}`, { method: "DELETE" });
      const json = (await res.json()) as { ok?: boolean };
      if (res.ok && json.ok === true) {
        setItems((prev) => prev.filter((p) => p.id !== postId));
        router.refresh();
        toast.success("Post deleted.");
      } else {
        toast.error("Failed to delete post.");
      }
    } finally {
      setBusyId(null);
    }
  }

  async function setPostStatus(item: FeedItem, status: "draft" | "published") {
    setBusyId(item.id);
    try {
      const res = await fetch(`/api/creator/feed/${encodeURIComponent(item.id)}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: item.type,
          text: item.text,
          tags: item.tags,
          media: item.media,
          routineId: item.routine?.id ?? undefined,
          status,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; post?: FeedItem };
      if (res.ok && json.ok === true && json.post) {
        setItems((prev) => prev.map((p) => (p.id === item.id ? json.post! : p)));
        router.refresh();
        toast.success(status === "published" ? "Post published." : "Moved to draft.");
      } else {
        toast.error("Failed to update status.");
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Feed</CardTitle>
              <CardDescription>Post updates, routines, and showcases.</CardDescription>
            </div>

            <Sheet open={composerOpen} onOpenChange={setComposerOpen}>
              <SheetTrigger asChild>
                <Button>
                  <Plus data-icon="inline-start" />
                  New post
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Create post</SheetTitle>
                  <SheetDescription>@{creator.username}</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={postDraft.status === "draft"}
                      onCheckedChange={(v) => setPostDraft((p) => ({ ...p, status: v ? "draft" : "published" }))}
                      disabled={isPosting}
                    />
                    <div className="text-sm text-secondary">Save as draft</div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Type</div>
                    <Input
                      value={postDraft.type}
                      onChange={(e) => setPostDraft((p) => ({ ...p, type: e.target.value }))}
                      placeholder="transformation-update | routine | outfit-showcase"
                      disabled={isPosting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Text</div>
                    <Textarea
                      value={postDraft.text}
                      onChange={(e) => setPostDraft((p) => ({ ...p, text: e.target.value }))}
                      placeholder="Write something worth saving."
                      disabled={isPosting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Tags (comma)</div>
                    <Input
                      value={postDraft.tags}
                      onChange={(e) => setPostDraft((p) => ({ ...p, tags: e.target.value }))}
                      placeholder="skincare, barrier, sunscreen"
                      disabled={isPosting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Media URL (optional)</div>
                    <Input
                      value={postDraft.mediaUrl}
                      onChange={(e) => setPostDraft((p) => ({ ...p, mediaUrl: e.target.value }))}
                      placeholder="https://…"
                      disabled={isPosting}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Attach routine (optional)</div>
                    <div className="flex flex-wrap gap-2">
                      {routines.slice(0, 6).map((r) => {
                        const active = postDraft.routineId === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() =>
                              setPostDraft((p) => ({ ...p, routineId: active ? "" : r.id, type: "routine" }))
                            }
                            className={
                              active
                                ? "rounded-full bg-tertiary px-4 py-1.5 text-xs font-bold tracking-wide text-on-tertiary"
                                : "rounded-full bg-surface-container-low px-4 py-1.5 text-xs font-bold tracking-wide text-on-surface"
                            }
                          >
                            {r.title}
                          </button>
                        );
                      })}
                    </div>
                    {postDraft.routineId ? (
                      <div className="text-xs text-secondary">
                        Selected: {routineMap.get(postDraft.routineId)?.title ?? postDraft.routineId}
                      </div>
                    ) : null}
                  </div>

                  {postError ? (
                    <div className="rounded-[1.25rem] bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      Failed to post ({postError}).
                    </div>
                  ) : null}

                  <div className="mt-auto flex flex-col gap-2">
                    <Button disabled={isPosting || postDraft.text.trim().length === 0} onClick={createPost}>
                      {isPosting ? "Posting…" : "Post"}
                    </Button>
                    <Button variant="outline" onClick={() => setComposerOpen(false)} disabled={isPosting}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet open={editOpen} onOpenChange={setEditOpen}>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Edit post</SheetTitle>
                  <SheetDescription>@{creator.username}</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={editDraft.status === "draft"}
                      onCheckedChange={(v) => setEditDraft((p) => ({ ...p, status: v ? "draft" : "published" }))}
                      disabled={isPosting}
                    />
                    <div className="text-sm text-secondary">Draft</div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Type</div>
                    <Input
                      value={editDraft.type}
                      onChange={(e) => setEditDraft((p) => ({ ...p, type: e.target.value }))}
                      disabled={isPosting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Text</div>
                    <Textarea
                      value={editDraft.text}
                      onChange={(e) => setEditDraft((p) => ({ ...p, text: e.target.value }))}
                      disabled={isPosting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Tags (comma)</div>
                    <Input
                      value={editDraft.tags}
                      onChange={(e) => setEditDraft((p) => ({ ...p, tags: e.target.value }))}
                      disabled={isPosting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Media URL (optional)</div>
                    <Input
                      value={editDraft.mediaUrl}
                      onChange={(e) => setEditDraft((p) => ({ ...p, mediaUrl: e.target.value }))}
                      disabled={isPosting}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Attach routine (optional)</div>
                    <div className="flex flex-wrap gap-2">
                      {routines.slice(0, 6).map((r) => {
                        const active = editDraft.routineId === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() =>
                              setEditDraft((p) => ({ ...p, routineId: active ? "" : r.id, type: "routine" }))
                            }
                            className={
                              active
                                ? "rounded-full bg-tertiary px-4 py-1.5 text-xs font-bold tracking-wide text-on-tertiary"
                                : "rounded-full bg-surface-container-low px-4 py-1.5 text-xs font-bold tracking-wide text-on-surface"
                            }
                          >
                            {r.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-2">
                    <Button disabled={isPosting || editDraft.text.trim().length === 0} onClick={saveEdit}>
                      {isPosting ? "Saving…" : "Save"}
                    </Button>
                    <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isPosting}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button type="button" variant={scope === "all" ? "secondary" : "outline"} size="sm" onClick={() => setScope("all")}>
            All
          </Button>
          <Button
            type="button"
            variant={scope === "published" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setScope("published")}
          >
            Published
          </Button>
          <Button type="button" variant={scope === "drafts" ? "secondary" : "outline"} size="sm" onClick={() => setScope("drafts")}>
            Drafts
          </Button>
          <Badge variant="secondary">{visibleItems.length}</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {visibleItems.map((item) => {
          const viewer = item.viewer ?? { liked: false, saved: false };
          const cover = item.media[0]?.url ?? "";

          return (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={creator.avatarUrl} alt={creator.displayName} />
                      <AvatarFallback>{item.creator.displayName.slice(0, 1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-medium text-on-surface">{item.creator.displayName}</div>
                        {item.creator.verified ? <Badge>Verified</Badge> : null}
                        <Badge variant="secondary">{item.type}</Badge>
                        <Badge variant={item.status === "published" ? "default" : "outline"}>{item.status}</Badge>
                      </div>
                      <div className="text-xs text-secondary">
                        @{item.creator.username} · {new Date(item.createdAt).toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.routine ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/creator/routines/${item.routine.id}`}>Open routine</Link>
                      </Button>
                    ) : null}
                    <Button type="button" variant="outline" size="sm" onClick={() => openEdit(item)} disabled={busyId != null}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setPostStatus(item, item.status === "published" ? "draft" : "published")}
                      disabled={busyId != null}
                    >
                      {item.status === "published" ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePost(item.id)}
                      disabled={busyId != null}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm text-on-surface">{item.text}</div>

                {cover ? (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-surface-container-low">
                    <Image src={cover} alt={item.id} fill className="object-cover" sizes="100vw" />
                  </div>
                ) : null}

                {item.routine ? (
                  <div className="rounded-[1.25rem] bg-surface-container-low p-4">
                    <div className="text-xs font-semibold tracking-wide text-secondary">Routine</div>
                    <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-medium text-on-surface">{item.routine.title}</div>
                      <Badge variant="secondary">{item.routine.durationDays} days</Badge>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button variant={viewer.liked ? "default" : "outline"} size="sm" onClick={() => interact(item.id, "like")}>
                      <Heart data-icon="inline-start" />
                      {item.metrics.likes}
                    </Button>
                    <Button variant={viewer.saved ? "secondary" : "outline"} size="sm" onClick={() => interact(item.id, "save")}>
                      <Bookmark data-icon="inline-start" />
                      {item.metrics.saves}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => interact(item.id, "share")}>
                      <Share2 data-icon="inline-start" />
                      {item.metrics.shares}
                    </Button>
                  </div>

                  <Badge variant="secondary">
                    Comments {item.metrics.comments}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
