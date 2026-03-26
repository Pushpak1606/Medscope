import { Stethoscope, Video, Phone, MessageSquare, User, Calendar, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useConsultation } from "@/context/ConsultationContext";
import { motion, AnimatePresence } from "framer-motion";

const ConsultationWidget = () => {
  const { upcomingConsultations, joinConsultation } = useConsultation();
  
  const upcomingCount = upcomingConsultations.length;
  const nextAppt = upcomingCount > 0 ? upcomingConsultations[0] : null;

  return (
    <div className="h-full flex flex-col rounded-[2.5rem] bg-card p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 relative overflow-hidden group">
      {/* Subtle ambient light */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>
      
      {/* Header section with Link to page */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 text-emerald-500 flex items-center justify-center shrink-0">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-foreground tracking-tight">Consultations</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{upcomingCount} Upcoming</p>
          </div>
        </div>
        <Link to="/patient/consultations">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary transition-colors hover:bg-primary/10">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10 min-h-[160px]">
        <AnimatePresence mode="wait">
          {nextAppt ? (
            <motion.div 
              key="active-consultation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-5 sm:p-6 rounded-3xl bg-background/50 border border-border/50 shadow-sm relative overflow-hidden backdrop-blur-sm transition-all hover:bg-background/80 group/card"
            >
              <div className="flex items-center gap-5 mb-5">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-sm border border-border/50">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${nextAppt.doctorImg}`} alt={nextAppt.doctorName} className="h-full w-full object-cover bg-emerald-50/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground text-lg sm:text-xl truncate">{nextAppt.doctorName}</h4>
                  <p className="text-sm text-muted-foreground font-medium truncate">{nextAppt.specialty}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground mb-6">
                <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-xl border border-border/50 shadow-sm">
                  <Calendar className="h-4 w-4 text-primary" /> {nextAppt.date}
                </div>
                <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-xl border border-border/50 shadow-sm">
                  <Clock className="h-4 w-4 text-emerald-500" /> {nextAppt.time}
                </div>
              </div>

              <Button 
                onClick={() => joinConsultation(nextAppt.id)}
                className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-[0_8px_20px_rgba(5,150,105,0.25)] transition-all border-0 hover:scale-[1.02] active:scale-95 group-hover/card:shadow-[0_8px_30px_rgba(5,150,105,0.35)]"
              >
                {nextAppt.type === 'Video' ? <Video className="mr-2 h-5 w-5" /> : 
                 nextAppt.type === 'Audio' ? <Phone className="mr-2 h-5 w-5" /> : 
                 nextAppt.type === 'Clinic' ? <User className="mr-2 h-5 w-5" /> :
                 <MessageSquare className="mr-2 h-5 w-5" />}
                {nextAppt.type === 'Clinic' ? "Get Directions" : "Join Call"}
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="empty-consultation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full min-h-[220px] rounded-3xl border border-dashed border-border/50 p-6 flex flex-col items-center justify-center text-center bg-card/10 backdrop-blur-sm"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <Stethoscope className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">No upcoming visits</h3>
              <p className="text-muted-foreground text-sm max-w-[200px] mb-6">You're all caught up. Need to see a doctor?</p>
              
              <Link to="/patient/consultations" className="w-full">
                <Button variant="outline" className="w-full h-12 rounded-2xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500 font-bold transition-all shadow-sm">
                  <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConsultationWidget;
