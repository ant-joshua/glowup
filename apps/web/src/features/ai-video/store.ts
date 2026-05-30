"use client";

import { create } from "zustand";

import { createVideoJob, fetchVideoTemplates } from "./api";
import type { VideoJob, VideoTemplate, VideoTemplateField } from "./types";

type AiVideoPlaygroundState = {
  templates: VideoTemplate[];
  templateId: string;
  values: Record<string, string>;
  activeJob: VideoJob | null;
  isLoadingTemplates: boolean;
  hasLoadedTemplates: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadTemplates: () => Promise<void>;
  selectTemplate: (templateId: string) => void;
  applyScenario: (
    templateId: string,
    seededValues?: Record<string, string>,
  ) => void;
  updateValue: (key: string, value: string) => void;
  setActiveJob: (job: VideoJob | null) => void;
  setError: (error: string | null) => void;
  submit: () => Promise<VideoJob | null>;
};

function defaultFieldValue(field: VideoTemplateField) {
  if (field.type === "select") {
    return field.options?.[0] ?? "";
  }

  return "";
}

function buildValues(
  template: VideoTemplate | null,
  currentValues: Record<string, string> = {},
) {
  if (!template) {
    return {};
  }

  const nextValues: Record<string, string> = {};

  for (const field of template.fields) {
    nextValues[field.key] =
      currentValues[field.key] ?? defaultFieldValue(field);
  }

  return nextValues;
}

function serializeVariables(
  template: VideoTemplate,
  values: Record<string, string>,
) {
  const variables: Record<string, unknown> = {};

  for (const field of template.fields) {
    const rawValue = values[field.key] ?? "";

    if (field.type === "list") {
      variables[field.key] = rawValue
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean);
      continue;
    }

    variables[field.key] = rawValue.trim();
  }

  return variables;
}

export const useAiVideoPlaygroundStore = create<AiVideoPlaygroundState>(
  (set, get) => ({
    templates: [],
    templateId: "",
    values: {},
    activeJob: null,
    isLoadingTemplates: false,
    hasLoadedTemplates: false,
    isSubmitting: false,
    error: null,
    async loadTemplates() {
      if (get().isLoadingTemplates) {
        return;
      }

      set({ isLoadingTemplates: true, error: null });

      try {
        const templates = await fetchVideoTemplates();
        const currentTemplateId = get().templateId;
        const selectedTemplate =
          templates.find((template) => template.id === currentTemplateId) ??
          templates[0] ??
          null;

        set({
          templates,
          templateId: selectedTemplate?.id ?? "",
          values: buildValues(selectedTemplate, get().values),
          isLoadingTemplates: false,
          hasLoadedTemplates: true,
        });
      } catch (error) {
        set({
          isLoadingTemplates: false,
          hasLoadedTemplates: true,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load video templates.",
        });
      }
    },
    selectTemplate(templateId) {
      const selectedTemplate =
        get().templates.find((template) => template.id === templateId) ?? null;

      set({
        templateId,
        values: buildValues(selectedTemplate),
        activeJob: null,
        error: null,
      });
    },
    applyScenario(templateId, seededValues = {}) {
      const selectedTemplate =
        get().templates.find((template) => template.id === templateId) ?? null;

      set({
        templateId,
        values: {
          ...buildValues(selectedTemplate),
          ...seededValues,
        },
        activeJob: null,
        error: null,
      });
    },
    updateValue(key, value) {
      set((state) => ({
        values: {
          ...state.values,
          [key]: value,
        },
      }));
    },
    setActiveJob(job) {
      set({ activeJob: job });
    },
    setError(error) {
      set({ error });
    },
    async submit() {
      const state = get();
      const selectedTemplate =
        state.templates.find((template) => template.id === state.templateId) ??
        null;

      if (!selectedTemplate || state.isSubmitting) {
        return null;
      }

      set({ isSubmitting: true, error: null });

      try {
        const job = await createVideoJob({
          templateId: selectedTemplate.id,
          variables: serializeVariables(selectedTemplate, get().values),
        });

        set({
          activeJob: job,
          isSubmitting: false,
        });

        return job;
      } catch (error) {
        set({
          isSubmitting: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to create video job.",
        });

        return null;
      }
    },
  }),
);
