import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Phone, Pill, Bell, Users, Brain, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import AuthLayout from "@/components/auth/AuthLayout";
import FeaturePanel from "@/components/auth/FeaturePanel";

const features = [
  { icon: Pill, text: "Physical consultation pathway" },
  { icon: Brain, text: "Mental health support pathway" },
  { icon: Bell, text: "Personalized reminders" },
  { icon: MapPin, text: "Nearby pharmacy suggestions" },
  { icon: Users, text: "Community support groups" },
];

const PatientSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <AuthLayout
      role="patient"
      sidePanel={
        <FeaturePanel
          badge="For Patients"
          title="Start your health journey"
          description="Create your account to access AI-assisted medicine support, live consultations, mental wellness tools, personalized routines, and a caring community."
          features={features}
        />
      }
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight sm:text-4xl">Create account</h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">Start your health journey with AI-assisted support for medicines, consultations, mental wellness, and personalized routines.</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2.5">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground/80">Full name</Label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input id="name" placeholder="John Doe" className="pl-11 h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl" />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">Email</Label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input id="email" type="email" placeholder="you@example.com" className="pl-11 h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl" />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="phone" className="text-sm font-semibold text-foreground/80">Phone number</Label>
            <div className="relative group">
              <Phone className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input id="phone" type="tel" placeholder="+91 98765 43210" className="pl-11 h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-11 pr-11 h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="confirm" className="text-sm font-semibold text-foreground/80">Confirm password</Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input id="confirm" type={showConfirm ? "text" : "password"} placeholder="••••••••" className="pl-11 pr-11 h-12 bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <Checkbox id="terms" className="mt-1 rounded-md border-muted-foreground/30 data-[state=checked]:border-primary" />
            <Label htmlFor="terms" className="text-sm font-medium text-muted-foreground cursor-pointer select-none leading-relaxed">
              I agree to the <Link to="#" className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline">Terms of Service</Link> and <Link to="#" className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline">Privacy Policy</Link>
            </Label>
          </div>

          <Button type="submit" size="lg" className="w-full h-12 mt-2 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30">
            Create Patient Account
          </Button>
        </form>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">or continue with</span>
          <Separator className="flex-1" />
        </div>

        <Button variant="outline" size="lg" className="w-full h-12 rounded-xl bg-background border-border/60 hover:bg-muted text-foreground font-semibold transition-colors">
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Sign up with Google
        </Button>

        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 text-center text-sm text-muted-foreground space-y-2">
          <p>Already have an account? <Link to="/patient/login" className="font-bold text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-4">Login</Link></p>
          <Separator className="mx-auto w-12 my-2 bg-border/60" />
          <p>Are you a doctor? <Link to="/doctor/signup" className="font-bold text-foreground hover:text-primary transition-colors hover:underline underline-offset-4">Doctor Sign Up</Link></p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PatientSignup;
