import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Pill, Bell, Video, Brain, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import AuthLayout from "@/components/auth/AuthLayout";
import FeaturePanel from "@/components/auth/FeaturePanel";

const features = [
  { icon: Pill, text: "AI medicine assistant" },
  { icon: Bell, text: "Medication & meal reminders" },
  { icon: Video, text: "Live doctor consultation" },
  { icon: Apple, text: "Nutrition & exercise guidance" },
  { icon: Brain, text: "Mental health support & journaling" },
];

const PatientLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout
      role="patient"
      sidePanel={
        <FeaturePanel
          badge="Patient Access"
          title="Your health, intelligently supported"
          description="Medscope gives you AI-powered tools for medicine tracking, wellness routines, live consultations, and mental health care — all from one dashboard."
          features={features}
        />
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground tracking-tight sm:text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Access your Medscope patient dashboard for AI health support, reminders, consultations, and personalized care.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="email">Email or phone</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" placeholder="you@example.com" className="pl-10 h-11" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 h-11" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">Remember me</Label>
            </div>
            <Link to="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-xl">Login as Patient</Button>
        </form>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or continue with</span>
          <Separator className="flex-1" />
        </div>

        <Button variant="outline" size="lg" className="w-full rounded-xl">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Sign in with Google
        </Button>

        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>Don't have an account? <Link to="/patient/signup" className="font-medium text-primary hover:underline">Sign up</Link></p>
          <p>Are you a doctor? <Link to="/doctor/login" className="font-medium text-primary hover:underline">Doctor Login</Link></p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PatientLogin;
