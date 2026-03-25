import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import { Phone, AlertTriangle, ShieldAlert, HeartPulse, Stethoscope, Share2, MapPin } from "lucide-react";
import { usePatient } from "@/context/PatientContext";
import { toast } from "sonner";

const EmergencyPage = () => {
  const { profile } = usePatient(); // Get emergency contact from context
  
  const emergencyContactName = profile?.emergencyName || "Not Provided";
  const emergencyContactPhone = profile?.emergencyPhone || "Not Provided";

  const handleShare = async () => {
    const summaryText = `Medscope Emergency Vitals:\nBlood Group: ${profile?.bloodGroup || "O+"}\nAllergies: ${profile?.allergies || "None declared"}\nConditions: ${profile?.conditions?.join(", ") || "None declared"}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Medical Vitals',
          text: summaryText,
        });
      } catch (err) {
        console.log('User cancelled share');
      }
    } else {
      navigator.clipboard.writeText(summaryText);
      toast.success("Vitals copied to clipboard", { description: "You can now paste and send this to first responders." });
    }
  };

  return (
    <PatientPageLayout className="pb-32">
      <PageHeader
        title="Emergency Support"
        subtitle="Get immediate help and quickly access your emergency contacts and essential medical information."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* Left Column: Primary Actions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Urgent Warning Callout */}
          <div className="bg-red-500/10 border-l-4 border-red-500 rounded-r-2xl p-4 sm:p-5 flex gap-3 text-red-600 shadow-sm animate-pulse-subtle">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Critical Emergency</h3>
              <p className="text-sm font-medium leading-relaxed">
                If this is a life-threatening medical emergency, please exit this app and contact local emergency services immediately (e.g., dial 911 or 112).
              </p>
            </div>
          </div>

          <GlassCard className="p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold font-heading text-foreground mb-2">Immediate Assistance</h2>
            
            <LiquidGlassButton 
              variant="danger" 
              className="w-full h-16 sm:h-20 text-lg shadow-red-500/20"
              onClick={() => window.location.href = "tel:911"}
            >
              <Phone className="h-6 w-6 mr-2 animate-pulse" /> Call Local Ambulance
            </LiquidGlassButton>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <LiquidGlassButton className="h-14" onClick={() => window.open("https://www.google.com/maps/search/nearest+hospital", "_blank")}>
                <MapPin className="h-5 w-5 mr-2" /> Find Nearest Hospital
              </LiquidGlassButton>
              <LiquidGlassButton className="h-14" variant="secondary" onClick={() => window.location.href = "tel:1234567890"}>
                <Stethoscope className="h-5 w-5 mr-2 text-primary" /> Contact My Doctor
              </LiquidGlassButton>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-bold text-lg font-heading text-foreground mb-4">Your Emergency Contact</h3>
            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Primary Contact</p>
                <p className="text-xl font-bold text-foreground">{emergencyContactName}</p>
                <p className="text-foreground/80 font-medium font-mono mt-1">{emergencyContactPhone}</p>
              </div>
              <LiquidGlassButton variant="secondary" className="shrink-0" onClick={() => window.location.href = `tel:${emergencyContactPhone}`}>
                <Phone className="h-4 w-4 mr-2" /> Call Now
              </LiquidGlassButton>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Health Summary & Info */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <GlassCard variant="highlight" className="p-6 border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center">
                <HeartPulse className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground font-heading leading-tight">Vitals Summary<br/><span className="text-xs text-muted-foreground font-normal">For Paramedics</span></h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground font-medium">Blood Group</span>
                <span className="text-sm font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">{profile?.bloodGroup || "O+"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground font-medium">Known Allergies</span>
                <span className="text-sm font-bold text-foreground text-right">{profile?.allergies || "None declared"}</span>
              </div>
              <div className="flex justify-between items-start py-2">
                <span className="text-sm text-muted-foreground font-medium whitespace-nowrap mr-4">Conditions</span>
                <span className="text-sm font-bold text-foreground text-right">{profile?.conditions?.join(", ") || "None declared"}</span>
              </div>
            </div>

            <LiquidGlassButton variant="secondary" className="w-full mt-6 bg-background/50" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> Share Info Quickly
            </LiquidGlassButton>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Safety Instructions
            </h3>
            <ul className="space-y-3 text-sm text-foreground/80 font-medium">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span> Stay calm and ensure you are in a safe location.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span> Have this "Vitals Summary" screen open for first responders.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span> Follow any first aid procedures if safe to do so.
              </li>
            </ul>
          </GlassCard>

        </div>

      </div>
    </PatientPageLayout>
  );
};

export default EmergencyPage;
