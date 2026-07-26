import React, { useState, useEffect } from "react";
import { useConsultation } from "@/context/ConsultationContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MessageSquare,
  PhoneOff,
  ShieldCheck,
  Signal,
  Send,
  X,
  Sparkles,
  Activity,
  Heart,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const PatientVideoCallModal: React.FC = () => {
  const { isCallActive, activeCallDoctor, endCall, session } = useConsultation();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVitalsOpen, setIsVitalsOpen] = useState(false);

  const [callDuration, setCallDuration] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: "m-1", sender: "System", text: "Encrypted WebRTC Telehealth Exam Room initialized.", time: "Just now", isSystem: true },
    { id: "m-2", sender: activeCallDoctor?.name || session.doctor.name, text: "Good day! I have your medical chart and vitals open. How are you feeling today?", time: "Just now", isDoctor: true },
  ]);

  // Timer counter for call duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive) {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  if (!isCallActive) return null;

  const doctorName = activeCallDoctor?.name || session.doctor.name || "Dr. Sarah Jenkins";
  const doctorSpecialty = activeCallDoctor?.specialty || session.doctor.specialty || "Cardiology & Internal Medicine";
  const avatarSeed = activeCallDoctor?.avatarSeed || doctorName;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: `msg-${Date.now()}`,
      sender: "You",
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isDoctor: false,
    };
    setChatMessages((prev) => [...prev, msg]);
    setNewMessage("");

    // Simulate doctor quick reply after 2.5s
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          sender: doctorName,
          text: "Thank you for sharing. I am noting this down in your SOAP clinical record.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isDoctor: true,
        },
      ]);
    }, 2500);
  };

  const toggleMic = () => {
    setIsMicOn((prev) => !prev);
    toast.info(!isMicOn ? "Microphone Unmuted" : "Microphone Muted");
  };

  const toggleVideo = () => {
    setIsVideoOn((prev) => !prev);
    toast.info(!isVideoOn ? "Camera Turned On" : "Camera Turned Off");
  };

  const toggleScreenShare = () => {
    setIsScreenSharing((prev) => !prev);
    toast.info(!isScreenSharing ? "Screen Sharing Started" : "Screen Sharing Stopped");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl h-[92vh] max-h-[850px] bg-slate-950/90 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col justify-between"
        >
          {/* ─── TOP HEADER BAR ─── */}
          <div className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 flex items-center justify-between gap-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-md">
            {/* Left Doctor Badge */}
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border-2 border-primary/40 shadow-lg shrink-0">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`} alt={doctorName} />
                <AvatarFallback className="bg-primary text-white font-bold">DS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-heading flex items-center gap-2">
                  <span>{doctorName}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                </h3>
                <p className="text-xs text-slate-300 font-medium">{doctorSpecialty}</p>
              </div>
            </div>

            {/* Center Status Indicators */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <Signal className="h-3.5 w-3.5" />
                <span>1080p HD WebRTC Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-200 text-xs font-mono font-bold">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>HIPAA Verified</span>
              </div>
            </div>

            {/* Right Timer & Close */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 text-white font-mono font-bold text-xs sm:text-sm">
                <Clock className="h-4 w-4 text-orange-400 animate-pulse" />
                <span>{formatTime(callDuration)}</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={endCall}
                className="rounded-full bg-white/10 hover:bg-white/20 text-white h-9 w-9"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* ─── MAIN VIDEO STREAM CANVAS ─── */}
          <div className="relative flex-1 w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Doctor Primary Video Feed */}
            {isVideoOn ? (
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-violet-500/30 blur-2xl animate-pulse" />
                  <Avatar className="h-32 w-32 sm:h-44 sm:w-44 border-4 border-primary/50 shadow-[0_0_50px_rgba(59,130,246,0.3)] relative z-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`} alt={doctorName} />
                    <AvatarFallback className="bg-primary text-white text-4xl font-bold">DS</AvatarFallback>
                  </Avatar>

                  {/* Audio Wave Pulsing Indicator */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 border border-primary/40 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Dr. Speaking</span>
                  </div>
                </motion.div>

                <div className="space-y-1 z-10 max-w-md">
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">{doctorName}</h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">Virtual Exam Room 3B • Live Telehealth Feed</p>
                </div>

                {/* AI Live Sync Status Pill */}
                <div className="z-10 bg-card/60 backdrop-blur-xl border border-primary/20 text-foreground px-4 py-2 rounded-2xl text-xs font-medium flex items-center gap-2 shadow-lg max-w-sm">
                  <Sparkles className="h-4 w-4 text-primary shrink-0 animate-pulse" />
                  <span>{session.liveStatusMessage || "Doctor is reviewing your vitals telemetry in real-time."}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 space-y-3 z-10">
                <VideoOff className="h-16 w-16 text-slate-600" />
                <p className="text-sm font-semibold">Video Stream Paused</p>
              </div>
            )}

            {/* ─── PATIENT PICTURE-IN-PICTURE (PIP) SELF-VIEW STREAM ─── */}
            <div className="absolute bottom-20 right-4 sm:bottom-24 sm:right-6 w-32 sm:w-44 h-24 sm:h-32 rounded-2xl bg-slate-900/90 border-2 border-primary/40 overflow-hidden shadow-2xl z-20 flex flex-col items-center justify-center text-center backdrop-blur-md group hover:scale-105 transition-transform">
              {isVideoOn ? (
                <div className="flex flex-col items-center justify-center p-2">
                  <Avatar className="h-10 w-10 sm:h-14 sm:w-14 rounded-full border border-white/20">
                    <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=PatientUser" alt="You" />
                    <AvatarFallback className="bg-primary/30 text-white text-xs font-bold">YOU</AvatarFallback>
                  </Avatar>
                  <span className="text-[10px] text-white font-bold mt-1">You (Patient)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-500">
                  <VideoOff className="h-6 w-6 mb-1" />
                  <span className="text-[10px]">Camera Off</span>
                </div>
              )}

              {/* Mic Status Icon inside PIP */}
              <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white">
                {isMicOn ? <Mic className="h-3 w-3 text-emerald-400" /> : <MicOff className="h-3 w-3 text-red-400" />}
              </div>
            </div>

            {/* ─── LIVE TELEMETRY / VITALS OVERLAY DRAWER ─── */}
            <AnimatePresence>
              {isVitalsOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute top-20 left-4 sm:left-6 z-30 w-72 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-primary" /> Live Vitals Telemetry
                    </h4>
                    <Button variant="ghost" size="icon" onClick={() => setIsVitalsOpen(false)} className="h-6 w-6 text-slate-400 hover:text-white">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-400">Heart Rate</p>
                      <p className="text-base font-extrabold text-emerald-400 flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 fill-emerald-400" /> 72 <span className="text-[10px] font-normal text-slate-400">BPM</span>
                      </p>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-400">Blood Pressure</p>
                      <p className="text-base font-extrabold text-white">118/78 <span className="text-[10px] font-normal text-slate-400">mmHg</span></p>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-400">Oxygen SpO2</p>
                      <p className="text-base font-extrabold text-blue-400">99%</p>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-400">Blood Glucose</p>
                      <p className="text-base font-extrabold text-amber-400">92 <span className="text-[10px] font-normal text-slate-400">mg/dL</span></p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── LIVE CHAT DRAWER OVERLAY ─── */}
            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute top-20 right-4 sm:right-6 bottom-20 z-30 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" /> Live Exam Room Chat
                    </h4>
                    <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)} className="h-6 w-6 text-slate-400 hover:text-white">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto space-y-3 py-3 px-1 scrollbar-thin">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.isSystem ? "items-center text-center" : msg.isDoctor ? "items-start" : "items-end"}`}
                      >
                        {msg.isSystem ? (
                          <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            {msg.text}
                          </span>
                        ) : (
                          <div
                            className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                              msg.isDoctor
                                ? "bg-primary/20 border border-primary/30 text-white rounded-tl-none"
                                : "bg-primary text-white rounded-tr-none shadow-md"
                            }`}
                          >
                            <p className="font-bold text-[10px] text-slate-300 mb-0.5">{msg.sender}</p>
                            <p className="leading-relaxed">{msg.text}</p>
                            <span className="text-[9px] text-slate-400 block text-right mt-1">{msg.time}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Input Row */}
                  <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Type message to doctor..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="bg-slate-950 border-white/10 text-white placeholder:text-slate-500 text-xs rounded-xl h-10"
                    />
                    <Button onClick={handleSendMessage} size="icon" className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-white shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── BOTTOM FLOATING CONTROLS BAR ─── */}
          <div className="p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-30 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            {/* Audio Toggle */}
            <Button
              size="icon"
              onClick={toggleMic}
              className={`h-12 w-12 rounded-2xl border transition-all ${
                isMicOn
                  ? "bg-slate-800/90 border-white/20 text-white hover:bg-slate-700"
                  : "bg-rose-600 border-rose-500/40 text-white hover:bg-rose-700"
              }`}
            >
              {isMicOn ? <Mic className="h-5 w-5 text-white" /> : <MicOff className="h-5 w-5 text-white" />}
            </Button>

            {/* Video Toggle */}
            <Button
              size="icon"
              onClick={toggleVideo}
              className={`h-12 w-12 rounded-2xl border transition-all ${
                isVideoOn
                  ? "bg-slate-800/90 border-white/20 text-white hover:bg-slate-700"
                  : "bg-rose-600 border-rose-500/40 text-white hover:bg-rose-700"
              }`}
            >
              {isVideoOn ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-white" />}
            </Button>

            {/* Screen Share Toggle */}
            <Button
              size="icon"
              onClick={toggleScreenShare}
              className={`h-12 w-12 rounded-2xl border transition-all hidden sm:flex ${
                isScreenSharing
                  ? "bg-primary border-primary text-white hover:bg-primary/90"
                  : "bg-slate-800/90 border-white/20 text-white hover:bg-slate-700"
              }`}
            >
              <Monitor className="h-5 w-5 text-white" />
            </Button>

            {/* Live Vitals Toggle */}
            <Button
              size="icon"
              onClick={() => setIsVitalsOpen((prev) => !prev)}
              className={`h-12 w-12 rounded-2xl border transition-all ${
                isVitalsOpen
                  ? "bg-primary border-primary text-white hover:bg-primary/90"
                  : "bg-slate-800/90 border-white/20 text-white hover:bg-slate-700"
              }`}
            >
              <Activity className="h-5 w-5 text-white" />
            </Button>

            {/* Live Chat Toggle */}
            <Button
              size="icon"
              onClick={() => setIsChatOpen((prev) => !prev)}
              className={`h-12 w-12 rounded-2xl border transition-all relative ${
                isChatOpen
                  ? "bg-primary border-primary text-white hover:bg-primary/90"
                  : "bg-slate-800/90 border-white/20 text-white hover:bg-slate-700"
              }`}
            >
              <MessageSquare className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 text-[9px] font-bold text-slate-950 flex items-center justify-center">
                2
              </span>
            </Button>

            {/* End Call Action Button */}
            <Button
              onClick={endCall}
              className="h-12 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-sm shadow-xl shadow-rose-600/30 gap-2 transition-all hover:scale-105"
            >
              <PhoneOff className="h-5 w-5 text-white" />
              <span className="text-white">End Consultation</span>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PatientVideoCallModal;
