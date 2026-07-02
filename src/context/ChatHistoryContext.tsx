import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { secureStorage } from "@/lib/secureStorage";

// ─── Types ───
export interface ChatMessage {
  id: string;
  type: "user" | "ai";
  text: string;
}

export type ChatThreadType = "ask-ai" | "companion";

export interface ChatThread {
  id: string;
  type: ChatThreadType;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ChatHistoryContextType {
  threads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  getThreadsForType: (type: ChatThreadType) => ChatThread[];
  getActiveThread: () => ChatThread | null;
  createThread: (type: ChatThreadType, welcomeMessage: ChatMessage) => string;
  addMessageToThread: (threadId: string, message: ChatMessage) => void;
  deleteThread: (threadId: string) => void;
  renameThread: (threadId: string, title: string) => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

const STORAGE_KEY = "medscope-chat-history";

// Auto-generate a title from the first user message
const generateTitle = (text: string): string => {
  const cleaned = text.replace(/\n/g, " ").trim();
  if (cleaned.length <= 40) return cleaned;
  return cleaned.substring(0, 40).trim() + "…";
};

export const ChatHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    try {
      const stored = secureStorage.getItem<ChatThread[]>(STORAGE_KEY);
      return stored || [];
    } catch {
      return [];
    }
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Persist on change
  useEffect(() => {
    secureStorage.setItem(STORAGE_KEY, threads);
  }, [threads]);

  const getThreadsForType = useCallback(
    (type: ChatThreadType) =>
      threads
        .filter((t) => t.type === type)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [threads]
  );

  const getActiveThread = useCallback(
    () => threads.find((t) => t.id === activeThreadId) || null,
    [threads, activeThreadId]
  );

  const createThread = useCallback(
    (type: ChatThreadType, welcomeMessage: ChatMessage): string => {
      const id = Math.random().toString(36).substring(2, 11);
      const now = new Date().toISOString();
      const newThread: ChatThread = {
        id,
        type,
        title: "New Conversation",
        messages: [welcomeMessage],
        createdAt: now,
        updatedAt: now,
      };
      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(id);
      return id;
    },
    []
  );

  const addMessageToThread = useCallback(
    (threadId: string, message: ChatMessage) => {
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== threadId) return t;
          const updatedMessages = [...t.messages, message];
          // Auto-title from first user message if still default
          let title = t.title;
          if (title === "New Conversation" && message.type === "user") {
            title = generateTitle(message.text);
          }
          return {
            ...t,
            messages: updatedMessages,
            title,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const deleteThread = useCallback(
    (threadId: string) => {
      setThreads((prev) => prev.filter((t) => t.id !== threadId));
      if (activeThreadId === threadId) {
        setActiveThreadId(null);
      }
    },
    [activeThreadId]
  );

  const renameThread = useCallback((threadId: string, title: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, title } : t))
    );
  }, []);

  return (
    <ChatHistoryContext.Provider
      value={{
        threads,
        activeThreadId,
        setActiveThreadId,
        getThreadsForType,
        getActiveThread,
        createThread,
        addMessageToThread,
        deleteThread,
        renameThread,
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = (): ChatHistoryContextType => {
  const ctx = useContext(ChatHistoryContext);
  if (!ctx) {
    throw new Error("useChatHistory must be used within a ChatHistoryProvider");
  }
  return ctx;
};
