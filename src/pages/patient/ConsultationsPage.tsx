import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Video, Phone, MessageSquare, ChevronRight, User, FileText, Star, Clock10, X, CalendarSearch, CheckCircle2 } from "lucide-react";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useConsultation, Consultation } from "@/context/ConsultationContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const fadeInOptions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function ConsultationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  const {
    upcomingConsultations,
    pastConsultations,
    availableDoctors,
    bookConsultation,
    cancelConsultation,
    joinConsultation,
    rescheduleConsultation
  } = useConsultation();

  // Derived metrics
  const upcomingCount = upcomingConsultations.length;
  const completedCount = pastConsultations.length;
  const notesCount = pastConsultations.filter(c => c.diagnosis).length;

  // Filter history based on tabs
  const filteredHistory = pastConsultations.filter(c => {
    if (activeTab === "all") return true;
    if (activeTab === "video") return c.type === "Video";
    if (activeTab === "clinic") return c.type === "Clinic";
    return true;
  });

  return (
    <PatientPageLayout>
      <motion.div 
        className="w-full flex flex-col gap-8 pb-10"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        
        {/* TOP LAYER: Hero & Summary Metrics */}
        <motion.div variants={fadeInOptions} className="flex flex-col gap-4 relative">
          <PageHeader 
            title="Consultations" 
            subtitle="Manage your upcoming appointments and medical history" 
          />

          <div className="grid grid-cols-3 gap-3 flex-wrap sm:gap-4 mt-2">
            <div className="bg-card/40 border border-border/50 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-md shadow-sm">
              <span className="text-2xl font-bold text-primary">{upcomingCount}</span>
              <span className="text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-wider text-center">Upcoming</span>
            </div>
            <div className="bg-card/40 border border-border/50 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-md shadow-sm">
              <span className="text-2xl font-bold text-foreground">{completedCount}</span>
              <span className="text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-wider text-center">Completed</span>
            </div>
            <div className="bg-card/40 border border-border/50 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-md shadow-sm">
              <span className="text-2xl font-bold text-foreground">{notesCount}</span>
              <span className="text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-wider text-center">Notes</span>
            </div>
          </div>
        </motion.div>

        {/* MIDDLE LAYER: Primary Focus (Active / Upcoming) */}
        <motion.div variants={fadeInOptions} className="flex flex-col gap-3 min-h-[120px]">
          <div className="flex items-center gap-2 px-1">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-lg text-foreground tracking-tight">Upcoming Appointments</h2>
          </div>

          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {upcomingConsultations.map((consult) => (
                <motion.div
                  key={consult.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                >
                  <Card className="rounded-[2rem] border-orange-500/20 bg-gradient-to-br from-card to-orange-500/5 shadow-[0_8px_30px_rgba(249,115,22,0.06)] overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      {consult.type === 'Video' ? <Video className="w-32 h-32" /> :
                       consult.type === 'Audio' ? <Phone className="w-32 h-32" /> :
                       consult.type === 'Clinic' ? <User className="w-32 h-32" /> :
                       <MessageSquare className="w-32 h-32" />}
                    </div>
                    <CardHeader className="pb-4 relative z-10">
                      <div className="flex justify-between items-start">
                        {consult.startsInMins && consult.startsInMins <= 60 ? (
                          <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-500/20 shadow-none px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                            Starts in {consult.startsInMins} mins
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-secondary/80 text-foreground border-border/50 shadow-none px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Scheduled
                          </Badge>
                        )}
                        <div className="flex items-center gap-1.5 text-muted-foreground bg-background/50 px-2 py-1 rounded-lg backdrop-blur-sm text-xs font-semibold border border-border/50">
                          {consult.type === 'Video' ? <Video className="w-3 h-3 text-blue-500" /> :
                           consult.type === 'Audio' ? <Phone className="w-3 h-3 text-emerald-500" /> :
                           consult.type === 'Clinic' ? <User className="w-3 h-3 text-purple-500" /> :
                           <MessageSquare className="w-3 h-3 text-pink-500" />}
                          <span>{consult.type}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 pb-6">
                      <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
                        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-background shadow-md">
                          <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${consult.doctorImg}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                            {consult.doctorImg}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">{consult.doctorName}</h3>
                          <p className="text-muted-foreground font-medium text-sm flex items-center gap-1 mt-0.5">
                            <User className="w-3.5 h-3.5" /> {consult.specialty}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 text-sm font-semibold text-foreground/80">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary border border-border">
                              <Calendar className="w-3.5 h-3.5 text-primary" />
                              {consult.date}
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary border border-border">
                              <Clock className="w-3.5 h-3.5 text-orange-500" />
                              {consult.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="relative z-10 bg-background/40 border-t border-border/50 py-4 px-4 sm:px-6 flex flex-wrap gap-2 sm:gap-3">
                      <Button 
                        onClick={() => joinConsultation(consult.id)}
                        className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all text-sm font-bold min-w-[140px] sm:min-w-[200px]"
                      >
                        {consult.type === 'Clinic' ? 'Get Directions' : (
                           <><Video className="w-4 h-4 mr-2" /> Join Call Now</>
                        )}
                      </Button>
                      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <Button 
                          onClick={() => rescheduleConsultation(consult.id, "Pending Check...", "Pending...")} 
                          variant="outline" 
                          className="flex-1 sm:flex-none rounded-xl border-border/50 hover:bg-muted text-sm font-semibold"
                        >
                          <Clock10 className="w-4 h-4 mr-2 sm:mr-0 xl:mr-2" />
                          <span className="sm:hidden xl:inline">Reschedule</span>
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="flex-1 sm:flex-none rounded-xl border-border/50 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 text-sm font-semibold transition-colors">
                              <X className="w-4 h-4 mr-2 sm:mr-0 xl:mr-2" />
                              <span className="sm:hidden xl:inline">Cancel</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem] sm:max-w-[400px]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-bold">Cancel Consultation?</AlertDialogTitle>
                              <AlertDialogDescription className="text-base text-muted-foreground">
                                Are you sure you want to cancel your appointment with <strong>{consult.doctorName}</strong> on {consult.date} at {consult.time}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                              <AlertDialogCancel className="rounded-xl border-border/50 font-semibold">Keep Appointment</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => cancelConsultation(consult.id)}
                                className="rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 font-bold"
                              >
                                Yes, Cancel
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
              
              {upcomingConsultations.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full rounded-[2rem] border border-dashed border-border p-8 flex flex-col items-center justify-center text-center bg-card/10 backdrop-blur-sm"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">You're all caught up!</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mb-6">You have no upcoming consultations. Book a new appointment below if you need to see a doctor.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* DISCOVERY LAYER: Browse & Book */}
        <motion.div variants={fadeInOptions} className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1 mt-2">
            <h2 className="font-bold text-lg text-foreground tracking-tight flex items-center gap-2">
              <CalendarSearch className="w-5 h-5 text-primary" />
              Available Specialists
            </h2>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-semibold p-0 h-auto">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {availableDoctors.map((doc) => (
              <Card key={doc.id} className="min-w-[240px] max-w-[280px] snap-start shrink-0 rounded-[1.5rem] border-border/50 bg-card/50 backdrop-blur-md hover:bg-card/80 transition-all hover:-translate-y-1 hover:shadow-xl cursor-default group">
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <Avatar className="h-14 w-14 border-2 border-primary/10 shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${doc.img}`} />
                      <AvatarFallback>{doc.img}</AvatarFallback>
                    </Avatar>
                    <Badge variant="secondary" className="flex gap-1 items-center bg-yellow-500/10 text-yellow-600 border-yellow-500/20 font-bold px-2 py-0.5">
                      <Star className="w-3 h-3 fill-yellow-500 stroke-none" /> {doc.rating}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{doc.name}</h4>
                    <p className="text-sm font-medium text-muted-foreground">{doc.specialty}</p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-3 flex flex-col gap-1.5 border border-border/40 shadow-inner">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Next Available</span>
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {doc.nextSlot}
                    </span>
                  </div>
                  <Button 
                    onClick={() => bookConsultation(doc.id, "Video", doc.nextSlot.split(",")[0], doc.nextSlot.split(", ")[1] || "10:00 AM")}
                    className="w-full rounded-xl mt-2 h-10 font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground shadow-none transition-all group-hover:shadow-[0_4px_14px_rgba(59,130,246,0.25)]"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM LAYER: History & Notes */}
        <motion.div variants={fadeInOptions} className="flex flex-col gap-3 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 mb-3 sm:mb-4 gap-3 sm:gap-0">
              <h2 className="font-bold text-lg text-foreground tracking-tight flex items-center gap-2 shrink-0">
                <FileText className="w-5 h-5 text-indigo-500" />
                History & Notes
              </h2>
              
              {/* Custom filter pills — no Radix focus management */}
              <div className="hide-scrollbar overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 w-full sm:w-auto">
                <div className="bg-secondary/50 p-1 border border-border/50 rounded-xl inline-flex w-max gap-0.5">
                  {(["all", "video", "clinic"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-lg text-xs font-bold px-4 py-1.5 transition-all outline-none capitalize ${
                        activeTab === tab
                          ? "bg-background shadow-sm text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab === "all" ? "All" : tab === "video" ? "Video" : "Clinic"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          <Card className="rounded-[1.5rem] border-border/50 bg-card overflow-hidden shadow-sm">
            <div className="flex flex-col divide-y divide-border/50" style={{ minHeight: '120px' }}>
              {filteredHistory.map((consult) => (
                <div 
                  key={consult.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:bg-muted/30 transition-colors group cursor-pointer"
                >
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/10 shadow-inner">
                      {consult.type === 'Video' ? <Video className="w-5 h-5" /> : 
                       consult.type === 'Audio' ? <Phone className="w-5 h-5" /> : 
                       consult.type === 'Clinic' ? <User className="w-5 h-5" /> :
                       <MessageSquare className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-extrabold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">{consult.doctorName}</h4>
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" /> {consult.date} • {consult.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 ml-16 sm:ml-0 mt-2 sm:mt-0">
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Diagnosis</span>
                      <span className="text-xs sm:text-sm font-bold text-foreground bg-background/80 px-2 py-1 rounded-md border border-border/50">
                        {consult.diagnosis || "No notes"}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 shrink-0 shadow-none transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Empty state for filtered results */}
              {filteredHistory.length === 0 && (
                 <div className="p-10 flex flex-col items-center justify-center text-center bg-card/5">
                    <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <p className="font-bold text-foreground text-base">No history found</p>
                    <p className="text-sm font-medium text-muted-foreground mt-1 max-w-[250px]">
                      We couldn't find any past consultations matching your current filter.
                    </p>
                 </div>
              )}
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </PatientPageLayout>
  );
}
