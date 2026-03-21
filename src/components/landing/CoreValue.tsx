import { Activity } from "lucide-react";
import { motion } from "framer-motion";

const CoreValue = () => (
  <section className="py-20 md:py-28">
    <div className="container max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Activity className="h-7 w-7 text-primary" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">AI Support</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          AI-powered healthcare companion.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Medscope connects patients with intelligent medicine analysis, personalized reminders, mental health support, and live doctor consultations. Doctors get AI-assisted tools for prescriptions, scheduling, and patient management — all on one platform.
        </p>
      </motion.div>
    </div>
  </section>
);

export default CoreValue;
