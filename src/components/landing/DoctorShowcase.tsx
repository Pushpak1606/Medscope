import { Stethoscope, ClipboardList, CalendarDays, Users, UserCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const doctorFeatures = [
  { icon: Stethoscope, title: "AI Prescription Assist", desc: "Get AI-based medicine suggestions based on disease and symptoms." },
  { icon: ClipboardList, title: "Patient Details Access", desc: "View comprehensive patient history and treatment records." },
  { icon: CalendarDays, title: "Schedule Management", desc: "Organize daily appointments and consultation slots efficiently." },
  { icon: Users, title: "Community Discussions", desc: "Participate in professional communities and case discussions." },
  { icon: UserCheck, title: "Assistant Doctor Support", desc: "Backup doctor availability when the primary doctor is unavailable." },
];

const DoctorShowcase = () => (
  <section id="doctors" className="border-t border-border/40 bg-surface py-20 md:py-28">
    <div className="container">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">For Doctors</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            A smarter dashboard for modern practitioners
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Medscope empowers doctors with AI-assisted prescription guidance, streamlined scheduling, patient management, and professional community access.
          </p>
          <a href="#" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Explore doctor features <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          {doctorFeatures.map((f) => (
            <div key={f.title} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">{f.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default DoctorShowcase;
