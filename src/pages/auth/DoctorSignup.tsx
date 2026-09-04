import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Phone, Pill, Calendar, Users, Shield, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import AuthLayout from "@/components/auth/AuthLayout";
import FeaturePanel from "@/components/auth/FeaturePanel";
import { useDoctor } from "@/context/DoctorContext";
import { toast } from "sonner";
import { 
  signupWithEmail, 
  signInWithGoogle, 
  getFirebaseAuthErrorMessage 
} from "@/services/authService";

const features = [
  { icon: Pill, text: "AI guidance for prescriptions" },
  { icon: Users, text: "Patient workflow management" },
  { icon: Calendar, text: "Scheduling & consultation tools" },
  { icon: Shield, text: "Backup assistant doctor system" },
  { icon: FileText, text: "Live consultation support" },
];

const DoctorSignup = () => {
  const navigate = useNavigate();
  const { updateDoctorProfile } = useDoctor();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    hospital: "",
    registration: "",
    password: "",
    confirmPassword: "",
    terms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const { record } = await signInWithGoogle("doctor");
      const syncedProfile = {
        fullName: record.displayName || "",
        email: record.email || "",
        specialty: "General Practice",
        registrationNumber: "MCI-98421",
        licenseNumber: "MCI-98421"
      };
      updateDoctorProfile(syncedProfile);

      toast.success("Google Account Connected!", {
        description: `Signed in as ${record.email}`,
      });

      navigate("/doctor/onboarding", { 
        state: { 
          fullName: record.displayName || "", 
          email: record.email || "",
          specialization: "General Practice",
          registration: "MCI-98421"
        } 
      });
    } catch (err: any) {
      console.error("Google signup error:", err);
      toast.error("Google Sign-Up Failed", {
        description: getFirebaseAuthErrorMessage(err),
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.phone || !formData.specialization || !formData.hospital || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!formData.registration || !formData.registration.trim()) {
      setError("Medical Council (MCI) Registration Number is mandatory.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!formData.terms) {
      setError("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await signupWithEmail(
        formData.email,
        formData.password,
        formData.name,
        "doctor"
      );

      // Save master profile to DoctorContext
      const syncedProfile = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialization,
        subSpecialty: formData.specialization,
        hospital: formData.hospital,
        registrationNumber: formData.registration,
        licenseNumber: formData.registration,
      };
      updateDoctorProfile(syncedProfile);

      setIsSuccess(true);
      
      setTimeout(() => {
        navigate("/doctor/onboarding", { 
          state: { 
            ...syncedProfile,
            registration: formData.registration,
            license: formData.registration,
          } 
        });
      }, 2000);
    } catch (err: any) {
      console.error("Doctor signup error:", err);
      const msg = getFirebaseAuthErrorMessage(err);
      setError(msg);
      toast.error("Account Creation Failed", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] bg-violet-500/20 blur-[100px] pointer-events-none rounded-full"></div>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm sm:max-w-md mx-auto"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-500 mb-2 shadow-2xl shadow-violet-500/20 border border-violet-500/20">
            <Shield className="h-12 w-12" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-foreground tracking-tight">Account Created</h2>
          <div className="space-y-4 bg-card/50 backdrop-blur-md p-6 rounded-2xl border border-border/50">
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Your professional account has been registered with Firebase Authentication. Let's finish personalizing your practice and consultation workspace.
            </p>
          </div>
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-violet-500 font-bold bg-violet-500/10 px-6 py-3 rounded-full">
            <Loader2 className="h-5 w-5 animate-spin" /> Preparing doctor workspace...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthLayout
      role="doctor"
      sidePanel={
        <FeaturePanel
          badge="Join as Doctor"
          title="Elevate your clinical practice"
          description="Create your professional profile to manage patient consultations, use AI-assisted prescription tools, and connect with fellow healthcare practitioners."
          features={features}
          isDoctor={true}
        />
      }
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight sm:text-4xl">Doctor registration</h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">Create your account to manage patient records, consultation schedules, and clinical guidance.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2.5">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground/80">Full name</Label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
              <Input id="name" value={formData.name} onChange={handleChange} placeholder="Dr. Sarah Jenkins" required className="pl-11 h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">Professional email</Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
                <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="doctor@hospital.com" required className="pl-11 h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl" />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="phone" className="text-sm font-semibold text-foreground/80">Phone number</Label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
                <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" required className="pl-11 h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="specialization" className="text-sm font-semibold text-foreground/80">Primary specialization</Label>
              <div className="relative group">
                <Pill className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
                <Input id="specialization" value={formData.specialization} onChange={handleChange} placeholder="Cardiology, General Practice..." required className="pl-11 h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl" />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="hospital" className="text-sm font-semibold text-foreground/80">Hospital / Clinic affiliation</Label>
              <div className="relative group">
                <FileText className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
                <Input id="hospital" value={formData.hospital} onChange={handleChange} placeholder="City General Hospital" required className="pl-11 h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl" />
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="registration" className="text-sm font-semibold text-foreground/80">Medical Council (MCI) Registration Number</Label>
            <div className="relative group">
              <Shield className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
              <Input id="registration" value={formData.registration} onChange={handleChange} placeholder="e.g. MCI-98421 or State Council Reg ID" required className="pl-11 h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl font-mono uppercase" />
            </div>
            <p className="text-[11px] text-muted-foreground">Mandatory for telemedicine and clinical AI assistant validation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
                <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="••••••••" required className="pl-11 pr-11 h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground/80">Confirm password</Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
                <Input id="confirmPassword" type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required className="pl-11 pr-11 h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <Checkbox id="terms" checked={formData.terms} onCheckedChange={(c) => setFormData(p => ({...p, terms: c as boolean}))} className="mt-1 rounded-md border-muted-foreground/30 data-[state=checked]:border-violet-500 data-[state=checked]:bg-violet-500" />
            <Label htmlFor="terms" className="text-sm font-medium text-muted-foreground cursor-pointer select-none leading-relaxed">
              I agree to the <Link to="/legal/terms" className="font-semibold text-violet-500 hover:text-violet-600 transition-colors hover:underline">Terms of Service</Link> and <Link to="/legal/privacy" className="font-semibold text-violet-500 hover:text-violet-600 transition-colors hover:underline">Privacy Policy</Link>
            </Label>
          </div>

          <Button type="submit" disabled={isSubmitting || isGoogleLoading} size="lg" className="w-full h-12 mt-2 rounded-xl text-base font-bold bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 border-0">
            {isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Creating account...</span>
            ) : "Create Doctor Account"}
          </Button>
        </form>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">or continue with</span>
          <Separator className="flex-1" />
        </div>

        {/* Sign Up With Google for Doctors */}
        <Button 
          onClick={handleGoogleSignup} 
          disabled={isSubmitting || isGoogleLoading}
          variant="outline" 
          size="lg" 
          className="w-full h-12 rounded-xl bg-card border-border/80 hover:bg-muted text-foreground font-semibold transition-colors"
        >
          {isGoogleLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Connecting to Google...
            </span>
          ) : (
            <>
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </>
          )}
        </Button>

        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 text-center text-sm text-muted-foreground space-y-2">
          <p>Already registered? <Link to="/doctor/login" className="font-bold text-violet-500 hover:text-violet-600 transition-colors hover:underline underline-offset-4">Login</Link></p>
          <Separator className="mx-auto w-12 my-2 bg-border/60" />
          <p>Are you a patient? <Link to="/patient/signup" className="font-bold text-foreground hover:text-primary transition-colors hover:underline underline-offset-4">Patient Sign Up</Link></p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default DoctorSignup;
