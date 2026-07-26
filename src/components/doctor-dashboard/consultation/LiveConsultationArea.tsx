import React, { useState } from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import SectionHeader from "../SectionHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  MessageSquare,
  PhoneOff,
  ShieldCheck,
  Signal,
  Send,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export interface LiveConsultationAreaProps {
  patientName?: string;
  doctorName?: string;
}

export const LiveConsultationArea: React.FC<LiveConsultationAreaProps> = ({
  patientName = "Marcus Vance",
  doctorName = "Dr. Sarah Jenkins",
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "System", text: "Encrypted Telehealth exam room initialized.", time: "08:30 AM" },
    { sender: "Marcus Vance", text: "Good morning Dr. Jenkins, I have been feeling chest pressure since 6:30 AM.", time: "08:31 AM" },
    { sender: "Dr. Sarah Jenkins", text: "Good morning Marcus. I have reviewed your ECG traces. Let us evaluate your vitals now.", time: "08:32 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: doctorName, text: newMessage.trim(), time: "08:44 AM" },
    ]);
    setNewMessage("");
  };

  return (
    <section aria-label="Live Telehealth Consultation Section">
      <DoctorGlassCard variant="glow" glowColor="violet" padding="lg" className="border-violet-500/30 space-y-4">
        <SectionHeader
          title="Live Telehealth Consultation"
          subtitle="HD Encrypted WebRTC Exam Room • Real-time patient video stream & clinical chat."
          badge={
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
              <Signal className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span>HD 1080p • 60 FPS Encrypted</span>
            </span>
          }
        />

        {/* Video Canvas Container */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-border/80 min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-4 shadow-2xl">
          
          {/* Top Video Overlay Bar */}
          <div className="flex items-center justify-between gap-4 z-20">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Patient Stream: {patientName}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> HIPAA Compliant
              </span>
            </div>
          </div>

          {/* Main Video Screen Content (Simulated Feed with Gradient Ambient) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <Avatar className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-primary/40 shadow-2xl relative z-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${patientName}`} alt={patientName} />
                <AvatarFallback className="bg-primary/20 text-white font-bold text-3xl">MV</AvatarFallback>
              </Avatar>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-heading">{patientName}</h3>
            <p className="text-xs text-slate-400 font-medium">Virtual Exam Room 3B • Live Connection Active</p>
          </div>

          {/* Doctor Self Picture-in-Picture (PiP) Feed */}
          <div className="absolute bottom-16 right-4 sm:bottom-20 sm:right-6 w-28 sm:w-36 h-20 sm:h-24 rounded-2xl bg-slate-900 border-2 border-primary/40 overflow-hidden shadow-2xl z-20 flex flex-col items-center justify-center text-center">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${doctorName}`} alt={doctorName} />
              <AvatarFallback className="bg-primary text-white text-xs font-bold">DS</AvatarFallback>
            </Avatar>
            <span className="text-[9px] font-bold text-white mt-1 bg-black/60 px-2 py-0.5 rounded-full">
              {doctorName} (You)
            </span>
          </div>

          {/* Bottom Telehealth Interactive Controls Bar */}
          <div className="relative z-20 flex items-center justify-between gap-3 pt-4 border-t border-white/10 bg-slate-950/90 backdrop-blur-xl px-4 py-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setIsMicOn(!isMicOn);
                  toast.info(isMicOn ? "Microphone muted" : "Microphone unmuted");
                }}
                size="icon"
                className={`rounded-xl h-10 w-10 border transition-all ${
                  isMicOn
                    ? "bg-slate-800/90 text-white border-white/20 hover:bg-slate-700/90"
                    : "bg-rose-600 text-white border-rose-500/40 hover:bg-rose-700"
                }`}
              >
                {isMicOn ? <Mic className="h-4 w-4 text-white" /> : <MicOff className="h-4 w-4 text-white" />}
              </Button>

              <Button
                onClick={() => {
                  setIsVideoOn(!isVideoOn);
                  toast.info(isVideoOn ? "Camera turned off" : "Camera turned on");
                }}
                size="icon"
                className={`rounded-xl h-10 w-10 border transition-all ${
                  isVideoOn
                    ? "bg-slate-800/90 text-white border-white/20 hover:bg-slate-700/90"
                    : "bg-rose-600 text-white border-rose-500/40 hover:bg-rose-700"
                }`}
              >
                {isVideoOn ? <VideoIcon className="h-4 w-4 text-white" /> : <VideoOff className="h-4 w-4 text-white" />}
              </Button>

              <Button
                onClick={() => {
                  setIsScreenSharing(!isScreenSharing);
                  toast.info(isScreenSharing ? "Screen sharing stopped" : "Sharing clinical telemetry screen...");
                }}
                className={`rounded-xl h-10 px-3 text-xs font-semibold border gap-1.5 transition-all ${
                  isScreenSharing
                    ? "bg-primary text-white border-primary/50 hover:bg-primary/90"
                    : "bg-slate-800/90 text-white border-white/20 hover:bg-slate-700/90"
                }`}
              >
                <Monitor className="h-4 w-4 text-white" />
                <span className="hidden sm:inline text-white">{isScreenSharing ? "Sharing Screen" : "Share Screen"}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`rounded-xl h-10 px-3 text-xs font-semibold border gap-1.5 relative transition-all ${
                  isChatOpen
                    ? "bg-primary text-white border-primary/50 hover:bg-primary/90"
                    : "bg-slate-800/90 text-white border-white/20 hover:bg-slate-700/90"
                }`}
              >
                <MessageSquare className="h-4 w-4 text-white" />
                <span className="hidden sm:inline text-white">Live Chat</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </Button>

              <Button
                onClick={() => toast.error("Ending consultation session...")}
                className="rounded-xl h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold gap-2 shadow-lg"
              >
                <PhoneOff className="h-4 w-4 text-white" />
                <span className="text-white">End Call</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Live Chat Drawer */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-xs font-bold font-heading text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-primary" /> Encrypted Live Telehealth Chat
                </span>
                <button onClick={() => setIsChatOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-background/60 border border-border/40 text-xs space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                      <span className="text-primary">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-foreground font-medium">{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type message to patient..."
                  className="flex-1 rounded-xl bg-background border border-border/60 px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
                />
                <Button onClick={handleSendMessage} className="rounded-xl bg-primary text-white text-xs h-9 px-3">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DoctorGlassCard>
    </section>
  );
};

export default LiveConsultationArea;
