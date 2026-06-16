"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Creator = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  verified: boolean;
  avatar: { url: string; blurhash: string };
  links: {
    instagram: string | null;
    tiktok: string | null;
    youtube: string | null;
    website: string | null;
  };
  stats: {
    followers: number;
    following: number;
    routines: number;
    collections: number;
  };
  updatedAt: string;
};

export function ProfileClient({ creator }: { creator: Creator }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState(() => ({
    displayName: creator.displayName,
    bio: creator.bio,
    avatarUrl: creator.avatar.url,
    instagram: creator.links.instagram ?? "",
    tiktok: creator.links.tiktok ?? "",
    youtube: creator.links.youtube ?? "",
    website: creator.links.website ?? "",
  }));

  async function save() {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/creator/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          displayName: draft.displayName,
          bio: draft.bio,
          avatarUrl: draft.avatarUrl,
          links: {
            instagram: draft.instagram,
            tiktok: draft.tiktok,
            youtube: draft.youtube,
            website: draft.website,
          },
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || json.ok !== true) {
        setError(json.error ?? "save_failed");
        return;
      }
      setIsEditing(false);
      router.refresh();
    } catch {
      setError("save_failed");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Avatar className="size-12">
                <AvatarImage src={creator.avatar.url} alt={creator.displayName} />
                <AvatarFallback>{creator.displayName.slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>{creator.displayName}</CardTitle>
                  {creator.verified ? <Badge>Verified</Badge> : null}
                </div>
                <CardDescription>@{creator.username}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    disabled={isSaving}
                    onClick={() => {
                      setIsEditing(false);
                      setError(null);
                      setDraft({
                        displayName: creator.displayName,
                        bio: creator.bio,
                        avatarUrl: creator.avatar.url,
                        instagram: creator.links.instagram ?? "",
                        tiktok: creator.links.tiktok ?? "",
                        youtube: creator.links.youtube ?? "",
                        website: creator.links.website ?? "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button disabled={isSaving} onClick={save}>
                    {isSaving ? "Saving…" : "Save"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <div className="text-xs font-semibold tracking-wide text-secondary">Display name</div>
                <Input
                  value={draft.displayName}
                  disabled={isSaving}
                  onChange={(e) => setDraft((p) => ({ ...p, displayName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <div className="text-xs font-semibold tracking-wide text-secondary">Bio</div>
                <Textarea
                  value={draft.bio}
                  disabled={isSaving}
                  onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <div className="text-xs font-semibold tracking-wide text-secondary">Avatar URL</div>
                <Input
                  value={draft.avatarUrl}
                  disabled={isSaving}
                  onChange={(e) => setDraft((p) => ({ ...p, avatarUrl: e.target.value }))}
                />
              </div>
            </div>
          ) : (
            <div className="text-sm text-on-surface">{creator.bio}</div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] bg-surface-container-low p-4">
              <div className="text-xs text-secondary">Followers</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums text-on-surface">{creator.stats.followers}</div>
            </div>
            <div className="rounded-[1.25rem] bg-surface-container-low p-4">
              <div className="text-xs text-secondary">Following</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums text-on-surface">{creator.stats.following}</div>
            </div>
            <div className="rounded-[1.25rem] bg-surface-container-low p-4">
              <div className="text-xs text-secondary">Routines</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums text-on-surface">{creator.stats.routines}</div>
            </div>
            <div className="rounded-[1.25rem] bg-surface-container-low p-4">
              <div className="text-xs text-secondary">Collections</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums text-on-surface">{creator.stats.collections}</div>
            </div>
          </div>

          {error ? (
            <div className="rounded-[1.25rem] bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Failed to save ({error}).
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
          <CardDescription>Public links attached to your creator profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isEditing ? (
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold tracking-wide text-secondary">Instagram</div>
                <Input
                  value={draft.instagram}
                  disabled={isSaving}
                  onChange={(e) => setDraft((p) => ({ ...p, instagram: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold tracking-wide text-secondary">TikTok</div>
                <Input
                  value={draft.tiktok}
                  disabled={isSaving}
                  onChange={(e) => setDraft((p) => ({ ...p, tiktok: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold tracking-wide text-secondary">YouTube</div>
                <Input
                  value={draft.youtube}
                  disabled={isSaving}
                  onChange={(e) => setDraft((p) => ({ ...p, youtube: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold tracking-wide text-secondary">Website</div>
                <Input
                  value={draft.website}
                  disabled={isSaving}
                  onChange={(e) => setDraft((p) => ({ ...p, website: e.target.value }))}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {Object.entries(creator.links)
                .filter(([, value]) => Boolean(value))
                .map(([key, value]) => (
                  <a
                    key={key}
                    href={value ?? undefined}
                    className="flex items-center justify-between gap-3 rounded-[1.25rem] bg-surface-container-low px-4 py-3 text-sm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="text-secondary">{key}</div>
                    <div className="truncate font-medium text-on-surface">{value}</div>
                  </a>
                ))}
              {Object.values(creator.links).every((v) => !v) ? (
                <div className="rounded-[1.25rem] bg-surface-container-low px-4 py-3 text-sm text-secondary">
                  No links yet.
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

