import { useState, useRef, useEffect } from "react";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import { Send, Bot, User, Sparkles, Activity, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  type: "user" | "ai";
  text: string;
}

const SUGGESTED_PROMPTS = [
  "What should I know about my Amoxicillin?",
  "Suggest a 10-minute routine for stress.",
  "When should I take my morning medicine?",
  "What diet supports balanced wellness?",
];

const AskAIPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      type: "ai",
      text: "Hello Sarah! I'm Medscope AI, your personal health companion. I can help you understand your medicines, suggest wellness routines, or provide general health guidance. How can I support you today?",
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), type: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text: "I understand you're asking about your health. As an AI health companion, I can help organize your routines and provide general wellness information based on your profile. However, for a specific diagnosis or treatment change, please consult with your primary doctor."
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <PatientPageLayout className="pb-32">
      <PageHeader
        title="Ask Medscope AI"
        subtitle="Chat with your intelligent healthcare assistant about symptoms, medicines, routines, or nutrition."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 relative h-[calc(100vh-280px)] min-h-[600px] mb-12">
        
        {/* Main Chat Area */}
        <GlassCard className="lg:col-span-8 flex flex-col p-4 sm:p-6 overflow-hidden relative">
          
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-24 hide-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 sm:gap-4 max-w-[85%] ${msg.type === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className={`shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${
                    msg.type === "user" ? "bg-primary text-white shadow-lg" : "bg-primary/20 text-primary border border-primary/30"
                  }`}>
                    {msg.type === "user" ? <User className="h-4 w-4 sm:h-5 sm:w-5" /> : <Bot className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </div>
                  
                  <div className={`p-4 rounded-2xl sm:rounded-3xl ${
                    msg.type === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-sm shadow-sm" 
                      : "bg-muted/50 border border-border/50 text-foreground rounded-tl-sm"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-4 max-w-[80%] mr-auto"
                >
                  <div className="shrink-0 h-10 w-10 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="p-4 rounded-3xl bg-muted/50 border border-border/50 rounded-tl-sm flex items-center gap-1.5 h-12">
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Sticky Input Area */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-card/95 via-card/90 to-transparent backdrop-blur-md">
            <div className="relative max-w-2xl mx-auto flex items-end gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(inputValue);
                  }
                }}
                placeholder="Ask about your health..."
                className="w-full bg-background border border-border/60 rounded-3xl pl-5 pr-14 py-3 sm:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[52px] max-h-[120px] shadow-sm hide-scrollbar"
                rows={1}
              />
              <LiquidGlassButton 
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 h-10 w-10 sm:h-11 sm:w-11 p-0 rounded-full flex items-center justify-center shrink-0"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 translate-x-[-1px] translate-y-[1px]" />
              </LiquidGlassButton>
            </div>
          </div>
        </GlassCard>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-bold text-foreground font-heading">Suggested Prompts</h3>
            </div>
            <div className="flex flex-col gap-2">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-left p-3 rounded-xl text-sm font-medium border border-border/40 bg-background/50 hover:bg-muted/80 hover:border-border/80 transition-all text-muted-foreground hover:text-foreground"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard variant="subtle" className="p-6 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-start gap-3 text-amber-600">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">
                Medscope AI provides guidance based on your profile and general medical knowledge. It does not replace professional medical diagnosis. In an emergency, please use the Emergency Support page.
              </p>
            </div>
          </GlassCard>
        </div>

      </div>
    </PatientPageLayout>
  );
};

export default AskAIPage;
