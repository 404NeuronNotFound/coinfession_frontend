import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ChatMessage } from "@/api/tradingChatApi";

interface TradingChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  lastUpdated: number | null;
  userId: string | null; // Track which user owns this chat
  
  // Actions
  setMessages: (messages: ChatMessage[], userId: string) => void;
  addMessage: (message: ChatMessage) => void;
  setIsOpen: (isOpen: boolean) => void;
  clearMessages: () => void;
  isExpired: () => boolean;
  checkAndClearIfDifferentUser: (currentUserId: string) => void;
}

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

export const useTradingChatStore = create<TradingChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isOpen: false,
      lastUpdated: null,
      userId: null,

      setMessages: (messages, userId) =>
        set({
          messages,
          lastUpdated: Date.now(),
          userId,
        }),

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
          lastUpdated: Date.now(),
        })),

      setIsOpen: (isOpen) => set({ isOpen }),

      clearMessages: () =>
        set({
          messages: [],
          lastUpdated: null,
          userId: null,
        }),

      isExpired: () => {
        const { lastUpdated } = get();
        if (!lastUpdated) return false;
        return Date.now() - lastUpdated > ONE_HOUR;
      },

      checkAndClearIfDifferentUser: (currentUserId) => {
        const { userId } = get();
        // If stored userId doesn't match current user, clear the chat
        if (userId && userId !== currentUserId) {
          get().clearMessages();
        }
      },
    }),
    {
      name: "coinfession-trading-chat",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages,
        lastUpdated: state.lastUpdated,
        userId: state.userId,
      }),
    }
  )
);
