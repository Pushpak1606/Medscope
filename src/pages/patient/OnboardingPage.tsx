import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePatient } from "@/context/PatientContext";
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Loader2, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import AnimatedBackground from "@/components/ui/animated-background";

// Step Components
import StepBasicProfile from "@/components/onboarding/StepBasicProfile";
import StepHealthInfo from "@/components/onboarding/StepHealthInfo";
import StepLifestyle from "@/components/onboarding/StepLifestyle";
import StepEmergency from "@/components/onboarding/StepEmergency";
import StepReview from "@/components/onboarding/StepReview";

const STEPS = [
  { title: "Basic Profile", subtitle: "Tell us a bit about yourself" },
  { title: "Health Info", subtitle: "Your medical background" },
  { title: "Lifestyle", subtitle: "Daily habits and wellness goals" },
  { title: "Emergency", subtitle: "Contacts and preferences" },
  { title: "Review", subtitle: "Confirm your details" },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile } = usePatient();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(location.state || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDataChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Redirect to dashboard after success
    setTimeout(() => {
      // Persist ALL form data into shared context
      setProfile({
        ...formData,
        profileCompleteness: 100,
      });
      navigate("/patient/dashboard");
    }, 2000);
  };

  const currentStepData = STEPS[currentStep];
  const progressValue = ((currentStep + 1) / STEPS.length) * 100;

  // Render correct step component
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepBasicProfile data={formData} onChange={handleDataChange} />;
      case 1:
        return <StepHealthInfo data={formData} onChange={handleDataChange} />;
      case 2:
        return <StepLifestyle data={formData} onChange={handleDataChange} />;
      case 3:
        return <StepEmergency data={formData} onChange={handleDataChange} />;
      case 4:
        return <StepReview data={formData} goToStep={setCurrentStep} />;
      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
        <AnimatedBackground variant="patient" className="opacity-60" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center text-center space-y-4"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold font-heading text-foreground">Profile Saved!</h2>
          <p className="text-muted-foreground w-64">
            Welcome to Medscope. Redirecting to your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface relative flex flex-col items-center py-6 px-4 sm:px-6 lg:py-12 overflow-hidden">
      {/* Background Ambience */}
      <AnimatedBackground variant="patient" className="opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col min-h-[calc(100vh-3rem)]">
        
        {/* Header section (Logo + Back) */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:-translate-x-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="inline-flex items-center gap-2 font-heading text-lg font-bold text-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <Activity className="h-3.5 w-3.5" />
            </div>
            <span>Medscope</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="flex-1 flex flex-col rounded-[2rem] border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl p-6 sm:p-10 mb-24 overflow-hidden relative">
          
          {/* Top internal glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-primary/20 blur-[60px] pointer-events-none"></div>

          {/* Progress Indicator */}
          <div className="mb-10 space-y-4">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider text-xs">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <span className="text-muted-foreground">{Math.round(progressValue)}% Complete</span>
            </div>
            <Progress value={progressValue} className="h-2.5 bg-muted/60" />
          </div>

          {/* Step Titles */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight sm:text-4xl">
              {currentStepData.title}
            </h1>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              {currentStepData.subtitle}
            </p>
          </div>

          {/* Form Content container */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Helper / Trust text */}
          <div className="mt-10 pt-6 border-t border-border/40 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              Your data is secure and used only for personalizing your care.
            </p>
          </div>
        </div>

        {/* Sticky Mobile-Friendly Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 sm:relative sm:bg-transparent sm:border-0 sm:p-0 sm:backdrop-blur-none">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="h-14 px-6 md:px-8 rounded-xl font-bold bg-card border-border/60 hover:bg-muted transition-all"
            >
              <ChevronLeft className="mr-1 h-5 w-5" /> Back
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                size="lg"
                onClick={handleNext}
                className="h-14 flex-1 sm:flex-none px-10 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Next <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-14 flex-1 sm:flex-none px-10 rounded-xl font-bold text-base shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Complete Setup <CheckCircle className="ml-1.5 h-5 w-5" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OnboardingPage;
