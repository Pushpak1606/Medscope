import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import ChatHistorySidebar, { HistoryToggleButton } from "@/components/patient-dashboard/shared/ChatHistorySidebar";
import { useChatHistory, ChatMessage } from "@/context/ChatHistoryContext";
import { 
  Send, Bot, User, Sparkles, ShieldAlert, ArrowLeft,
  Copy, Volume2, VolumeX, ThumbsUp, ThumbsDown, Mic, MicOff,
  RotateCcw, ArrowDown, Check, Zap, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome-1",
  type: "ai",
  text: "Hello! I'm Medscope AI, your personal healthcare assistant. I can help you analyze medicines, suggest wellness routines, answer clinical questions, or assist with your medical log.\n\nHow can I support your health journey today?",
};

const SUGGESTED_PROMPTS = [
  "What should I know about Amoxicillin?",
  "Suggest a 10-minute routine for stress.",
  "When should I take my morning medicine?",
  "What diet supports balanced wellness?",
  "How do I prepare for a doctor consultation?",
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
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [feedbackState, setFeedbackState] = useState<Record<string, "up" | "down">>({});
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const threads = getThreadsForType("ask-ai");
  const activeThread = getActiveThread();
  const messages: ChatMessage[] = useMemo(
    () => activeThread?.messages || [WELCOME_MESSAGE],
    [activeThread?.messages]
  );

  // Set active thread on mount
  useEffect(() => {
    if (!activeThreadId || !activeThread || activeThread.type !== "ask-ai") {
      if (threads.length > 0) {
        setActiveThreadId(threads[0].id);
      }
    }
  }, [activeThreadId, activeThread, setActiveThreadId, threads]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Track scroll position to toggle floating scroll-to-bottom button
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    if (scrollHeight - scrollTop - clientHeight > 120) {
      setShowScrollBottom(true);
    } else {
      setShowScrollBottom(false);
    }
  };

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

      if (textareaRef.current) textareaRef.current.style.height = "auto";

      // TODO (AI Team): Replace mock string responses with Medscope Clinical LLM / OpenAI / Anthropic API streaming endpoint
      setTimeout(() => {
        setIsTyping(false);
        const aiResponseText = 
          text.toLowerCase().includes("amoxicillin")
            ? "Amoxicillin is a common penicillin-type antibiotic used to treat bacterial infections. Important tips:\n\n• Take it with or without food as prescribed.\n• Complete the full prescribed course even if symptoms improve early.\n• Common side effects include mild nausea or diarrhea; report rash or swelling immediately."
            : text.toLowerCase().includes("stress")
            ? "Here is a 10-minute evidence-based stress reduction routine:\n\n1. **Deep Breathing (3 mins)**: Inhale 4s, hold 4s, exhale 6s.\n2. **Progressive Muscle Relaxation (4 mins)**: Tense and release your shoulders, jaw, and hands.\n3. **Mindful Grounding (3 mins)**: Focus on 5 things you can see and 3 things you hear."
            : "Thank you for reaching out. As your Medscope AI companion, I can analyze your symptoms, organize medications, and offer wellness guidance.\n\nNote: For urgent symptoms or dosage changes, please consult your primary physician or use our SOS Emergency Support.";

        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: aiResponseText,
        };
        addMessageToThread(threadId!, aiResponse);
      }, 1400);
    },
    [activeThreadId, activeThread, isTyping, createThread, addMessageToThread]
  );

  // Copy Message Text
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    toast.success("Message copied to clipboard!");
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Text-To-Speech (TTS)
  const handleSpeak = (id: string, text: string) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported on this browser.");
      return;
    }
    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.info("Voice Recognition feature simulated: speak into microphone.");
      setIsListening(!isListening);
      if (!isListening) {
        setTimeout(() => {
          setInputValue("What are recommended remedies for mild headaches?");
          setIsListening(false);
          toast.success("Voice transcribed successfully!");
        }, 2000);
      }
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        toast.success("Voice transcribed!");
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const handleFeedback = (id: string, type: "up" | "down") => {
    setFeedbackState((prev) => ({ ...prev, [id]: type }));
    toast.success(type === "up" ? "Thanks for your feedback! 👍" : "Feedback recorded. We'll improve response accuracy. 👎");
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 130) + "px";
  };

  return (
    <PatientPageLayout className="!pb-0 sm:!pb-0">
      {/* ─── RESPONSIVE FLEX CONTAINER (Mobile Nav Dock Compatible) ─── */}
      <div className="flex flex-col h-[calc(100dvh-230px)] sm:h-[calc(100vh-110px)] -mt-4 sm:-mt-2">
        
        {/* ─── Sleek Top Header Bar ─── */}
        <div className="flex items-center justify-between gap-3 mb-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/patient/dashboard"
              className="shrink-0 h-9 w-9 rounded-xl bg-card border border-border/50 flex items-center justify-center hover:bg-muted transition-colors shadow-sm"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-extrabold font-heading text-foreground truncate flex items-center gap-2">
                <span>Ask Medscope AI</span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span>AI v3.0 Online</span>
                </span>
              </h1>
              <p className="text-xs text-muted-foreground truncate hidden sm:block">Intelligent clinical guidance & health assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/patient/emergency" className="hidden sm:block">
              <button className="h-9 px-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 text-xs font-bold transition-all flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>SOS Support</span>
              </button>
            </Link>

            <HistoryToggleButton
              onClick={() => setHistoryOpen(!historyOpen)}
              accentColor="blue"
              threadCount={threads.length}
            />
          </div>
        </div>

        {/* ─── Main Grid Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
          
          {/* History Sidebar */}
          <ChatHistorySidebar
            type="ask-ai"
            accentColor="blue"
            welcomeMessage={WELCOME_MESSAGE}
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
          />

          {/* ─── Chat Viewport Column ─── */}
          <div className={cn(
            "flex flex-col min-h-0",
            historyOpen ? "lg:col-span-8" : "lg:col-span-8"
          )}>
            <GlassCard className="flex flex-col flex-1 min-h-0 p-0 overflow-hidden relative border-border/60 bg-card/60 backdrop-blur-xl shadow-lg">
              
              {/* Primary Accent Top Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-cyan-400 rounded-t-[2rem] z-10" />

              {/* Messages Stream */}
              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 sm:px-6 pt-5 pb-4 space-y-6 hide-scrollbar relative"
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "flex gap-3 sm:gap-4 max-w-[92%] sm:max-w-[85%]",
                        msg.type === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      <div className={cn(
                        "shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-2xl flex items-center justify-center font-bold text-xs shadow-md transition-transform",
                        msg.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/15 text-primary border border-primary/25"
                      )}>
                        {msg.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className={cn(
                          "p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm border",
                          msg.type === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-xs border-primary/30 font-medium"
                            : "bg-card/90 border-border/60 text-foreground rounded-tl-xs backdrop-blur-md"
                        )}>
                          {msg.text}
                        </div>

                        {/* AI Message Action Toolbar */}
                        {msg.type === "ai" && (
                          <div className="flex items-center gap-1.5 pt-1 px-1">
                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                              title="Copy response"
                            >
                              {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleSpeak(msg.id, msg.text)}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                speakingMsgId === msg.id ? "text-primary bg-primary/10 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                              )}
                              title={speakingMsgId === msg.id ? "Stop reading" : "Read aloud"}
                            >
                              {speakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-primary animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </button>
                            <div className="h-3 w-px bg-border/40 my-auto mx-0.5" />
                            <button
                              onClick={() => handleFeedback(msg.id, "up")}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                feedbackState[msg.id] === "up" ? "text-emerald-400 bg-emerald-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                              )}
                              title="Helpful response"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.id, "down")}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                feedbackState[msg.id] === "down" ? "text-red-400 bg-red-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                              )}
                              title="Needs improvement"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* AI Typing Waves */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3 max-w-[80%] mr-auto"
                    >
                      <div className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-2xl bg-primary/15 text-primary border border-primary/25 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-card border border-border/50 rounded-tl-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} className="h-1" />

                {/* Floating Scroll To Bottom Button */}
                {showScrollBottom && (
                  <button
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 z-20 h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    title="Scroll to latest messages"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* ─── Persistent Quick Prompts Chip Bar ─── */}
              <div className="px-4 sm:px-6 pt-2 pb-2 bg-card/40 border-t border-border/30">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar snap-x py-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span>Prompts:</span>
                  </span>
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="shrink-0 snap-start px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-border/50 text-foreground/80 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all whitespace-nowrap shadow-xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── Floating Input Controls Container ─── */}
              <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-border/40 bg-card/90 backdrop-blur-xl">
                <div className="relative flex items-end gap-2 max-w-3xl mx-auto">
                  <button
                    onClick={toggleVoiceInput}
                    className={cn(
                      "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all",
                      isListening
                        ? "bg-red-500/20 text-red-500 border-red-500/40 animate-pulse"
                        : "bg-card border-border/60 text-muted-foreground hover:text-primary hover:border-primary/30"
                    )}
                    title={isListening ? "Listening... click to stop" : "Voice dictation"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

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
                    placeholder={isListening ? "Listening to your voice..." : "Ask Medscope AI about symptoms, meds, or health..."}
                    className="w-full bg-background border border-border/60 rounded-2xl pl-4 pr-12 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none min-h-[44px] max-h-[130px] shadow-sm hide-scrollbar transition-all"
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

          {/* ─── Desktop Info & Helper Column ─── */}
          <div className="hidden lg:flex flex-col gap-4 lg:col-span-4">
            <GlassCard className="p-5 space-y-3 bg-card/60 backdrop-blur-xl border-border/50">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Zap className="h-4 w-4" />
                <h3>Medscope AI Capabilities</h3>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Prescription & medication guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Customized wellness & stress reduction routines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Symptom triage & health tracking tips</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard variant="subtle" className="p-5 border-amber-500/20 bg-amber-500/5 space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Clinical Notice</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Medscope AI provides guidance based on general medical guidelines. It is not a substitute for clinical diagnosis. In medical emergencies, contact emergency services immediately.
              </p>
            </GlassCard>
          </div>

        </div>
      </div>
    </PatientPageLayout>
  );
};

export default AskAIPage;

