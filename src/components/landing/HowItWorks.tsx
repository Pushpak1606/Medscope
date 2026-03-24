import { UserPlus, BotMessageSquare, HeartHandshake, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: UserPlus, num: "01", title: "Sign Up & Choose Your Path", desc: "Create your account and select physical care, mental health support, or doctor access." },
  { icon: BotMessageSquare, num: "02", title: "Get AI-Guided Support", desc: "Use the AI medicine assistant, receive reminders, track health progress, and journal your journey." },
  { icon: HeartHandshake, num: "03", title: "Connect with Care", desc: "Consult real doctors via chat or call, join community groups, and follow personalized care plans." },
  { icon: ClipboardCheck, num: "04", title: "Manage & Improve", desc: "Track treatments, review AI insights, manage schedules, and continuously improve your health outcomes." },
];

const HowItWorks = () => (
  <section className="py-20 md:py-28 relative overflow-hidden bg-background">
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-20 max-w-2xl text-center"
      >
        <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">How It Works</p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Your healthcare journey in four steps
        </h2>
      </motion.div>

      <div className="relative">
        {/* Desktop Connecting Line */}
        <div className="absolute top-[3.5rem] left-[12%] right-[12%] hidden h-[2px] bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
        
        {/* Mobile Vertical Timeline Line */}
        <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-transparent via-border to-transparent lg:hidden" />

        <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.02 }}
              className="group relative flex flex-row items-start gap-6 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
            >
              {/* Icon / Number Container */}
              <div className="relative z-10 mx-auto mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-card border border-border/50 shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5 group-hover:shadow-primary/20 lg:h-16 lg:w-16">
                <s.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110 lg:h-7 lg:w-7" />
              </div>

              {/* Content Card */}
              <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm transition-shadow group-hover:shadow-md lg:p-8 flex-1">
                {/* Large Background Stylized Number */}
                <span className="absolute -right-2 -top-4 select-none font-heading text-8xl font-black text-foreground/[0.03] transition-colors duration-500 group-hover:text-primary/5 lg:-right-4 lg:-top-6 lg:text-9xl">
                  {s.num}
                </span>
                
                <h3 className="relative z-10 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="relative z-10 mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
