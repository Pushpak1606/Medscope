import { Link } from "react-router-dom";
import { ArrowLeft, User, Stethoscope, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import AnimatedBackground from "@/components/ui/animated-background";

const roles = [
  {
    title: "Patient",
    description: "Access AI health support, medication reminders, live consultations, mental wellness tools, and personalized care plans.",
    icon: User,
    loginPath: "/patient/login",
    signupPath: "/patient/signup",
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderGlow: "border-primary/50",
    glowVariant: "default" as const, // Pure blue glow natively uses default
  },
  {
    title: "Doctor",
    description: "Manage patients, schedules, AI-assisted prescriptions, consultation workflows, and community collaboration.",
    icon: Stethoscope,
    loginPath: "/doctor/login",
    signupPath: "/doctor/signup",
    colorClass: "text-violet-500",
    bgClass: "bg-violet-500/10",
    borderGlow: "border-violet-500/50",
    glowVariant: "white" as const, // Use white/monochrome for variety or we can let it be default. Let's stick strictly to what GlowingEffect supports.
  },
];

const SelectRole = () => (
  <div className="min-h-screen bg-surface relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
    {/* Subtle grid background */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
    
    <AnimatedBackground variant="default" className="opacity-40 z-0" />

    <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>
      
      <Link to="/" className="mb-4 text-2xl font-extrabold font-heading text-foreground tracking-tight">
        Med<span className="text-primary">scope</span>
      </Link>
      
      <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight text-center sm:text-5xl drop-shadow-sm">
        Choose your role
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-muted-foreground">
        Select how you want to use Medscope to access the right dashboard and tailored features.
      </p>

      <div className="mt-14 grid w-full gap-6 sm:grid-cols-2">
        {roles.map((role, i) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative h-full w-full list-none"
          >
            <div className="relative h-full rounded-[1.5rem] border border-border/50 p-2 md:p-3 group">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="relative flex h-full flex-col p-8 rounded-xl border border-border/50 bg-card/80 backdrop-blur-md shadow-sm transition-all duration-300 group-hover:bg-card">
                <div className={cn("mb-6 flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner", role.bgClass)}>
                  <role.icon className={cn("h-7 w-7 transition-transform duration-300 group-hover:scale-110", role.colorClass)} />
                </div>
                
                <h2 className="text-2xl font-bold font-heading text-foreground tracking-tight">{role.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{role.description}</p>
                
                <div className="mt-8 flex w-full flex-col gap-3">
                  <Link
                    to={role.loginPath}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground shadow-lg px-6 text-sm font-bold text-background transition-all hover:bg-foreground/90 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Login <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to={role.signupPath}
                    className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-border/80 bg-background/50 px-6 text-sm font-bold text-foreground transition-all hover:bg-muted hover:border-border"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default SelectRole;
