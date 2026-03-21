import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { q: "Is Medscope a replacement for doctors?", a: "No. Medscope is a support tool. Our AI assists with medicine identification, reminders, and wellness tracking, but all medical decisions should involve a qualified healthcare professional. You can consult real doctors directly through the platform." },
  { q: "How does the AI medicine assistant work?", a: "You can upload a photo of your medicine or type its name. The AI analyzes the medicine and returns details like active ingredients, dosage, ideal timing, disease relevance, and whether it's Ayurvedic or allopathic." },
  { q: "Can Medscope help with mental health support?", a: "Yes. Medscope offers an AI chatbot for companionship, daily journaling, mental disorder support resources, and live consultations with mental health professionals. You can also join community groups for peer support." },
  { q: "Can I talk to a real doctor on the platform?", a: "Absolutely. Medscope provides live chat and video call consultations with verified doctors for both physical and mental health needs." },
  { q: "Does Medscope support both patients and doctors?", a: "Yes. Patients get AI-guided care, reminders, and consultations. Doctors get an AI prescription assistant, patient management, scheduling tools, and community features." },
  { q: "How do reminders and health suggestions work?", a: "Medscope sends timely reminders for medicine intake and meals. It also provides personalized nutrition and exercise recommendations based on your health conditions and treatment plan." },
];

const FAQ = () => (
  <section id="faq" className="py-20 md:py-28">
    <div className="container max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Curious about something?
        </h2>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="rounded-2xl border border-border/60 bg-card px-6">
            <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
