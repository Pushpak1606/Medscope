import { UserPlus, BotMessageSquare, HeartHandshake, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: UserPlus, num: "01", title: "Sign Up & Choose Your Path", desc: "Create your account and select physical care, mental health support, or doctor access." },
  { icon: BotMessageSquare, num: "02", title: "Get AI-Guided Support", desc: "Use the AI medicine assistant, receive reminders, track health progress, and journal your journey." },
  { icon: HeartHandshake, num: "03", title: "Connect with Care", desc: "Consult real doctors via chat or call, join community groups, and follow personalized care plans." },
  { icon: ClipboardCheck, num: "04", title: "Manage & Improve", desc: "Track treatments, review AI insights, manage schedules, and continuously improve your health outcomes." },
];

const HowItWorks = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">How It Works</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Your healthcare journey in four steps
        </h2>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative rounded-3xl border border-border/60 bg-card p-7 text-center"
          >
            <span className="mb-4 block font-heading text-4xl font-extrabold text-primary/15">{s.num}</span>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
