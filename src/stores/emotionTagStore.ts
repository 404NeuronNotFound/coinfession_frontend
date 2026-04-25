// ─────────────────────────────────────────────────────────
// stores/emotionTagStore.ts
//
// Zustand store for Emotion Tags state management
// ─────────────────────────────────────────────────────────

import { create } from "zustand";
import {
  EmotionTag,
  SuggestedTag,
  CreateTagPayload,
  UpdateTagPayload,
  TagApiError,
} from "@/types/emotionTag.types";
import {
  fetchEmotionTags,
  createEmotionTag,
  updateEmotionTag,
  deleteEmotionTag,
  fetchSuggestedTags,
} from "@/api/emotionTagApi";

interface EmotionTagState {
  tags: EmotionTag[];
  suggestedTags: SuggestedTag[];
  loading: boolean;
  saving: boolean;
  deletingId: number | null;
  editingId: number | null;
  errors: TagApiError | null;

  // Actions
  loadTags: () => Promise<void>;
  createTag: (payload: CreateTagPayload) => Promise<void>;
  updateTag: (id: number, payload: UpdateTagPayload) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;
  addSuggestedTag: (suggested: SuggestedTag) => Promise<void>;
  setEditingId: (id: number | null) => void;
  clearErrors: () => void;
}

export const useEmotionTagStore = create<EmotionTagState>((set, get) => ({
  tags: [],
  suggestedTags: [],
  loading: false,
  saving: false,
  deletingId: null,
  editingId: null,
  errors: null,

  loadTags: async () => {
    set({ loading: true });
    try {
      const [tags, suggestedTags] = await Promise.all([
        fetchEmotionTags(),
        fetchSuggestedTags(),
      ]);
      set({ tags, suggestedTags });
    } catch (error) {
      console.error("Failed to load emotion tags:", error);
      // Check for 401 and redirect to login
      if ((error as any)?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      set({ loading: false });
    }
  },

  createTag: async (payload: CreateTagPayload) => {
    set({ saving: true, errors: null });
    try {
      const newTag = await createEmotionTag(payload);
      set((state) => ({
        tags: [...state.tags, newTag],
        errors: null,
      }));
      // Re-fetch suggested tags (the new tag may remove one from suggestions)
      try {
        const suggestedTags = await fetchSuggestedTags();
        set({ suggestedTags });
      } catch (error) {
        console.error("Failed to refresh suggested tags:", error);
      }
    } catch (error: any) {
      // Set field-level errors from backend
      if (error?.fieldErrors || error?.detail) {
        set({ errors: error });
      } else {
        set({ errors: { detail: "Failed to create tag" } });
      }
      // Check for 401 and redirect to login
      if (error?.status === 401) {
        window.location.href = "/login";
      }
      throw error;
    } finally {
      set({ saving: false });
    }
  },

  updateTag: async (id: number, payload: UpdateTagPayload) => {
    set({ saving: true, errors: null });
    try {
      const updatedTag = await updateEmotionTag(id, payload);
      set((state) => ({
        tags: state.tags.map((tag) => (tag.id === id ? updatedTag : tag)),
        editingId: null,
        errors: null,
      }));
    } catch (error: any) {
      // Set field-level errors from backend
      if (error?.fieldErrors || error?.detail) {
        set({ errors: error });
      } else {
        set({ errors: { detail: "Failed to update tag" } });
      }
      // Check for 401 and redirect to login
      if (error?.status === 401) {
        window.location.href = "/login";
      }
      throw error;
    } finally {
      set({ saving: false });
    }
  },

  deleteTag: async (id: number) => {
    set({ deletingId: id });
    try {
      await deleteEmotionTag(id);
      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
      }));
      // Re-fetch suggested tags (deleted tag name may reappear in suggestions)
      try {
        const suggestedTags = await fetchSuggestedTags();
        set({ suggestedTags });
      } catch (error) {
        console.error("Failed to refresh suggested tags:", error);
      }
    } catch (error) {
      console.error("Failed to delete tag:", error);
      // Check for 401 and redirect to login
      if ((error as any)?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      set({ deletingId: null });
    }
  },

  addSuggestedTag: async (suggested: SuggestedTag) => {
    await get().createTag({
      name: suggested.name,
      color: suggested.color,
    });
  },

  setEditingId: (id: number | null) => {
    set({ editingId: id, errors: id === null ? null : undefined });
  },

  clearErrors: () => {
    set({ errors: null });
  },
}));
