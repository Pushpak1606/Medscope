import { useState, useRef } from "react";
import { usePatient, ReminderType } from "@/context/PatientContext";
import { toast } from "sonner";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import { Upload, Camera, FileText, CheckCircle, Info, ScanLine, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ScanRxPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addReminder } = usePatient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      handleSimulateScan();
    }
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        name: "Amoxicillin Trihydrate",
        dosage: "500mg",
        timing: "Every 8 hours (After Food)",
        type: "Allopathy (Antibiotic)",
        uses: "Bacterial Infections",
        detailedInfo: "Amoxicillin is a penicillin antibiotic used to treat various bacterial infections. It works by stopping the growth of bacteria. Take exactly as prescribed, evenly spaced, and complete the full course even if symptoms disappear. Common side effects may include nausea, vomiting, or mild diarrhea. Immediately consult your doctor if you experience severe allergic reactions, persistent diarrhea, or unusual bruising.",
      });
    }, 2500);
  };

  const handleReset = () => {
    setScanResult(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveToReminders = () => {
    if (!scanResult) return;
    addReminder({
      title: scanResult.name,
      time: "09:00 AM", // default time
      type: "Medicines",
      status: "upcoming",
      repeat: scanResult.dosage,
      iconName: "Pill",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    });
    toast.success("Medicine saved to Reminders", {
      description: `${scanResult.name} was successfully added to your daily schedule.`,
    });
    handleReset();
  };

  return (
    <PatientPageLayout className="pb-32">
      <PageHeader
        title="Scan Medicine"
        subtitle="Upload a clear photo of your medicine strip or prescription to get AI-powered details, dosage, and usage instructions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* Left Column: Upload & Scan */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="flex flex-col items-center justify-center p-6 sm:p-12 text-center border-dashed border-2 bg-card/60 hover:bg-card/80 transition-colors group cursor-pointer">
            <div className="h-16 w-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
              <Upload className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {selectedFile ? selectedFile.name : "Tap to Upload"}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">PNG, JPG or PDF (Max 10MB)</p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".jpg,.jpeg,.png,.pdf" 
              onChange={handleFileSelect} 
            />

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <LiquidGlassButton variant="secondary" className="w-full sm:w-auto" onClick={() => fileInputRef.current?.click()} disabled={isScanning || !!scanResult}>
                <Camera className="h-4 w-4" /> Use Camera
              </LiquidGlassButton>
              <LiquidGlassButton className="w-full sm:w-auto" onClick={() => fileInputRef.current?.click()} disabled={isScanning || !!scanResult}>
                <FileText className="h-4 w-4" /> Browse Files
              </LiquidGlassButton>
            </div>
          </GlassCard>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-3 text-blue-600">
            <Info className="h-5 w-5 shrink-0" />
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              This is an AI-assisted tool designed to help you organize your medicines. It does not replace professional medical advice.
            </p>
          </div>
        </div>

        {/* Right Column: AI Results */}
        <div className="lg:col-span-7">
          <GlassCard className="h-full min-h-[400px] flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
              
              {/* Idle State */}
              {!isScanning && !scanResult && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center opacity-60"
                >
                  <ScanLine className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-bold text-muted-foreground">No medicine scanned yet</p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs">Details, timings, and notes will appear here once our AI analyzes your image.</p>
                </motion.div>
              )}

              {/* Premium AR Scanning State */}
              {isScanning && (
                <motion.div 
                  key="scanning"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col items-center justify-center text-center relative z-10"
                >
                  <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
                    {/* Glowing Backdrop */}
                    <div className="absolute inset-0 bg-primary/5 rounded-2xl animate-pulse backdrop-blur-sm"></div>

                    {/* Corner Reticles */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-xl transition-all duration-300"></div>
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-xl transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-xl transition-all duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-xl transition-all duration-300"></div>
                    
                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ScanLine className="h-20 w-20 text-primary opacity-30" />
                    </div>

                    {/* Scanning Laser Line */}
                    <div className="absolute top-0 flex flex-col items-center w-full animate-scan z-10">
                      <div className="w-full h-1 bg-primary relative">
                        <div className="absolute inset-0 bg-primary blur-[8px] h-6 -top-3"></div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading tracking-widest uppercase mb-2 flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary animate-ping"></span>
                    Analyzing
                  </h3>
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-bold text-primary animate-pulse tracking-widest uppercase mb-1">Medscope Neural Engine</p>
                    <p className="text-xs text-muted-foreground font-mono opacity-70">Extracting chemical composition and dosage...</p>
                  </div>
                </motion.div>
              )}

              {/* Result State */}
              {scanResult && !isScanning && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="flex items-center gap-2 text-emerald-500 mb-6 bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Scan Successful</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading tracking-tight mb-6">
                    {scanResult.name}
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Dosage</p>
                      <p className="font-semibold text-foreground">{scanResult.dosage}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Timing</p>
                      <p className="font-semibold text-foreground">{scanResult.timing}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Type</p>
                      <p className="font-semibold text-foreground">{scanResult.type}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Use Case</p>
                      <p className="font-semibold text-foreground">{scanResult.uses}</p>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full"></div>
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Info className="h-3.5 w-3.5"/> Uses & Key Side Effects</p>
                    <p className="font-medium text-amber-700/90 text-sm leading-relaxed relative z-10">{scanResult.detailedInfo}</p>
                  </div>

                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <LiquidGlassButton className="flex-1 group" onClick={handleSaveToReminders}>
                      Save to Reminders <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </LiquidGlassButton>
                    <LiquidGlassButton variant="secondary" onClick={handleReset}>
                      Scan Another
                    </LiquidGlassButton>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </GlassCard>
        </div>

      </div>
    </PatientPageLayout>
  );
};

export default ScanRxPage;
