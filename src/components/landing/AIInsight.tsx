import { Sparkles, ScanSearch, Brain, Workflow, Globe, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const insights = [
  { icon: ScanSearch, text: "Analyzes medicine composition, dosage, and classification instantly" },
  { icon: Brain, text: "Supports mental health journeys with guided AI interactions" },
  { icon: Workflow, text: "Organizes treatment workflows for patients and doctors" },
  { icon: Globe, text: "Improves healthcare accessibility for underserved communities" },
];

const AIInsight = () => (
  <section className="relative border-t border-border/40 bg-surface/30 py-20 md:py-28 overflow-hidden">
    {/* Ambient Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
    <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

    <div className="container relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
          <Sparkles className="h-7 w-7" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">AI + Care</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Intelligent care, always at your side
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Medscope's AI doesn't replace doctors — it amplifies their impact. From instant medicine analysis to structured mental health support, our system makes healthcare smarter and more accessible.
        </p>

        <div className="mt-10 space-y-6">
          {insights.map((item, i) => (
            <motion.div 
              key={item.text} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col sm:flex-row sm:items-center gap-4 border-l-2 border-border/50 pl-4 transition-colors hover:border-primary"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border/50 text-muted-foreground shadow-sm transition-colors group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-foreground transition-colors group-hover:text-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Live AI Analysis Mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mx-auto w-full max-w-lg lg:mr-0 lg:max-w-none"
      >
        {/* Glow backdrop */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/30 to-blue-500/20 blur-xl opacity-60 pointer-events-none" />
        
        {/* Mockup Card */}
        <div className="relative rounded-3xl border border-border/50 bg-card/80 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <ScanSearch className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">AI Medicine Scan</span>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Medicine Detected</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">98% Match</span>
              </div>
              <p className="text-lg font-bold text-foreground">Amoxicillin 500mg</p>
              <p className="text-xs text-muted-foreground mt-1">Antibiotic • Allopathic</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dosage Confidence</span>
                <span className="font-semibold text-foreground">High</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "92%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-primary to-blue-400" 
                />
              </div>

              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-muted-foreground">Conflict Check</span>
                <span className="font-semibold text-green-500 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Clear
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-green-500" 
                />
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-primary/5 p-4 border border-primary/10">
              <p className="text-xs leading-relaxed text-foreground"><strong className="text-primary font-bold">AI Note:</strong> Take with food to avoid gastrointestinal upset. Do not skip doses even if you feel better.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default AIInsight;
