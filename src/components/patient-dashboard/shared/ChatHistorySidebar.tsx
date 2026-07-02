import { useState } from "react";
import { ChatThread, ChatThreadType, useChatHistory, ChatMessage } from "@/context/ChatHistoryContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquarePlus,
  Clock,
  Trash2,
  X,
  MessagesSquare,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isToday, isYesterday, differenceInCalendarDays, format } from "date-fns";

interface ChatHistorySidebarProps {
  type: ChatThreadType;
  accentColor?: string;        // e.g. "blue" or "purple"
  welcomeMessage: ChatMessage;
  isOpen: boolean;
  onClose: () => void;
}

const getAccent = (color: string) => ({
  bg: color === "purple" ? "bg-purple-500" : "bg-primary",
  bgLight: color === "purple" ? "bg-purple-500/10" : "bg-primary/10",
  text: color === "purple" ? "text-purple-500" : "text-primary",
  border: color === "purple" ? "border-purple-500/20" : "border-primary/20",
  hoverBg: color === "purple" ? "hover:bg-purple-500/10" : "hover:bg-primary/10",
  activeBg: color === "purple" ? "bg-purple-500/15" : "bg-primary/15",
  activeBorder: color === "purple" ? "border-purple-500/40" : "border-primary/40",
});

// Group threads by date
const groupThreads = (threads: ChatThread[]) => {
  const groups: { label: string; threads: ChatThread[] }[] = [];
  const today: ChatThread[] = [];
  const yesterday: ChatThread[] = [];
  const thisWeek: ChatThread[] = [];
  const older: ChatThread[] = [];

  threads.forEach((t) => {
    const date = new Date(t.updatedAt);
    if (isToday(date)) today.push(t);
    else if (isYesterday(date)) yesterday.push(t);
    else if (differenceInCalendarDays(new Date(), date) < 7) thisWeek.push(t);
    else older.push(t);
  });

  if (today.length) groups.push({ label: "Today", threads: today });
  if (yesterday.length) groups.push({ label: "Yesterday", threads: yesterday });
  if (thisWeek.length) groups.push({ label: "This Week", threads: thisWeek });
  if (older.length) groups.push({ label: "Older", threads: older });
  return groups;
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
};

const getPreview = (thread: ChatThread) => {
  const lastUserMsg = [...thread.messages].reverse().find((m) => m.type === "user");
  if (lastUserMsg) return lastUserMsg.text.substring(0, 50) + (lastUserMsg.text.length > 50 ? "…" : "");
  return "New conversation";
};

const ChatHistorySidebar = ({
  type,
  accentColor = "blue",
  welcomeMessage,
  isOpen,
  onClose,
}: ChatHistorySidebarProps) => {
  const { getThreadsForType, activeThreadId, setActiveThreadId, createThread, deleteThread } = useChatHistory();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const threads = getThreadsForType(type);
  const grouped = groupThreads(threads);
  const accent = getAccent(accentColor);

  const handleNewChat = () => {
    createThread(type, welcomeMessage);
    onClose();
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    onClose();
  };

  const handleDelete = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    if (deleteConfirm === threadId) {
      deleteThread(threadId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(threadId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessagesSquare className={cn("h-5 w-5", accent.text)} />
          <h3 className="font-bold text-foreground text-sm">Chat History</h3>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3 shrink-0">
        <button
          onClick={handleNewChat}
          className={cn(
            "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border",
            accent.bgLight, accent.text, accent.border,
            "hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-2 pb-4 space-y-4">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Clock className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground font-medium">No conversations yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.threads.map((thread) => {
                  const isActive = thread.id === activeThreadId;
                  const isDeleting = deleteConfirm === thread.id;
                  return (
                    <motion.button
                      key={thread.id}
                      onClick={() => handleSelectThread(thread.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl transition-all duration-200 group relative",
                        isActive
                          ? `${accent.activeBg} border ${accent.activeBorder}`
                          : `hover:bg-muted/50 border border-transparent`
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-semibold truncate",
                            isActive ? "text-foreground" : "text-foreground/80"
                          )}>
                            {thread.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {getPreview(thread)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-muted-foreground/60 hidden group-hover:hidden block">
                            {formatTime(thread.updatedAt)}
                          </span>
                          <button
                            onClick={(e) => handleDelete(e, thread.id)}
                            className={cn(
                              "h-7 w-7 rounded-lg flex items-center justify-center transition-all",
                              isDeleting
                                ? "bg-red-500/20 text-red-500"
                                : "opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                            )}
                            title={isDeleting ? "Click again to confirm" : "Delete"}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      {isActive && (
                        <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full", accent.bg)} />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border/20 shrink-0">
        <p className="text-[10px] text-muted-foreground/40 text-center">
          {threads.length} conversation{threads.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: Inline panel */}
      <div className={cn(
        "hidden lg:flex flex-col bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2rem] shadow-sm overflow-hidden transition-all duration-300",
        isOpen ? "lg:col-span-3 w-full" : "w-0 lg:col-span-0 opacity-0 pointer-events-none absolute"
      )}>
        {sidebarContent}
      </div>

      {/* Mobile: Overlay Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-card border-r border-border/50 z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Toggle button for opening history
export const HistoryToggleButton = ({
  onClick,
  accentColor = "blue",
  threadCount = 0,
}: {
  onClick: () => void;
  accentColor?: string;
  threadCount?: number;
}) => {
  const accent = getAccent(accentColor);
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border",
        accent.bgLight, accent.text, accent.border, accent.hoverBg,
        "hover:scale-[1.02] active:scale-[0.98]"
      )}
      title="Chat History"
    >
      <Clock className="h-4 w-4" />
      <span className="hidden sm:inline">History</span>
      {threadCount > 0 && (
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", accent.bg, "text-white")}>
          {threadCount}
        </span>
      )}
      <ChevronRight className="h-3 w-3 opacity-50" />
    </button>
  );
};

export default ChatHistorySidebar;
