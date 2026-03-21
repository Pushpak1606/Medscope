import { Button } from "@/components/ui/button";
import { ArrowRight, Pill, MessageCircle, Brain, CalendarClock } from "lucide-react";
import { motion } from "framer-motion";

const floatingCards = [
  { icon: Pill, label: "Medicine Identified", sub: "Paracetamol 500mg · Allopathy", color: "bg-primary/10 text-primary" },
  { icon: MessageCircle, label: "Doctor Online", sub: "Dr. Sharma is available now", color: "bg-accent text-accent-foreground" },
  { icon: Brain, label: "Mental Wellness", sub: "Daily journal updated", color: "bg-secondary text-foreground" },
  { icon: CalendarClock, label: "Next Reminder", sub: "Take medicine at 2:00 PM", color: "bg-primary/10 text-primary" },
];

const Hero = () => (
  <section className="relative overflow-hidden border-b border-border/40 bg-background">
    <div className="container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
      {/* Left */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-semibold text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          AI-Powered Healthcare Platform
        </span>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Smarter care for <span className="gradient-text">patients</span> and <span className="gradient-text">doctors</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          AI medicine assistance, live doctor consultations, mental health support, smart reminders, and personalized care — all in one platform built for modern healthcare.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" variant="hero">
            Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button size="lg" variant="hero-outline">
            Book a Consultation
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> 24/7 AI Support</span>
          <span>5,000+ care journeys</span>
          <span>Live doctor access</span>
        </div>
      </motion.div>

      {/* Right — floating cards */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative hidden lg:block"
      >
        <div className="relative mx-auto h-[420px] w-full max-w-md">
          {/* Background shapes */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-accent/30 to-secondary" />

          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
              className={`absolute flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-lg ${
                i === 0 ? "left-4 top-6" : i === 1 ? "right-2 top-28" : i === 2 ? "left-8 bottom-28" : "right-4 bottom-8"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{card.label}</p>
                <p className="text-xs text-muted-foreground">{card.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
