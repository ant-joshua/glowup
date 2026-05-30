"use client";

import { useEffect, useMemo } from "react";

import { fetchVideoJob } from "./api";
import { useAiVideoPlaygroundStore } from "./store";

const ACTIVE_JOB_STATUSES = new Set(["queued", "running"]);

export function useAiVideoPlayground() {
  const templates = useAiVideoPlaygroundStore((state) => state.templates);
  const templateId = useAiVideoPlaygroundStore((state) => state.templateId);
  const values = useAiVideoPlaygroundStore((state) => state.values);
  const activeJob = useAiVideoPlaygroundStore((state) => state.activeJob);
  const isLoadingTemplates = useAiVideoPlaygroundStore(
    (state) => state.isLoadingTemplates,
  );
  const hasLoadedTemplates = useAiVideoPlaygroundStore(
    (state) => state.hasLoadedTemplates,
  );
  const isSubmitting = useAiVideoPlaygroundStore((state) => state.isSubmitting);
  const error = useAiVideoPlaygroundStore((state) => state.error);
  const loadTemplates = useAiVideoPlaygroundStore(
    (state) => state.loadTemplates,
  );
  const selectTemplate = useAiVideoPlaygroundStore(
    (state) => state.selectTemplate,
  );
  const applyScenario = useAiVideoPlaygroundStore(
    (state) => state.applyScenario,
  );
  const updateValue = useAiVideoPlaygroundStore((state) => state.updateValue);
  const setActiveJob = useAiVideoPlaygroundStore((state) => state.setActiveJob);
  const setError = useAiVideoPlaygroundStore((state) => state.setError);
  const submit = useAiVideoPlaygroundStore((state) => state.submit);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === templateId) ?? null,
    [templateId, templates],
  );

  const canSubmit = useMemo(() => {
    if (!selectedTemplate || isSubmitting) {
      return false;
    }

    for (const field of selectedTemplate.fields) {
      if (!field.required) {
        continue;
      }

      const value = values[field.key] ?? "";

      if (!value.trim()) {
        return false;
      }
    }

    return true;
  }, [isSubmitting, selectedTemplate, values]);

  useEffect(() => {
    if (!hasLoadedTemplates && !isLoadingTemplates) {
      void loadTemplates();
    }
  }, [hasLoadedTemplates, isLoadingTemplates, loadTemplates]);

  useEffect(() => {
    if (!activeJob || !ACTIVE_JOB_STATUSES.has(activeJob.status)) {
      return;
    }

    let cancelled = false;

    const refresh = async () => {
      try {
        const nextJob = await fetchVideoJob(activeJob.id);

        if (!cancelled) {
          setActiveJob(nextJob);
        }
      } catch (refreshError) {
        if (!cancelled) {
          setError(
            refreshError instanceof Error
              ? refreshError.message
              : "Unable to refresh video job.",
          );
        }
      }
    };

    void refresh();

    const intervalId = window.setInterval(() => {
      void refresh();
    }, 2500);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [activeJob, setActiveJob, setError]);

  return {
    templates,
    templateId,
    values,
    activeJob,
    isLoadingTemplates,
    hasLoadedTemplates,
    isSubmitting,
    error,
    selectedTemplate,
    canSubmit,
    loadTemplates,
    selectTemplate,
    applyScenario,
    updateValue,
    setError,
    submit,
  };
}
