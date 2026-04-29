import { create } from "zustand";
import type {
  APIKeyRecord,
  APIKeySaveResponse,
  APIKeyWritePayload,
  APIKeyPingResult,
} from "@/types/apiKey.types";
import {
  fetchAPIKeys,
  saveAPIKey,
  deleteAPIKey,
  pingAPIKey,
} from "@/api/apiKeyApi";

interface APIKeyState {
  keys: APIKeyRecord[];
  loading: boolean;
  saving: boolean;
  deletingProvider: string | null;
  pingingProvider: string | null;
  pingResults: Record<string, APIKeyPingResult>;
  saveResponse: APIKeySaveResponse | null;
  errors: Record<string, string[]>;
  loadKeys: () => Promise<void>;
  saveKey: (payload: APIKeyWritePayload) => Promise<void>;
  deleteKey: (provider: string) => Promise<void>;
  pingKey: (provider: string) => Promise<void>;
  clearSaveResponse: () => void;
  clearErrors: () => void;
}

export const useAPIKeyStore = create<APIKeyState>((set, get) => ({
  keys: [],
  loading: false,
  saving: false,
  deletingProvider: null,
  pingingProvider: null,
  pingResults: {},
  saveResponse: null,
  errors: {},

  loadKeys: async () => {
    set({ loading: true });
    try {
      const keys = await fetchAPIKeys();
      set({ keys });
    } catch (error: any) {
      console.error("Failed to load API keys:", error);
    } finally {
      set({ loading: false });
    }
  },

  saveKey: async (payload: APIKeyWritePayload) => {
    set({ saving: true, errors: {} });
    try {
      const saveResponse = await saveAPIKey(payload);
      set({ saveResponse });
      await get().loadKeys();
    } catch (error: any) {
      if (error?.key || error?.provider) {
        set({ errors: error });
      } else {
        console.error("Failed to save API key:", error);
      }
    } finally {
      set({ saving: false });
    }
  },

  deleteKey: async (provider: string) => {
    set({ deletingProvider: provider });
    try {
      await deleteAPIKey(provider);
      const { keys } = get();
      set({
        keys: keys.filter((k) => k.provider !== provider),
      });
    } catch (error: any) {
      console.error("Failed to delete API key:", error);
    } finally {
      set({ deletingProvider: null });
    }
  },

  pingKey: async (provider: string) => {
    set({ pingingProvider: provider });
    try {
      const result = await pingAPIKey(provider);
      const { pingResults } = get();
      set({
        pingResults: { ...pingResults, [provider]: result },
      });
    } catch (error: any) {
      const { pingResults } = get();
      set({
        pingResults: {
          ...pingResults,
          [provider]: { ok: false, error: "Failed to ping" },
        },
      });
      console.error("Failed to ping API key:", error);
    } finally {
      set({ pingingProvider: null });
    }
  },

  clearSaveResponse: () => {
    set({ saveResponse: null });
  },

  clearErrors: () => {
    set({ errors: {} });
  },
}));
