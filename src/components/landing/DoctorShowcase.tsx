import { Stethoscope, ClipboardList, CalendarDays, Users, UserCheck, ArrowRight, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const doctorFeatures = [
  { icon: Stethoscope, title: "AI Prescription Assist", desc: "Get AI-based medicine suggestions based on disease and symptoms." },
  { icon: ClipboardList, title: "Patient Details Access", desc: "View comprehensive patient history and treatment records." },
  { icon: CalendarDays, title: "Schedule Management", desc: "Organize daily appointments and consultation slots efficiently." },
  { icon: Users, title: "Community Discussions", desc: "Participate in professional communities and case discussions." },
  { icon: UserCheck, title: "Assistant Doctor Support", desc: "Backup doctor availability when the primary doctor is unavailable." },
];

const DoctorShowcase = () => (
  <section id="doctors" className="relative border-t border-border/40 bg-surface/50 py-20 md:py-28 overflow-hidden">
    {/* Subtle Background Radial */}
    <div className="pointer-events-none absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/5 blur-[100px]" />
    
    <div className="container relative z-10">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">For Doctors</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            A smarter dashboard for modern practitioners
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground text-lg">
            Medscope empowers doctors with AI-assisted prescription guidance, streamlined scheduling, patient management, and professional community access.
          </p>
          
          <div className="mt-8 space-y-5">
            {doctorFeatures.map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border/50 text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary shadow-sm">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">{f.title}</h4>
                  <p className="mt-0.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <a href="#" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 group-hover:underline">
            Explore doctor features <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Right Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto w-full max-w-lg lg:mr-0 lg:max-w-none"
        >
          {/* Decorative glow behind mockup */}
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-primary/30 to-violet-500/20 blur-xl opacity-50 pointer-events-none" />
          
          {/* Main Dashboard Panel */}
          <div className="relative rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-2xl p-6 shadow-2xl flex flex-col gap-6 w-full overflow-hidden">
            {/* Top Bar Highlight */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-400 to-transparent" />
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Today's Schedule</h3>
                <p className="text-xs text-muted-foreground">3 Appointments pending</p>
              </div>
              <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Dashboard Cards Content */}
            <div className="flex flex-col gap-4">
              
              {/* Appointment Card 1 */}
              <motion.div 
                whileHover={{ x: 4 }}
                className="rounded-2xl border border-border/50 bg-background/80 p-4 transition-transform"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-sm">
                      SJ
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Sarah Jenkins</p>
                      <p className="text-xs text-muted-foreground">10:00 AM • Video Call</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-600 uppercase tracking-wide">
                    Waiting
                  </span>
                </div>
                {/* AI Notification Pill */}
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 border border-primary/10">
                  <Stethoscope className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary">AI has generated a preliminary prescription</span>
                </div>
              </motion.div>

              {/* Appointment Card 2 */}
              <motion.div 
                whileHover={{ x: 4 }}
                className="rounded-2xl border border-border/50 bg-background/80 p-4 transition-transform opacity-75"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold text-sm">
                      MR
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Marcus Reed</p>
                      <p className="text-xs text-muted-foreground">11:30 AM • In Clinic</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-600 uppercase tracking-wide">
                    <CheckCircle2 className="h-3 w-3" /> Confirmed
                  </span>
                </div>
              </motion.div>

              {/* Community Snippet Card */}
              <div className="mt-2 rounded-xl bg-violet-500/5 p-4 border border-violet-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500">
                    <Users className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-medium text-foreground">New case discussion in Cardiology group</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default DoctorShowcase;
