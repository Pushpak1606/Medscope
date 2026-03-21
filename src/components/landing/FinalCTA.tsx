import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const FinalCTA = () => (
  <section className="border-t border-border/40 bg-surface py-20 md:py-28">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-card p-10 text-center md:p-14"
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Start your smarter healthcare journey
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          AI-powered support, live doctor consultations, mental wellness tools, and personalized care — all in one place. Join Medscope today.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="hero">
            Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button size="lg" variant="hero-outline">
            Book a Consultation
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
