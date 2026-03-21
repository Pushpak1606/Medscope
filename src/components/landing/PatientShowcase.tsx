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

const PatientShowcase = () => (
  <section id="patients" className="py-20 md:py-28">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">For Patients</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Two pathways, one complete care experience
        </h2>
        <p className="mt-4 text-muted-foreground">
          Whether it's physical health or mental wellness, Medscope guides you through a personalized care journey.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Physical */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-border/60 bg-card p-8 md:p-10"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Stethoscope className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Physical Care Pathway</h3>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">
            From medicine identification to live consultations — manage your physical health with AI-powered support.
          </p>
          <div className="space-y-4">
            {physicalSteps.map((s) => (
              <div key={s.text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-foreground">{s.text}</span>
              </div>
            ))}
          </div>
          <a href="#" className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Learn more <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>

        {/* Mental */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-border/60 bg-card p-8 md:p-10"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Mental Health Pathway</h3>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">
            AI-guided mental wellness with journaling, chatbot support, professional consultations, and community connection.
          </p>
          <div className="space-y-4">
            {mentalSteps.map((s) => (
              <div key={s.text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-foreground">{s.text}</span>
              </div>
            ))}
          </div>
          <a href="#" className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Learn more <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PatientShowcase;
