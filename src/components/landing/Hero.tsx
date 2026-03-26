import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pill, Video, ShieldCheck, Activity, Star } from "lucide-react";
import { motion } from "framer-motion";
import { InfiniteGrid } from "@/components/ui/the-infinite-grid";
import AnimatedBackground from "@/components/ui/animated-background";
import MedscopeLogo from "@/components/ui/MedscopeLogo";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Hero = () => (
  <section id="home" className="relative overflow-hidden border-b border-border/40 bg-background">
    <AnimatedBackground variant="default" className="opacity-80 md:opacity-100" />
    
    <InfiniteGrid className="min-h-[700px] bg-transparent">
      <div className="container relative z-10 grid min-h-[700px] gap-12 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
        
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-2xl lg:mx-0 lg:text-left text-center"
        >
          <motion.div variants={itemVariants}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              AI-Powered Healthcare Platform
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Smarter care for <span className="gradient-text drop-shadow-sm">patients</span> and <span className="gradient-text drop-shadow-sm">doctors</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0"
          >
            AI medicine assistance, live consultations, mental health support, and smart health tracking — all in one premium platform built for modern healthcare.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Button size="lg" className="group relative overflow-hidden rounded-full px-8" asChild>
              <Link to="/auth/select-role">
                <span className="relative z-10 flex items-center gap-1">
                  Get Started Free 
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 transition-all duration-300 group-hover:scale-100" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 backdrop-blur-sm hover:bg-muted" asChild>
              <Link to="/auth/select-role">Book a Consultation</Link>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-foreground lg:justify-start">
            <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-3 py-1.5 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-green-500" /> HIPAA Ready
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-3 py-1.5 shadow-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> 5,000+ Journeys
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-3 py-1.5 shadow-sm">
              <Activity className="h-4 w-4 text-blue-500" /> 24/7 Support
            </div>
          </motion.div>
        </motion.div>

        {/* Right Floating Visuals (Hidden on small screens) */}
        <div className="relative hidden w-full lg:block">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 bg-primary/5 blur-[100px]" />
          
          <div className="relative h-[500px] w-full">
            {/* Floating Card 1 - Reminder */}
            <motion.div
              initial={{ opacity: 0, y: 30, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute left-0 top-10 flex animate-float items-center gap-4 rounded-2xl border border-border/50 bg-card/80 p-4 shadow-xl backdrop-blur-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <Pill className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Time for Medication</p>
                <p className="text-xs text-muted-foreground">Amoxicillin • in 10 mins</p>
              </div>
            </motion.div>

            {/* Floating Card 2 - Consultation */}
            <motion.div
              initial={{ opacity: 0, y: 30, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute right-0 top-[40%] flex animate-float items-center gap-4 rounded-2xl border border-border/50 bg-card/80 p-4 shadow-xl backdrop-blur-md"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Video className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500 border-2 border-card"></span>
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Dr. Sarah Jenkins</p>
                <p className="text-xs text-muted-foreground">General Physician • Online</p>
              </div>
            </motion.div>

            {/* Floating Card 3 - Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 30, x: 0 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-10 left-[10%] flex animate-float items-center gap-4 rounded-2xl border border-border/50 bg-card/80 p-4 shadow-xl backdrop-blur-md"
              style={{ animationDelay: "3s" }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                <MedscopeLogo className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Wellness Streak</p>
                <p className="text-xs text-muted-foreground">5 days consecutive tracking</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </InfiniteGrid>
  </section>
);

export default Hero;
