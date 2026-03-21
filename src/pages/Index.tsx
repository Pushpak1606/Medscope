import Navbar from "@/components/landing/Navbar";
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
  <div className="min-h-screen bg-background">
    <Navbar />
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
