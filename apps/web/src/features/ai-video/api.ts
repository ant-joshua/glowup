import type {
  CreateVideoJobResponse,
  VideoJob,
  VideoJobResponse,
  VideoTemplate,
  VideoTemplatesResponse,
} from "./types";

function getErrorMessage(
  payload: { error?: string } | null,
  fallback: string,
) {
  if (payload?.error && payload.error.trim()) {
    return payload.error;
  }

  return fallback;
}

export async function fetchVideoTemplates() {
  const response = await fetch("/api/ai-studio/templates", { cache: "no-store" });
  const payload = (await response.json()) as VideoTemplatesResponse;

  if (!response.ok || payload.ok !== true || !Array.isArray(payload.items)) {
    throw new Error(getErrorMessage(payload, "Unable to load video templates."));
  }

  return payload.items as VideoTemplate[];
}

export async function createVideoJob(input: {
  templateId: string;
  variables: Record<string, unknown>;
}) {
  const response = await fetch("/api/ai-studio/jobs", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as CreateVideoJobResponse;

  if (!response.ok || payload.ok !== true || !payload.job) {
    throw new Error(getErrorMessage(payload, "Unable to create video job."));
  }

  return payload.job as VideoJob;
}

export async function fetchVideoJob(jobId: string) {
  const response = await fetch(`/api/ai-studio/jobs/${encodeURIComponent(jobId)}`, {
    cache: "no-store",
  });
  const payload = (await response.json()) as VideoJobResponse;

  if (!response.ok || payload.ok !== true || !payload.job) {
    throw new Error(getErrorMessage(payload, "Unable to refresh video job."));
  }

  return payload.job as VideoJob;
}
