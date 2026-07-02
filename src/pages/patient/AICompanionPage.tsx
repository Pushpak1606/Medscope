import { useState, useRef, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
    "I'd love to help with that! Gratitude is like a muscle — the more you practice, the stronger it gets. ✨\n\nLet's try the \"Three Good Things\" exercise. Think about your day so far (or yesterday if it's early). Can you share:\n\n1. Something small that made you smile\n2. A person you're thankful for\n3. One thing about yourself you appreciate\n\nTake your time — there's no rush here.",
  "I need help calming down":
    "I'm right here with you. Let's ground ourselves together. 💜\n\nTry the 5-4-3-2-1 technique:\n• **5** things you can see\n• **4** things you can touch\n• **3** things you can hear\n• **2** things you can smell\n• **1** thing you can taste\n\nFocus on each sense slowly. This brings your mind back to the present moment. You're safe, and this feeling will pass.",
  "Can we do a breathing exercise?":
    "Absolutely! Let's do the \"Box Breathing\" technique — it's used by therapists and even navy seals to stay calm. 🧘\n\n**Here's how:**\n1. **Breathe IN** slowly for 4 seconds\n2. **HOLD** your breath for 4 seconds\n3. **Breathe OUT** slowly for 4 seconds\n4. **HOLD** empty for 4 seconds\n\nRepeat this 4 times. I'll be right here when you're done. Take your time — this is your moment of peace.",
  "I want to talk about my feelings":
    "I'm glad you want to open up — that takes courage. 💙\n\nThis is a safe, judgment-free space. You can share as much or as little as you'd like. There are no wrong feelings.\n\nTo help me understand better, you could start with:\n• What emotion are you experiencing right now?\n• When did you first notice it?\n• On a scale of 1-10, how intense does it feel?\n\nRemember, acknowledging your feelings is the first step toward processing them.",
  "Share a positive affirmation":
    "Here are some affirmations chosen just for you. 🌟 Read them slowly, and let the one that resonates most sink in:\n\n✦ \"I am worthy of love, kindness, and compassion — especially from myself.\"\n\n✦ \"My feelings are valid, and I give myself permission to feel them.\"\n\n✦ \"I am stronger than I think, and braver than I feel.\"\n\n✦ \"Today, I choose progress over perfection.\"\n\nWould you like me to share more, or would you like to talk about which one spoke to you?",
};

const DEFAULT_RESPONSE =
  "Thank you for sharing that with me. I want you to know that your feelings are completely valid, and it's brave of you to express them. 💜\n\nI'm here to listen and support you. Would you like to:\n\n• Talk more about what you're experiencing\n• Try a calming exercise together\n• Explore some coping strategies\n• Simply have me listen\n\nThere's no pressure — we go at your pace.";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const threads = getThreadsForType("companion");
  const activeThread = getActiveThread();
  const messages: ChatMessage[] = activeThread?.messages || [WELCOME_MESSAGE];

  useEffect(() => {
    if (!activeThreadId || !activeThread || activeThread.type !== "companion") {
      if (threads.length > 0) {
        setActiveThreadId(threads[0].id);
      }
    }
  }, []);

  useEffect(() => {
    const userMsgCount = messages.filter((m) => m.type === "user").length;
    setMessageCount(userMsgCount);
    setShowMoodCheck(false);
  }, [activeThreadId]);

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

      const delay = 1200 + Math.random() * 800;
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
        text: `Thank you for checking in about your mood — feeling ${mood.toLowerCase()} is perfectly okay. 💜\n\nAcknowledging where you are emotionally is an important part of self-awareness. Would you like to explore what's behind this feeling, or would you prefer to try a mindfulness exercise?`,
      };
      addMessageToThread(threadId!, aiMsg);
    }, 1300);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const hasUserMessages = messages.filter(m => m.type === "user").length > 0;

  return (
    <PatientPageLayout className="!pb-0 sm:!pb-0">
      {/* ─── FULL-HEIGHT CHAT LAYOUT ─── */}
      <div className="flex flex-col h-[calc(100vh-100px)] sm:h-[calc(100vh-110px)] -mt-2">
        
        {/* ─── Compact Header Row ─── */}
        <div className="flex items-center justify-between gap-3 mb-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/patient/wellness"
              className="shrink-0 h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center hover:bg-purple-500/20 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-purple-500" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold font-heading text-foreground truncate flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-purple-500 shrink-0 hidden sm:block" />
                AI Companion
              </h1>
              <p className="text-xs text-muted-foreground truncate hidden sm:block">Your emotional wellness companion</p>
            </div>
          </div>
          <HistoryToggleButton
            onClick={() => setHistoryOpen(!historyOpen)}
            accentColor="purple"
            threadCount={threads.length}
          />
        </div>

        {/* ─── Main Grid (fills remaining height) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
          {/* History Sidebar */}
          <ChatHistorySidebar
            type="companion"
            accentColor="purple"
            welcomeMessage={WELCOME_MESSAGE}
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
          />

          {/* ─── Chat Column ─── */}
          <div className={cn(
            "flex flex-col min-h-0",
            historyOpen ? "lg:col-span-5" : "lg:col-span-8"
          )}>
            <GlassCard className="flex flex-col flex-1 min-h-0 p-0 overflow-hidden relative">
              {/* Purple accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600 rounded-t-[2rem] z-10" />

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-5 pb-4 space-y-5 hide-scrollbar">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex gap-3 sm:gap-4 max-w-[88%]",
                        msg.type === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      <div className={cn(
                        "shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center",
                        msg.type === "user"
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "bg-purple-500/15 text-purple-500 border border-purple-500/25"
                      )}>
                        {msg.type === "user" ? <User className="h-4 w-4" /> : <HeartHandshake className="h-4 w-4" />}
                      </div>
                      <div className={cn(
                        "p-3.5 sm:p-4 text-sm leading-relaxed whitespace-pre-wrap",
                        msg.type === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm shadow-sm"
                          : "bg-purple-500/5 border border-purple-500/15 text-foreground rounded-2xl rounded-tl-sm"
                      )}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}

                  {/* Mood Check-in */}
                  {showMoodCheck && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="mr-auto max-w-[88%]"
                    >
                      <div className="ml-11 sm:ml-[52px] p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Smile className="h-4 w-4 text-purple-500" />
                          Quick mood check-in
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {["Great", "Good", "Okay", "Rough", "Bad"].map((mood) => (
                            <button
                              key={mood}
                              onClick={() => handleMoodSelect(mood)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-border/50 text-foreground hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-600 transition-all"
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
                      <div className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-purple-500/15 text-purple-500 border border-purple-500/25 flex items-center justify-center">
                        <HeartHandshake className="h-4 w-4" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-purple-500/5 border border-purple-500/15 rounded-tl-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-purple-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-purple-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* ─── Prompt chips (only when no user messages yet) ─── */}
              {!hasUserMessages && (
                <div className="px-4 sm:px-6 pb-2">
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x pb-1">
                    {COMPANION_PROMPTS.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(p.text)}
                        className="shrink-0 snap-start px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-500/5 border border-purple-500/15 text-purple-600 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all whitespace-nowrap flex items-center gap-1.5"
                      >
                        <p.icon className={cn("h-3 w-3", p.color)} />
                        {p.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Input Bar (always visible, bottom of card) ─── */}
              <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-purple-500/10 bg-card/80 backdrop-blur-sm">
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
                    placeholder="Share what's on your mind..."
                    className="w-full bg-background border border-purple-500/20 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/30 resize-none min-h-[44px] max-h-[120px] shadow-sm hide-scrollbar transition-all"
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
              <div className="flex items-center gap-2.5 mb-3">
                <Lightbulb className="h-4 w-4 text-purple-500" />
                <h3 className="font-bold text-foreground text-sm">Conversation Starters</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                {COMPANION_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.text)}
                    className="group text-left p-2.5 rounded-xl text-xs font-medium border border-border/30 bg-background/50 hover:bg-purple-500/5 hover:border-purple-500/30 transition-all text-muted-foreground hover:text-foreground flex items-center gap-2.5"
                  >
                    <prompt.icon className={cn("h-3.5 w-3.5 shrink-0 group-hover:scale-110 transition-transform", prompt.color)} />
                    <span>"{prompt.text}"</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard variant="subtle" className="p-5 border-purple-500/15 bg-purple-500/5">
              <div className="flex items-start gap-2.5">
                <HeartHandshake className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1.5">About Your Companion</p>
                  <p className="text-[11px] text-foreground/80 leading-relaxed">
                    Emotional support, mindfulness exercises, and coping strategies in a warm, non-judgmental space.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="subtle" className="p-5 border-emerald-500/15 bg-emerald-500/5">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5">Privacy & Safety</p>
                  <p className="text-[11px] text-foreground/80 leading-relaxed">
                    Your conversations are private and encrypted. This companion supplements — but does not replace — professional mental health care.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PatientPageLayout>
  );
}
