import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircleQuestion, Mail } from "lucide-react";

const faqs = [
  { q: "Is Medscope a replacement for doctors?", a: "No. Medscope is a support tool. Our AI assists with medicine identification, reminders, and wellness tracking, but all medical decisions should involve a qualified healthcare professional. You can consult real doctors directly through the platform." },
  { q: "How does the AI medicine assistant work?", a: "You can upload a photo of your medicine or type its name. The AI analyzes the medicine and returns details like active ingredients, dosage, ideal timing, disease relevance, and whether it's Ayurvedic or allopathic." },
  { q: "Can Medscope help with mental health support?", a: "Yes. Medscope offers an AI chatbot for companionship, daily journaling, mental disorder support resources, and live consultations with mental health professionals. You can also join community groups for peer support." },
  { q: "Can I talk to a real doctor on the platform?", a: "Absolutely. Medscope provides live chat and video call consultations with verified doctors for both physical and mental health needs." },
  { q: "Does Medscope support both patients and doctors?", a: "Yes. Patients get AI-guided care, reminders, and consultations. Doctors get an AI prescription assistant, patient management, scheduling tools, and community features." },
  { q: "How do reminders and health suggestions work?", a: "Medscope sends timely reminders for medicine intake and meals. It also provides personalized nutrition and exercise recommendations based on your health conditions and treatment plan." },
];

const FAQ = () => (
  <section id="faq" className="py-20 md:py-28 relative overflow-hidden bg-background">
    <div className="container relative z-10">
      <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
        
        {/* Left column: Header & Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-1"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
            <MessageCircleQuestion className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Curious about something?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg mb-8">
            Find everything you need to know about Medscope's AI, privacy, and consultations.
          </p>

          {/* Support Card */}
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">Still have questions?</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <Link to="/patient/signup" className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 hover:shadow-primary/20 hover:shadow-lg">
              Create patient account
            </Link>
          </div>
        </motion.div>

        {/* Right column: Accordion */}
        <div className="lg:col-span-2">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
              >
                <AccordionItem 
                  value={`faq-${i}`} 
                  className="rounded-2xl border border-border/50 bg-card px-6 py-2 shadow-sm transition-all duration-300 data-[state=open]:border-primary/30 data-[state=open]:bg-primary/5 data-[state=open]:shadow-primary/5 hover:border-primary/30"
                >
                  <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline hover:text-primary transition-colors py-4">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  </section>
);

export default FAQ;
