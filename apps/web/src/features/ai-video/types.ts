export type VideoTemplateFieldType = "text" | "textarea" | "select" | "list";

export type VideoTemplateField = {
  key: string;
  label: string;
  type: VideoTemplateFieldType;
  required?: boolean;
  options?: string[];
};

export type VideoTemplate = {
  id: string;
  title: string;
  description: string;
  fields: VideoTemplateField[];
};

export type VideoTemplatesResponse = {
  ok: boolean;
  items?: VideoTemplate[];
  error?: string;
};

export type VideoJobClip = {
  id: string;
  sceneIndex: number;
  sceneTotal: number;
  sceneTitle: string;
  durationSec: number;
  status: "queued" | "running" | "succeeded" | "failed";
  output?: { videoId?: number; videoUrl?: string; thumbnailUrl?: string };
  error?: { message?: string };
};

export type VideoJobOutput = {
  clips?: VideoJobClip[];
};

export type VideoJob = {
  id: string;
  templateId: string;
  status: "queued" | "running" | "succeeded" | "failed";
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  progress?: { totalClips: number; doneClips: number };
  output?: VideoJobOutput;
  error?: { message: string };
};

export type CreateVideoJobResponse = {
  ok: boolean;
  job?: VideoJob;
  error?: string;
};

export type VideoJobResponse = {
  ok: boolean;
  job?: VideoJob;
  error?: string;
};
