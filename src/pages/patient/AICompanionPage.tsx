import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import ChatHistorySidebar, { HistoryToggleButton } from "@/components/patient-dashboard/shared/ChatHistorySidebar";
import { useChatHistory, ChatMessage } from "@/context/ChatHistoryContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  HeartHandshake,
  User,
  Sparkles,
  ShieldCheck,
  Wind,
  Smile,
  Heart,
  Brain,
  MessageCircle,
  Lightbulb,
  ArrowLeft,
  Copy,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ArrowDown,
  Check,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  type: "ai",
  text: "Hi there 💜 I'm your Medscope Wellness Companion — a safe, supportive space for your emotional health. I'm here to listen, help you practice mindfulness, and support your mental wellness journey.\n\nHow are you feeling right now? You can tell me in your own words, or pick one of the conversation starters.",
};

const COMPANION_PROMPTS = [
  { text: "I'm feeling overwhelmed today", icon: Wind, color: "text-purple-500" },
  { text: "Help me practice gratitude", icon: Heart, color: "text-rose-500" },
  { text: "I need help calming down", icon: Brain, color: "text-blue-500" },
  { text: "Can we do a breathing exercise?", icon: Wind, color: "text-emerald-500" },
  { text: "I want to talk about my feelings", icon: MessageCircle, color: "text-indigo-500" },
  { text: "Share a positive affirmation", icon: Sparkles, color: "text-amber-500" },
];

const AI_RESPONSES: Record<string, string> = {
  "I'm feeling overwhelmed today":
    "I hear you, and I want you to know that feeling overwhelmed is completely valid. Let's take a moment together. Try taking three slow, deep breaths with me — in for 4 counts, hold for 4, out for 6. 🌊\n\nWhen you're ready, can you tell me what's weighing on you the most right now? Sometimes naming it helps take away some of its power.",
  "Help me practice gratitude":
    "I'd love to help with that! Gratitude is like a muscle — the more you practice, the stronger it gets. ✨\n\nLet's try the \"Three Good Things\" exercise. Think about your day so far:\n\n1. Something small that made you smile\n2. A person you're thankful for\n3. One thing about yourself you appreciate\n\nTake your time — there's no rush here.",
  "I need help calming down":
    "I'm right here with you. Let's ground ourselves together. 💜\n\nTry the 5-4-3-2-1 technique:\n• **5** things you can see\n• **4** things you can touch\n• **3** things you can hear\n• **2** things you can smell\n• **1** thing you can taste\n\nFocus on each sense slowly. You are safe, and this feeling will pass.",
  "Can we do a breathing exercise?":
    "LOGGER: Box Breathing Session Initiated 🧘\n\n**4-7-8 Breathing Guide:**\n1. **Inhale** through your nose for 4 seconds.\n2. **Hold** gently for 7 seconds.\n3. **Exhale** completely through your mouth for 8 seconds.\n\nRepeat 3-4 cycles. I'll be right here whenever you finish.",
  "I want to talk about my feelings":
    "I'm glad you want to open up — that takes courage. 💙\n\nThis is a safe, judgment-free space. You can share as much or as little as you'd like.\n\nTo help me understand, start by describing how your body feels (e.g. tight chest, heavy energy, racing thoughts).",
  "Share a positive affirmation":
    "Here are affirmations chosen for you 🌟:\n\n✦ \"I am worthy of love, kindness, and compassion — especially from myself.\"\n✦ \"My feelings are valid, and I give myself permission to process them.\"\n✦ \"Today, I choose progress over perfection.\"",
};

const DEFAULT_RESPONSE =
  "Thank you for sharing that with me. I want you to know that your feelings are completely valid, and it's brave of you to express them. 💜\n\nI'm here to listen and support you. Would you like to:\n\n• Talk more about what you're experiencing\n• Try a calming grounding exercise\n• Explore helpful coping strategies\n\nTake your time — we go at your pace.";

export default function AICompanionPage() {
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
  const [messageCount, setMessageCount] = useState(0);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [lovedMsgIds, setLovedMsgIds] = useState<Record<string, boolean>>({});

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const threads = getThreadsForType("companion");
  const activeThread = getActiveThread();
  const messages: ChatMessage[] = useMemo(
    () => activeThread?.messages || [WELCOME_MESSAGE],
    [activeThread?.messages]
  );

  useEffect(() => {
    if (!activeThreadId || !activeThread || activeThread.type !== "companion") {
      if (threads.length > 0) {
        setActiveThreadId(threads[0].id);
      }
    }
  }, [activeThreadId, activeThread, setActiveThreadId, threads]);

  useEffect(() => {
    const userMsgCount = messages.filter((m) => m.type === "user").length;
    setMessageCount(userMsgCount);
    setShowMoodCheck(false);
  }, [activeThreadId, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
      if (!threadId || !activeThread || activeThread.type !== "companion") {
        threadId = createThread("companion", WELCOME_MESSAGE);
      }
      const userMsg: ChatMessage = { id: Date.now().toString(), type: "user", text: text.trim() };
      addMessageToThread(threadId, userMsg);
      setInputValue("");
      setIsTyping(true);
      const newCount = messageCount + 1;
      setMessageCount(newCount);

      if (textareaRef.current) textareaRef.current.style.height = "auto";

      // TODO (AI Team): Replace mock wellness responses with Wellness Companion LLM endpoint
      const delay = 1200 + Math.random() * 600;
      setTimeout(() => {
        setIsTyping(false);
        const response = AI_RESPONSES[text.trim()] || DEFAULT_RESPONSE;
        const aiResponse: ChatMessage = { id: (Date.now() + 1).toString(), type: "ai", text: response };
        addMessageToThread(threadId!, aiResponse);
        if (newCount === 3 && !showMoodCheck) {
          setTimeout(() => setShowMoodCheck(true), 1000);
        }
      }, delay);
    },
    [activeThreadId, activeThread, isTyping, messageCount, showMoodCheck, createThread, addMessageToThread]
  );

  const handleMoodSelect = (mood: string) => {
    setShowMoodCheck(false);
    let threadId = activeThreadId;
    if (!threadId || !activeThread || activeThread.type !== "companion") {
      threadId = createThread("companion", WELCOME_MESSAGE);
    }
    const userMsg: ChatMessage = { id: Date.now().toString(), type: "user", text: `I'm feeling ${mood.toLowerCase()} right now.` };
    addMessageToThread(threadId, userMsg);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text: `Thank you for checking in — feeling ${mood.toLowerCase()} is completely valid. 💜\n\nAcknowledging your emotional state is an essential step in self-compassion. Would you like to explore what triggered this feeling or practice a relaxing exercise together?`,
      };
      addMessageToThread(threadId!, aiMsg);
    }, 1200);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    toast.success("Affirmation copied!");
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Speech output is not supported on this browser.");
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

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.info("Voice Input simulated: speak into microphone.");
      setIsListening(!isListening);
      if (!isListening) {
        setTimeout(() => {
          setInputValue("Can you share a quick grounding exercise for anxiety?");
          setIsListening(false);
          toast.success("Voice transcribed!");
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
        setInputValue(event.results[0][0].transcript);
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

  const toggleLoveMsg = (id: string) => {
    setLovedMsgIds((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success("Saved to your personal wellness moments 💜");
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 130) + "px";
  };

  return (
    <PatientPageLayout className="!pb-0 sm:!pb-0">
      {/* ─── FULL-HEIGHT CHAT LAYOUT (Mobile Nav Dock Compatible) ─── */}
      <div className="flex flex-col h-[calc(100dvh-230px)] sm:h-[calc(100vh-110px)] -mt-4 sm:-mt-2">
        
        {/* ─── Compact Header Bar ─── */}
        <div className="flex items-center justify-between gap-3 mb-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/patient/wellness"
              className="shrink-0 h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center hover:bg-purple-500/20 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-purple-500" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-extrabold font-heading text-foreground truncate flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-purple-500 shrink-0 hidden sm:block" />
                <span>AI Companion</span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span>Empathy AI</span>
                </span>
              </h1>
              <p className="text-xs text-muted-foreground truncate hidden sm:block">Your compassionate, non-judgmental emotional sanctuary</p>
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
              accentColor="purple"
              threadCount={threads.length}
            />
          </div>
        </div>

        {/* ─── Main Grid Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
          
          {/* History Sidebar */}
          <ChatHistorySidebar
            type="companion"
            accentColor="purple"
            welcomeMessage={WELCOME_MESSAGE}
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
          />

          {/* ─── Chat Viewport Column ─── */}
          <div className={cn(
            "flex flex-col min-h-0",
            historyOpen ? "lg:col-span-8" : "lg:col-span-8"
          )}>
            <GlassCard className="flex flex-col flex-1 min-h-0 p-0 overflow-hidden relative border-purple-500/25 bg-card/60 backdrop-blur-xl shadow-xl">
              
              {/* Soothing Purple Gradient Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-rose-400 rounded-t-[2rem] z-10" />

              {/* Messages Scroll Area */}
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
                          : "bg-purple-500/15 text-purple-400 border border-purple-500/25"
                      )}>
                        {msg.type === "user" ? <User className="h-4 w-4" /> : <HeartHandshake className="h-4 w-4" />}
                      </div>

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className={cn(
                          "p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap rounded-2xl shadow-sm border",
                          msg.type === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-xs border-primary/30 font-medium"
                            : "bg-purple-500/5 border-purple-500/20 text-foreground rounded-tl-xs backdrop-blur-md"
                        )}>
                          {msg.text}
                        </div>

                        {/* AI Response Action Toolbar */}
                        {msg.type === "ai" && (
                          <div className="flex items-center gap-1.5 pt-1 px-1">
                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                              title="Copy text"
                            >
                              {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleSpeak(msg.id, msg.text)}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                speakingMsgId === msg.id ? "text-purple-400 bg-purple-500/10 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                              )}
                              title={speakingMsgId === msg.id ? "Stop voice" : "Listen to voice"}
                            >
                              {speakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => toggleLoveMsg(msg.id)}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                lovedMsgIds[msg.id] ? "text-rose-400 bg-rose-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                              )}
                              title="Save moment"
                            >
                              <Heart className={cn("w-3.5 h-3.5", lovedMsgIds[msg.id] && "fill-rose-400")} />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Mood Check-in Tile */}
                  {showMoodCheck && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="mr-auto max-w-[92%]"
                    >
                      <div className="ml-11 sm:ml-13 p-4 rounded-2xl bg-gradient-to-br from-purple-500/15 via-card/80 to-indigo-500/10 border border-purple-500/30 space-y-2.5">
                        <p className="text-xs font-bold text-foreground flex items-center gap-2">
                          <Smile className="h-4 w-4 text-purple-400" />
                          <span>Quick Mood Reflection</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {["Great", "Good", "Okay", "Rough", "Bad"].map((mood) => (
                            <button
                              key={mood}
                              onClick={() => handleMoodSelect(mood)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-border/60 text-foreground hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-purple-400 transition-all shadow-xs"
                            >
                              {mood}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3 max-w-[80%] mr-auto"
                    >
                      <div className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/25 flex items-center justify-center">
                        <HeartHandshake className="h-4 w-4" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-purple-500/5 border border-purple-500/15 rounded-tl-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} className="h-1" />

                {/* Floating Scroll To Bottom Button */}
                {showScrollBottom && (
                  <button
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 z-20 h-9 w-9 rounded-full bg-purple-500 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    title="Scroll to latest messages"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* ─── Persistent Prompts Bar ─── */}
              <div className="px-4 sm:px-6 pt-2 pb-2 bg-card/40 border-t border-purple-500/15">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar snap-x py-0.5">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Wellness Topics:</span>
                  </span>
                  {COMPANION_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(p.text)}
                      className="shrink-0 snap-start px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-purple-500/20 text-foreground/80 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-400 transition-all whitespace-nowrap flex items-center gap-1.5 shadow-xs"
                    >
                      <p.icon className={cn("h-3 w-3", p.color)} />
                      <span>{p.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── Input Bar ─── */}
              <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-purple-500/20 bg-card/90 backdrop-blur-xl">
                <div className="relative flex items-end gap-2 max-w-3xl mx-auto">
                  <button
                    onClick={toggleVoiceInput}
                    className={cn(
                      "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all",
                      isListening
                        ? "bg-red-500/20 text-red-500 border-red-500/40 animate-pulse"
                        : "bg-card border-purple-500/25 text-purple-400 hover:bg-purple-500/10"
                    )}
                    title={isListening ? "Listening..." : "Voice input"}
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
                    placeholder={isListening ? "Listening to your voice..." : "Share what's on your mind or how you're feeling..."}
                    className="w-full bg-background border border-purple-500/25 rounded-2xl pl-4 pr-12 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none min-h-[44px] max-h-[130px] shadow-sm hide-scrollbar transition-all"
                    rows={1}
                  />

                  <LiquidGlassButton
                    onClick={() => handleSend(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-1.5 bottom-1.5 h-9 w-9 p-0 rounded-full flex items-center justify-center shrink-0 bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    <Send className="h-4 w-4 shrink-0" />
                  </LiquidGlassButton>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ─── Desktop Info Column ─── */}
          <div className="hidden lg:flex flex-col gap-4 lg:col-span-4">
            <GlassCard className="p-5 space-y-3 bg-card/60 backdrop-blur-xl border-purple-500/20">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Lightbulb className="h-4 w-4" />
                <h3>Conversation Starters</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                {COMPANION_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.text)}
                    className="group text-left p-2.5 rounded-xl text-xs font-medium border border-border/40 bg-background/50 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all text-muted-foreground hover:text-foreground flex items-center gap-2.5"
                  >
                    <prompt.icon className={cn("h-3.5 w-3.5 shrink-0 group-hover:scale-110 transition-transform", prompt.color)} />
                    <span>"{prompt.text}"</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard variant="subtle" className="p-5 border-purple-500/20 bg-purple-500/5 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Emotional Safety & Support</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Your conversations are private and end-to-end encrypted. This AI companion is designed for mindfulness and emotional reflection.
              </p>
            </GlassCard>
          </div>

        </div>
      </div>
    </PatientPageLayout>
  );
}

