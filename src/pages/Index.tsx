import { Home, Star, User, Stethoscope, HelpCircle } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "react-router-dom";
import Hero from "@/components/landing/Hero";

import CoreValue from "@/components/landing/CoreValue";
import FeatureCards from "@/components/landing/FeatureCards";
import PatientShowcase from "@/components/landing/PatientShowcase";
import DoctorShowcase from "@/components/landing/DoctorShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import AIInsight from "@/components/landing/AIInsight";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background relative">
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-3">
      <ThemeToggle />
      <Link to="/auth/select-role">
        <RainbowButton>Log In</RainbowButton>
      </Link>
    </div>
    <NavBar items={[
      { name: "Home", url: "#", icon: Home },
      { name: "Features", url: "#features", icon: Star },
      { name: "Patients", url: "#patients", icon: User },
      { name: "Doctors", url: "#doctors", icon: Stethoscope },
      { name: "FAQ", url: "#faq", icon: HelpCircle }
    ]} />
    <Hero />
    
    <CoreValue />
    <FeatureCards />
    <PatientShowcase />
    <DoctorShowcase />
    <HowItWorks />
    <AIInsight />
    <FAQ />
    <FinalCTA />
    <Footer />
  </div>
);

export default Index;
