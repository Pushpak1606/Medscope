import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => (
  <section className="relative overflow-hidden border-b border-border/40 bg-background">
    <div className="container relative grid min-h-[600px] items-center gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1fr] lg:gap-0">
      {/* Left */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-xl"
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

      {/* Right — Spline 3D with transparent bg */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute inset-y-0 right-0 hidden w-1/2 items-center justify-center lg:flex"
      >
        <iframe
          src="https://my.spline.design/interactiveaiwebsite-BbuQDRebKK790l24ffad8vPH/"
          frameBorder="0"
          className="h-[650px] w-[650px] scale-110"
          title="Medscope 3D Visual"
          loading="lazy"
          allow="autoplay"
          style={{ background: "transparent", border: "none" }}
        />
      </motion.div>

      {/* Mobile fallback */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative h-[400px] w-full lg:hidden"
      >
        <iframe
          src="https://my.spline.design/interactiveaiwebsite-BbuQDRebKK790l24ffad8vPH/"
          frameBorder="0"
          className="h-full w-full"
          title="Medscope 3D Visual"
          loading="lazy"
          allow="autoplay"
          style={{ background: "transparent", border: "none" }}
        />
      </motion.div>
    </div>
  </section>
);

export default Hero;
