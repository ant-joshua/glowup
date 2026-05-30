"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createMarketingAssetJob,
  fetchMarketingAssetArchive,
  fetchMarketingAssetJob,
  fetchMarketingPromptLibrary,
  type MarketingAssetJob,
  type MarketingArchiveResponse,
  type MarketingJobInput,
  type PromptLibraryResponse,
} from "./api";

const ACTIVE_STATUSES = new Set(["queued", "running"]);

export function useMarketingAssetGenerator() {
  const [job, setJob] = useState<MarketingAssetJob | null>(null);
  const [archive, setArchive] = useState<MarketingArchiveResponse["archive"] | null>(
    null,
  );
  const [latest, setLatest] = useState<MarketingArchiveResponse["latest"] | null>(null);
  const [paths, setPaths] = useState<MarketingArchiveResponse["paths"] | null>(null);
  const [promptLibrary, setPromptLibrary] = useState<
    PromptLibraryResponse["collections"]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingArchive, setIsLoadingArchive] = useState(true);
  const [isLoadingPromptLibrary, setIsLoadingPromptLibrary] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArchive = useCallback(async () => {
    setIsLoadingArchive(true);

    try {
      const data = await fetchMarketingAssetArchive();
      setArchive(data.archive ?? null);
      setLatest(data.latest ?? null);
      setPaths(data.paths ?? null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load marketing archive.",
      );
    } finally {
      setIsLoadingArchive(false);
    }
  }, []);

  const loadPromptLibrary = useCallback(async () => {
    setIsLoadingPromptLibrary(true);

    try {
      const data = await fetchMarketingPromptLibrary();
      setPromptLibrary(data.collections ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load prompt library.",
      );
    } finally {
      setIsLoadingPromptLibrary(false);
    }
  }, []);

  const submitJob = useCallback(async (input: MarketingJobInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const nextJob = await createMarketingAssetJob(input);
      setJob(nextJob);
      void loadArchive();
      return nextJob;
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to create marketing asset job.";
      setError(message);
      throw submitError;
    } finally {
      setIsSubmitting(false);
    }
  }, [loadArchive]);

  const refreshJob = useCallback(async (jobId: string) => {
    try {
      const nextJob = await fetchMarketingAssetJob(jobId);
      setJob(nextJob);

      if (!ACTIVE_STATUSES.has(nextJob.status)) {
        void loadArchive();
      }

      return nextJob;
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Unable to refresh marketing asset job.",
      );
      throw refreshError;
    }
  }, [loadArchive]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadArchive();
      void loadPromptLibrary();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadArchive, loadPromptLibrary]);

  useEffect(() => {
    if (!job || !ACTIVE_STATUSES.has(job.status)) {
      return;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const nextJob = await fetchMarketingAssetJob(job.id);

        if (cancelled) {
          return;
        }

        setJob(nextJob);

        if (!ACTIVE_STATUSES.has(nextJob.status)) {
          void loadArchive();
        }
      } catch (pollError) {
        if (!cancelled) {
          setError(
            pollError instanceof Error
              ? pollError.message
              : "Unable to refresh marketing asset job.",
          );
        }
      }
    };

    void poll();

    const timer = window.setInterval(() => {
      void poll();
    }, 2500);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [job, loadArchive]);

  const progress = useMemo(() => {
    const total = job?.progress?.totalAssets ?? 0;
    const done = job?.progress?.doneAssets ?? 0;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, done, percent };
  }, [job]);

  return {
    job,
    archive,
    latest,
    paths,
    promptLibrary,
    isSubmitting,
    isLoadingArchive,
    isLoadingPromptLibrary,
    error,
    progress,
    setJob,
    setError,
    loadArchive,
    loadPromptLibrary,
    submitJob,
    refreshJob,
  };
}
