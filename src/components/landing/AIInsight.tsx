import { Sparkles, ScanSearch, Brain, Workflow, Globe } from "lucide-react";
import { motion } from "framer-motion";

const insights = [
  { icon: ScanSearch, text: "Analyzes medicine composition, dosage, and classification instantly" },
  { icon: Brain, text: "Supports mental health journeys with guided AI interactions" },
  { icon: Workflow, text: "Organizes treatment workflows for patients and doctors" },
  { icon: Globe, text: "Improves healthcare accessibility for underserved communities" },
];

const AIInsight = () => (
  <section className="border-t border-border/40 bg-surface py-20 md:py-28">
    <div className="container grid items-center gap-12 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">AI + Care</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Intelligent care, always at your side
        </h2>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Medscope's AI doesn't replace doctors — it amplifies their impact. From instant medicine analysis to structured mental health support, our system makes healthcare smarter and more accessible.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="space-y-5"
      >
        {insights.map((item) => (
          <div key={item.text} className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <p className="text-foreground">{item.text}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default AIInsight;
