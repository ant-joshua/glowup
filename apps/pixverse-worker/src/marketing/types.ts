export type MarketingJobStatus = "queued" | "running" | "succeeded" | "failed";

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
  imageShots: string[];
  videoBeats: string[];
};

export type MarketingImageAsset = {
  id: string;
  title: string;
  prompt: string;
  status: MarketingJobStatus;
  startedAt?: string;
  finishedAt?: string;
  output?: {
    imageId?: number;
    imageUrl?: string;
    width?: number;
    height?: number;
  };
  rawSubmit?: unknown;
  error?: { message: string; stderr?: string; exitCode?: number };
};

export type MarketingVideoAsset = {
  id: string;
  title: string;
  prompt: string;
  status: MarketingJobStatus;
  startedAt?: string;
  finishedAt?: string;
  output?: {
    videoId?: number;
    videoUrl?: string;
    thumbnailUrl?: string;
  };
  rawSubmit?: unknown;
  rawResult?: unknown;
  error?: { message: string; stderr?: string; exitCode?: number };
};

export type MarketingJob = {
  id: string;
  status: MarketingJobStatus;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  input: MarketingJobInput;
  progress?: {
    totalAssets: number;
    doneAssets: number;
  };
  output?: {
    images: MarketingImageAsset[];
    videos: MarketingVideoAsset[];
    docsArchivePath?: string;
    docsLatestPath?: string;
  };
  error?: { message: string; stderr?: string; exitCode?: number };
};

export type MarketingArchive = {
  version: 1;
  updatedAt: string;
  items: MarketingJob[];
};

export type MarketingLatest = {
  version: 1;
  updatedAt: string;
  item: MarketingJob | null;
};
