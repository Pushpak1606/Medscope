import { Link } from "react-router-dom";
import { ArrowLeft, User, Stethoscope, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const roles = [
  {
    title: "Patient",
    description: "Access AI health support, medication reminders, live consultations, mental wellness tools, and personalized care plans.",
    icon: User,
    loginPath: "/patient/login",
    signupPath: "/patient/signup",
  },
  {
    title: "Doctor",
    description: "Manage patients, schedules, AI-assisted prescriptions, consultation workflows, and community collaboration.",
    icon: Stethoscope,
    loginPath: "/doctor/login",
    signupPath: "/doctor/signup",
  },
];

const SelectRole = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
      <ArrowLeft className="h-4 w-4" /> Back to home
    </Link>
    <Link to="/" className="mb-2 text-2xl font-extrabold font-heading text-foreground tracking-tight">
      Med<span className="text-primary">scope</span>
    </Link>
    <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight sm:text-4xl">Choose how you want to continue</h1>
    <p className="mt-3 max-w-md text-center text-muted-foreground">Select your role to access the right dashboard and features tailored for you.</p>

    <div className="mt-10 grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      {roles.map((role, i) => (
        <motion.div
          key={role.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="group rounded-3xl border border-border/60 bg-card p-7 transition-shadow hover:shadow-lg flex flex-col items-start h-full">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <role.icon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold font-heading text-foreground">{role.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{role.description}</p>
            <div className="mt-6 flex w-full flex-col gap-2">
              <Link
                to={role.loginPath}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                Login <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={role.signupPath}
                className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default SelectRole;
