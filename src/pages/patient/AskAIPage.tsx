import { useState, useRef, useEffect, useCallback } from "react";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import ChatHistorySidebar, { HistoryToggleButton } from "@/components/patient-dashboard/shared/ChatHistorySidebar";
import { useChatHistory, ChatMessage } from "@/context/ChatHistoryContext";
import { Send, Bot, User, Sparkles, ShieldAlert, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome-1",
  type: "ai",
  text: "Hello! I'm Medscope AI, your personal health companion. I can help you understand your medicines, suggest wellness routines, or provide general health guidance. How can I support you today?",
};

const SUGGESTED_PROMPTS = [
  "What should I know about my Amoxicillin?",
  "Suggest a 10-minute routine for stress.",
  "When should I take my morning medicine?",
  "What diet supports balanced wellness?",
];

const AskAIPage = () => {
  const {
    activeThreadId,
    setActiveThreadId,
    getActiveThread,
    getThreadsForType,
    createThread,
    addMessageToThread,
  } = useChatHistory();

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const threads = getThreadsForType("ask-ai");
  const activeThread = getActiveThread();
  const messages: ChatMessage[] = activeThread?.messages || [WELCOME_MESSAGE];

  // Set active thread on mount
  useEffect(() => {
    if (!activeThreadId || !activeThread || activeThread.type !== "ask-ai") {
      if (threads.length > 0) {
        setActiveThreadId(threads[0].id);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;
      let threadId = activeThreadId;
      if (!threadId || !activeThread || activeThread.type !== "ask-ai") {
        threadId = createThread("ask-ai", WELCOME_MESSAGE);
      }
      const userMsg: ChatMessage = { id: Date.now().toString(), type: "user", text: text.trim() };
      addMessageToThread(threadId, userMsg);
      setInputValue("");
      setIsTyping(true);

      // Auto-resize textarea back
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      setTimeout(() => {
        setIsTyping(false);
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: "I understand you're asking about your health. As an AI health companion, I can help organize your routines and provide general wellness information based on your profile. However, for a specific diagnosis or treatment change, please consult with your primary doctor.",
        };
        addMessageToThread(threadId!, aiResponse);
      }, 1500);
    },
    [activeThreadId, activeThread, isTyping, createThread, addMessageToThread]
  );

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <PatientPageLayout className="!pb-0 sm:!pb-0">
      {/* ─── FULL-HEIGHT CHAT LAYOUT ─── */}
      <div className="flex flex-col h-[calc(100vh-100px)] sm:h-[calc(100vh-110px)] -mt-2">
        
        {/* ─── Compact Header Row ─── */}
        <div className="flex items-center justify-between gap-3 mb-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/patient/dashboard"
              className="shrink-0 h-9 w-9 rounded-xl bg-muted/50 border border-border/30 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold font-heading text-foreground truncate">Ask Medscope AI</h1>
              <p className="text-xs text-muted-foreground truncate hidden sm:block">Your intelligent healthcare assistant</p>
            </div>
          </div>
          <HistoryToggleButton
            onClick={() => setHistoryOpen(!historyOpen)}
            accentColor="blue"
            threadCount={threads.length}
          />
        </div>

        {/* ─── Main Grid (fills remaining height) ─── */}
        <div className={cn(
          "grid gap-4 flex-1 min-h-0",
          historyOpen ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1 lg:grid-cols-12"
        )}>
          {/* History Sidebar */}
          <ChatHistorySidebar
            type="ask-ai"
            accentColor="blue"
            welcomeMessage={WELCOME_MESSAGE}
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
          />

          {/* ─── Chat Column ─── */}
          <div className={cn(
            "flex flex-col min-h-0",
            historyOpen ? "lg:col-span-5" : "lg:col-span-8"
          )}>
            <GlassCard className="flex flex-col flex-1 min-h-0 p-0 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-5 pb-4 space-y-5 hide-scrollbar">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3 sm:gap-4 max-w-[88%]",
                        msg.type === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      <div className={cn(
                        "shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center",
                        msg.type === "user"
                          ? "bg-primary text-white shadow-lg"
                          : "bg-primary/15 text-primary border border-primary/25"
                      )}>
                        {msg.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={cn(
                        "p-3.5 sm:p-4 text-sm leading-relaxed whitespace-pre-wrap",
                        msg.type === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm shadow-sm"
                          : "bg-muted/50 border border-border/50 text-foreground rounded-2xl rounded-tl-sm"
                      )}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3 max-w-[80%] mr-auto"
                    >
                      <div className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary/15 text-primary border border-primary/25 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-muted/50 border border-border/50 rounded-tl-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* ─── Suggested prompts (only show when no user messages yet) ─── */}
              {messages.filter(m => m.type === "user").length === 0 && (
                <div className="px-4 sm:px-6 pb-2">
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x pb-1">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        className="shrink-0 snap-start px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary/5 border border-primary/15 text-primary hover:bg-primary/10 hover:border-primary/30 transition-all whitespace-nowrap"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Input Bar (always visible, bottom of card) ─── */}
              <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-border/30 bg-card/80 backdrop-blur-sm">
                <div className="relative flex items-end gap-2 max-w-2xl mx-auto">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleTextareaChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(inputValue);
                      }
                    }}
                    placeholder="Ask about your health..."
                    className="w-full bg-background border border-border/60 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none min-h-[44px] max-h-[120px] shadow-sm hide-scrollbar transition-all"
                    rows={1}
                  />
                  <LiquidGlassButton
                    onClick={() => handleSend(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-1.5 bottom-1.5 h-9 w-9 p-0 rounded-full flex items-center justify-center shrink-0"
                  >
                    <Send className="h-4 w-4 shrink-0" />
                  </LiquidGlassButton>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ─── Desktop Info Sidebar ─── */}
          <div className={cn(
            "hidden lg:flex flex-col gap-4",
            historyOpen ? "lg:col-span-4" : "lg:col-span-4"
          )}>
            <GlassCard className="p-5">
              <div className="flex items-center gap-2.5 mb-3 text-amber-500">
                <Sparkles className="h-4 w-4" />
                <h3 className="font-bold text-foreground text-sm">Suggested Prompts</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-left p-2.5 rounded-xl text-xs font-medium border border-border/30 bg-background/50 hover:bg-muted/80 hover:border-border/60 transition-all text-muted-foreground hover:text-foreground"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard variant="subtle" className="p-5 border-amber-500/20 bg-amber-500/5">
              <div className="flex items-start gap-2.5 text-amber-600">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium leading-relaxed">
                  Medscope AI provides guidance based on your profile and general medical knowledge. It does not replace professional diagnosis. In emergencies, use the Emergency Support page.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PatientPageLayout>
  );
};

export default AskAIPage;
