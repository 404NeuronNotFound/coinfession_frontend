import { create } from "zustand";
import type {
  AIFeedbackRecord,
  AIFeedbackPreview,
  GeneratePayload,
} from "@/types/aiFeedback.types";
import {
  fetchAIFeedbackList,
  fetchAIFeedbackPreview,
  generateAIFeedback,
  deleteAIFeedback,
} from "@/api/aiFeedbackApi";

interface AIFeedbackState {
  feedbackList: AIFeedbackRecord[];
  preview: AIFeedbackPreview | null;
  generating: boolean;
  loadingList: boolean;
  loadingPreview: boolean;
  error: string | null;
  generateError: string | null;
  expandedId: number | null;
  loadFeedbackList: () => Promise<void>;
  loadPreview: (year?: number, month?: number) => Promise<void>;
  generate: (payload?: GeneratePayload) => Promise<void>;
  deleteFeedback: (id: number) => Promise<void>;
  toggleExpanded: (id: number) => void;
}

export const useAIFeedbackStore = create<AIFeedbackState>((set, get) => ({
  feedbackList: [],
  preview: null,
  generating: false,
  loadingList: false,
  loadingPreview: false,
  error: null,
  generateError: null,
  expandedId: null,

  loadFeedbackList: async () => {
    set({ loadingList: true, error: null });
    try {
      const feedbackList = await fetchAIFeedbackList();
      set({ feedbackList });
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to load feedback list";
      set({ error: errorMessage });
      console.error("Failed to load feedback list:", error);
    } finally {
      set({ loadingList: false });
    }
  },

  loadPreview: async (year?: number, month?: number) => {
    set({ loadingPreview: true });
    try {
      const preview = await fetchAIFeedbackPreview(year, month);
      set({ preview });
    } catch (error: any) {
      console.error("Failed to load preview:", error);
    } finally {
      set({ loadingPreview: false });
    }
  },

  generate: async (payload?: GeneratePayload) => {
    set({ generating: true, generateError: null });
    try {
      const newRecord = await generateAIFeedback(payload);
      const { feedbackList } = get();
      set({
        feedbackList: [newRecord, ...feedbackList],
        expandedId: newRecord.id,
      });
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.error ||
        "Failed to generate feedback";
      set({ generateError: errorMessage });
      console.error("Failed to generate feedback:", error);
    } finally {
      set({ generating: false });
    }
  },

  deleteFeedback: async (id: number) => {
    try {
      await deleteAIFeedback(id);
      const { feedbackList } = get();
      set({
        feedbackList: feedbackList.filter((f) => f.id !== id),
      });
    } catch (error: any) {
      console.error("Failed to delete feedback:", error);
    }
  },

  toggleExpanded: (id: number) => {
    const { expandedId } = get();
    set({ expandedId: expandedId === id ? null : id });
  },
}));
