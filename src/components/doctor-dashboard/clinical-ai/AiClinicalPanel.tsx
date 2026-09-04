import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Sparkles, Send, Paperclip, Bot, User, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { queryMedscopeAI, AIMessage } from "@/services/aiService";

export interface ChatMessage {
  id: string;
  sender: "doctor" | "ai";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m-1",
    sender: "doctor",
    text: "Review Marcus Vance's latest Troponin T reading (0.14 ng/mL) and ECG ST displacement. What is the recommended emergency treatment timeline?",
    timestamp: "08:35 AM",
  },
  {
    id: "m-2",
    sender: "ai",
    text: "Based on 2026 ACC/AHA STEMI Guidelines:\n1. Door-to-balloon target for primary PCI is <90 minutes.\n2. Administer Aspirin 325mg chewable + Clopidogrel 600mg loading dose immediately.\n3. Initiate continuous telemetry & supplemental O2 if SpO2 < 96%.\n4. Consult Interventional Cardiology emergent Cath Lab team.",
    timestamp: "08:35 AM",
  },
];

const SUGGESTED_PROMPTS = [
  "Draft post-PCI discharge instructions for Marcus Vance",
  "Check Warfarin + Amiodarone drug interaction severity",
  "Summarize 24h Holter monitor telemetry for Sarah Miller",
  "Calculate cardiac risk score for 54yo male with STEMI",
];

export const AiClinicalPanel: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendPrompt = async (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "doctor",
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt("");
    setIsTyping(true);

    try {
      const history: AIMessage[] = [
        ...messages.map((m) => ({
          role: (m.sender === "doctor" ? "user" : "assistant") as "user" | "assistant",
          content: m.text,
        })),
        { role: "user", content: promptText },
      ];

      const aiReplyText = await queryMedscopeAI(history, "clinical-ai");

      const aiReply: ChatMessage = {
        id: `m-ai-${Date.now()}`,
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      toast.error("Failed to reach Medscope AI service: " + (err?.message || "Unknown error"));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section aria-label="AI Clinical Consultation Panel Section">
      <DoctorGlassCard variant="glow" glowColor="violet" padding="lg" className="border-violet-500/30 space-y-4">
        <SectionHeader
          title="Clinical Workspace (Embedded AI Consultation Panel)"
          subtitle="Compact embedded AI clinical dialogue panel for immediate diagnostic queries & literature synthesis."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-violet-500" />
              <span>Embedded Copilot</span>
            </span>
          }
        />

        {/* Suggested Clinical Prompt Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Suggested Clinical Prompts:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(prompt)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/30 shrink-0 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="h-3 w-3 text-violet-500" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Embedded Conversation Box */}
        <div className="p-4 rounded-3xl bg-background/60 border border-border/60 backdrop-blur-xl min-h-[300px] max-h-[420px] overflow-y-auto space-y-3 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                msg.sender === "doctor"
                  ? "bg-primary/10 border border-primary/20 text-foreground ml-6 sm:ml-12"
                  : "bg-card border border-border/60 text-foreground mr-6 sm:mr-12"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1">
                  {msg.sender === "doctor" ? (
                    <User className="h-3 w-3 text-primary" />
                  ) : (
                    <Bot className="h-3 w-3 text-violet-500" />
                  )}
                  <span>{msg.sender === "doctor" ? "Dr. Sarah Jenkins" : "Medscope AI Copilot"}</span>
                </span>
                <span>{msg.timestamp}</span>
              </div>

              <p className="font-medium leading-relaxed whitespace-pre-line">{msg.text}</p>
            </div>
          ))}

          {isTyping && (
            <div className="p-3 rounded-2xl bg-card border border-border/40 text-xs text-muted-foreground animate-pulse flex items-center gap-2">
              <Bot className="h-4 w-4 text-violet-500" />
              <span>Medscope AI is synthesizing clinical rationale...</span>
            </div>
          )}
        </div>

        {/* Prompt Input & Attachment Bar */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => toast.info("Attachment uploaded to AI conversation context.")}
            className="p-2.5 rounded-xl bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
            placeholder="Ask AI clinical query (e.g., 'Summarize Troponin kinetics for STEMI')..."
            className="flex-1 rounded-xl bg-card/80 border border-border/60 px-4 py-2.5 text-xs font-medium text-foreground focus:outline-none focus:border-violet-500"
          />

          <Button
            onClick={() => handleSendPrompt()}
            className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold h-10 px-4 gap-1.5 shadow-md"
          >
            <Send className="h-4 w-4" />
            <span>Send Query</span>
          </Button>
        </div>
      </DoctorGlassCard>
    </section>
  );
};

export default AiClinicalPanel;
