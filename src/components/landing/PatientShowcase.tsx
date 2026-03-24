import { Stethoscope, Brain, ArrowRight, Pill, Salad, MessageCircle, BookOpen, Users as UsersIcon, BellRing } from "lucide-react";
import { motion } from "framer-motion";

const physicalSteps = [
  { icon: Pill, text: "Upload medicine photos for AI analysis" },
  { icon: Salad, text: "Get nutrition & exercise guidance" },
  { icon: BellRing, text: "Receive smart reminders" },
  { icon: MessageCircle, text: "Consult doctors via chat & call" },
];

const mentalSteps = [
  { icon: Brain, text: "AI chatbot support & companionship" },
  { icon: BookOpen, text: "Daily journal & wellness tracking" },
  { icon: MessageCircle, text: "Live mental health consultations" },
  { icon: UsersIcon, text: "Join supportive community groups" },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const PatientShowcase = () => (
  <section id="patients" className="py-20 md:py-28 relative overflow-hidden">
    {/* Subtle Background Glow */}
    <div className="absolute top-1/2 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
    <div className="absolute top-1/2 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto mb-16 max-w-2xl text-center"
      >
        <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">For Patients</p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Two pathways, one complete care experience
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Whether it's physical health or mental wellness, Medscope guides you through a personalized care journey.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Physical Pathway Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 md:p-10 shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/5"
        >
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-primary to-blue-400" />
          
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Physical Care Pathway</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your physical health with AI-powered support.
              </p>
            </div>
          </div>

          <motion.div 
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative mt-8 space-y-6 before:absolute before:inset-y-2 before:left-[15px] before:w-[2px] before:bg-border/60"
          >
            {physicalSteps.map((s, i) => (
              <motion.div variants={itemVariants} key={s.text} className="relative flex items-start gap-5">
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[3px] border-card bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                  0{i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground text-sm">{s.text}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <a href="#" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 group-hover:underline">
            Explore physical care features <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Mental Pathway Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 md:p-10 shadow-sm transition-shadow hover:shadow-xl hover:shadow-violet-500/5"
        >
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-violet-500 to-fuchsia-400" />
          
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500 shadow-inner">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Mental Health Pathway</h3>
              <p className="text-sm text-muted-foreground mt-1">
                AI-guided mental wellness and professional support.
              </p>
            </div>
          </div>

          <motion.div 
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative mt-8 space-y-6 before:absolute before:inset-y-2 before:left-[15px] before:w-[2px] before:bg-border/60"
          >
            {mentalSteps.map((s, i) => (
              <motion.div variants={itemVariants} key={s.text} className="relative flex items-start gap-5">
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[3px] border-card bg-violet-500 text-xs font-bold text-white shadow-sm">
                  0{i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className="h-4 w-4 text-violet-500" />
                    <span className="font-semibold text-foreground text-sm">{s.text}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <a href="#" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition-colors hover:text-violet-500 group-hover:underline dark:text-violet-400 dark:hover:text-violet-300">
            Explore mental wellness features <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PatientShowcase;
