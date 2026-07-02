import React from "react";
import { ScanSearch, Video, BellRing, Brain, Users } from "lucide-react";
import BorderGlow from "@/components/ui/BorderGlow";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const FeatureCards = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-surface relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">Capabilities</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Everything you need for better health
          </h2>
        </motion.div>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={<ScanSearch className="h-5 w-5 text-primary" />}
            title="Instant Medicine ID"
            description="Upload a photo to instantly identify medicine, dosage, side effects, and composition."
          />
          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
            icon={<Video className="h-5 w-5 text-primary" />}
            title="Live Doctor Consults"
            description="Connect with verified doctors via chat or high-quality video call instantly."
          />
          <GridItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
            icon={<BellRing className="h-5 w-5 text-primary" />}
            title="Smart Reminders"
            description="Never miss a dose with intelligent, customizable notifications for your schedule."
          />
          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
            icon={<Brain className="h-5 w-5 text-primary" />}
            title="AI Mental Support"
            description="24/7 guided conversational AI for your mental well-being and daily journaling."
          />
          <GridItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
            icon={<Users className="h-5 w-5 text-primary" />}
            title="Community Forums"
            description="Join groups and discuss health journeys with peers in a safe environment."
          />
        </ul>
      </div>
    </section>
  );
};

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <motion.li 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn("min-h-[14rem] list-none flex", area)}
    >
      <BorderGlow
        edgeSensitivity={30}
        glowColor="220 80 65"
        backgroundColor="hsl(var(--card))"
        borderRadius={24}
        glowRadius={40}
        glowIntensity={1.0}
        coneSpread={25}
        animated={false}
        colors={['#3b82f6', '#8b5cf6', '#06b6d4']}
        fillOpacity={0.25}
        className="w-full h-full"
      >
        <div className="relative flex h-full flex-col justify-between gap-6 p-6 md:p-8">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-xl border border-border/50 bg-primary/10 p-2.5 shadow-inner">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {description}
              </p>
            </div>
          </div>
        </div>
      </BorderGlow>
    </motion.li>
  );
};

export default FeatureCards;
