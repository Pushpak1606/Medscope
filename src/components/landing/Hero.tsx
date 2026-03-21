import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { WebGLShader } from "@/components/ui/web-gl-shader";

const Hero = () => (
  <section className="relative overflow-hidden border-b border-border/40 bg-background">
    {/* WebGL Shader Background */}
    <div className="absolute inset-0 opacity-20">
      <WebGLShader />
    </div>

    <div className="container relative z-10 flex min-h-[600px] flex-col items-center justify-center py-20 md:py-28 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-semibold text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          AI-Powered Healthcare Platform
        </span>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Smarter care for <span className="gradient-text">patients</span> and{" "}
          <span className="gradient-text">doctors</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          AI medicine assistance, live doctor consultations, mental health
          support, smart reminders, and personalized care — all in one platform
          built for modern healthcare.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="hero">
            Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button size="lg" variant="hero-outline">
            Book a Consultation
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> 24/7 AI
            Support
          </span>
          <span>5,000+ care journeys</span>
          <span>Live doctor access</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
