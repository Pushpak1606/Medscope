import { Pill, BellRing, Video, Brain, Apple, Users } from "lucide-react";
import { motion } from "framer-motion";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

const features = [
  {
    icon: Pill,
    title: "AI Medicine Assistant",
    description: "Upload medicine photos or notes and get instant details — dosage, content, timing, disease relevance, and whether it's Ayurvedic or allopathic.",
  },
  {
    icon: BellRing,
    title: "Smart Reminders",
    description: "Never miss a dose or meal. Medscope sends timely reminders for medicine intake, meals, and health check-ins throughout the day.",
  },
  {
    icon: Video,
    title: "Live Doctor Consultation",
    description: "Connect with verified doctors through real-time chat and video calls for both physical and mental health support.",
  },
  {
    icon: Brain,
    title: "Mental Health Support",
    description: "AI chatbot companionship, daily journaling, guided mental wellness tools, and live sessions with mental health professionals.",
  },
  {
    icon: Apple,
    title: "Nutrition & Exercise Guidance",
    description: "Receive personalized diet plans and exercise recommendations based on your specific health conditions and treatment journey.",
  },
  {
    icon: Users,
    title: "Community & Care Network",
    description: "Join community groups with others facing similar health challenges. Share experiences, gain support, and stay motivated together.",
  },
];

const FeatureCards = () => (
  <section id="features" className="border-t border-border/40 bg-surface py-20 md:py-28">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Features</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Everything you need for smarter healthcare
        </h2>
        <p className="mt-4 text-muted-foreground">
          From AI-powered medicine analysis to live consultations and community support — Medscope covers your entire care journey.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative rounded-3xl border border-border/60 bg-card p-px overflow-hidden"
          >
            {/* Corner icons */}
            <Icon className="absolute h-6 w-6 -top-3 -left-3 text-muted-foreground/30" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-muted-foreground/30" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 text-muted-foreground/30" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-muted-foreground/30" />

            {/* Evervault card effect */}
            <EvervaultCard text={f.title} className="h-28" />

            {/* Content below */}
            <div className="relative z-10 rounded-b-3xl border-t border-border/40 bg-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureCards;
