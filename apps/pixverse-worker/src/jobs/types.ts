export type TemplateFieldType = "text" | "textarea" | "select" | "list";

export type TemplateField = {
  key: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  options?: string[];
};

export type TemplateDefaults = {
  model?: string;
  quality?: string;
  aspectRatio?: string;
  durationSec?: number;
  audio?: boolean;
  multiShot?: boolean;
};

export type Template = {
  id: string;
  title: string;
  description: string;
  fields: TemplateField[];
  defaults?: TemplateDefaults;
  promptTemplate: string;
};

export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export type JobClip = {
  id: string;
  sceneIndex: number;
  sceneTotal: number;
  sceneTitle: string;
  durationSec: number;
  status: "queued" | "running" | "succeeded" | "failed";
  startedAt?: string;
  finishedAt?: string;
  output?: { videoId?: number; videoUrl?: string; thumbnailUrl?: string };
  error?: { message: string; stderr?: string; exitCode?: number };
};

export type JobProgress = {
  totalClips: number;
  doneClips: number;
};

export type JobOutput = {
  clips?: JobClip[];
  rawSubmit?: unknown;
  rawResult?: unknown;
};

export type Job = {
  id: string;
  templateId: string;
  variables: Record<string, unknown>;
  status: JobStatus;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  progress?: JobProgress;
  output?: JobOutput;
  error?: { message: string; stderr?: string; exitCode?: number };
};
