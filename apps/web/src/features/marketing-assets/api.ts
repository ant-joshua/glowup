export type MarketingAssetJobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed";

export type MarketingAssetJob = {
  id: string;
  status: MarketingAssetJobStatus;
  createdAt: string;
  finishedAt?: string;
  input: {
    campaignName: string;
    productName: string;
    audience?: string;
    pageGoal?: string;
    valueProp?: string;
    cta?: string;
    visualStyle?: string;
    brandNotes?: string;
    imageModel?: string;
    imageQuality?: string;
    imageAspectRatio?: string;
    videoModel?: string;
    videoQuality?: string;
    videoAspectRatio?: string;
    videoDurationSec?: number;
    videoStoryMode?: "single-shot" | "multi-shot";
    imageShots?: string[];
    videoBeats?: string[];
    videoStoryboard?: string[];
  };
  progress?: {
    totalAssets: number;
    doneAssets: number;
  };
  output?: {
    images: Array<{
      id: string;
      title: string;
      prompt: string;
      status: string;
      output?: {
        imageId?: number;
        imageUrl?: string;
        width?: number;
        height?: number;
      };
      error?: { message?: string };
    }>;
    videos: Array<{
      id: string;
      title: string;
      prompt: string;
      storyMode?: "single-shot" | "multi-shot";
      storyboard?: string[];
      status: string;
      output?: {
        videoId?: number;
        videoUrl?: string;
        thumbnailUrl?: string;
      };
      error?: { message?: string };
    }>;
    docsArchivePath?: string;
    docsLatestPath?: string;
  };
  error?: { message?: string };
};

export type MarketingJobInput = {
  campaignName: string;
  productName: string;
  audience: string;
  pageGoal: string;
  valueProp: string;
  cta: string;
  visualStyle: string;
  brandNotes: string;
  imageModel: string;
  imageQuality: string;
  imageAspectRatio: string;
  videoModel: string;
  videoQuality: string;
  videoAspectRatio: string;
  videoDurationSec: number;
  videoStoryMode: "single-shot" | "multi-shot";
  imageShots: string[];
  videoBeats: string[];
  videoStoryboard: string[];
};

export type MarketingArchiveResponse = {
  ok: boolean;
  archive?: {
    version: number;
    updatedAt: string;
    items: MarketingAssetJob[];
  };
  latest?: {
    version: number;
    updatedAt: string;
    item: MarketingAssetJob | null;
  };
  paths?: {
    archive: string;
    latest: string;
  };
  error?: string;
};

export type PromptLibraryResponse = {
  ok: boolean;
  version?: number;
  updatedAt?: string;
  collections?: Array<{
    id: string;
    title: string;
    description: string;
    items: Array<{
      id: string;
      kind: "image" | "video";
      title: string;
      prompt: string;
    }>;
  }>;
  error?: string;
};

function getErrorMessage(payload: { error?: string } | null, fallback: string) {
  if (payload?.error && payload.error.trim()) {
    return payload.error;
  }

  return fallback;
}

export async function createMarketingAssetJob(input: MarketingJobInput) {
  const response = await fetch("/api/marketing-assets/jobs", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as {
    ok: boolean;
    job?: MarketingAssetJob;
    error?: string;
  };

  if (!response.ok || payload.ok !== true || !payload.job) {
    throw new Error(
      getErrorMessage(payload, "Unable to create marketing asset job."),
    );
  }

  return payload.job;
}

export async function fetchMarketingAssetJob(jobId: string) {
  const response = await fetch(
    `/api/marketing-assets/jobs/${encodeURIComponent(jobId)}`,
    {
      cache: "no-store",
    },
  );
  const payload = (await response.json()) as {
    ok: boolean;
    job?: MarketingAssetJob;
    error?: string;
  };

  if (!response.ok || payload.ok !== true || !payload.job) {
    throw new Error(
      getErrorMessage(payload, "Unable to refresh marketing asset job."),
    );
  }

  return payload.job;
}

export async function fetchMarketingAssetArchive() {
  const response = await fetch("/api/marketing-assets/archive", {
    cache: "no-store",
  });
  const payload = (await response.json()) as MarketingArchiveResponse;

  if (!response.ok || payload.ok !== true) {
    throw new Error(
      getErrorMessage(payload, "Unable to load marketing archive."),
    );
  }

  return payload;
}

export async function fetchMarketingPromptLibrary() {
  const response = await fetch("/api/marketing-assets/prompt-library", {
    cache: "no-store",
  });
  const payload = (await response.json()) as PromptLibraryResponse;

  if (
    !response.ok ||
    payload.ok !== true ||
    !Array.isArray(payload.collections)
  ) {
    throw new Error(getErrorMessage(payload, "Unable to load prompt library."));
  }

  return payload;
}
