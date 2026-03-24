import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedBackground from "@/components/ui/animated-background";

const FinalCTA = () => (
  <section className="relative border-t border-border/20 bg-background py-24 md:py-32 overflow-hidden">
    {/* Subtle animated background layer */}
    <AnimatedBackground variant="default" className="opacity-40" />

    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto max-w-4xl relative group"
      >
        {/* Outer ambient glow */}
        <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-violet-500/20 to-blue-500/30 blur-2xl opacity-50 transition-opacity duration-700 group-hover:opacity-70 pointer-events-none" />
        
        {/* 1px Gradient Border Wrapper */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-b from-border/80 via-border/40 to-transparent p-[1px]">
          
          {/* Inner Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-card/60 backdrop-blur-2xl p-10 text-center shadow-2xl md:p-16 lg:p-20">
            
            {/* Top inner spotlight glow */}
            <div className="absolute left-1/2 top-0 h-[350px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px] pointer-events-none mix-blend-screen" />

            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl drop-shadow-sm">
                Start your smarter <br className="hidden sm:block" /> healthcare journey
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                AI-powered support, live doctor consultations, mental wellness tools, and personalized care — all in one accessible place.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="hero" className="w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-primary/25" asChild>
                  <Link to="/auth/select-role">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="hero-outline" className="w-full sm:w-auto h-14 px-8 text-base bg-background/50 backdrop-blur-sm" asChild>
                  <Link to="/auth/select-role">Book a Consultation</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}&backgroundColor=e2e8f0`} alt="user" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-start ml-2 text-xs">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-3 w-3 fill-current" />)}
                    </div>
                    <span>Trusted by 10k+ users</span>
                  </div>
                </div>

                <div className="hidden sm:block h-8 w-[1px] bg-border/50"></div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span>HIPAA Compliant & Secure</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
