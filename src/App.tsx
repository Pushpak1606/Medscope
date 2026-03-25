import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { PatientProvider } from "@/context/PatientContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SelectRole from "./pages/auth/SelectRole.tsx";
import PatientLogin from "./pages/auth/PatientLogin.tsx";
import PatientSignup from "./pages/auth/PatientSignup.tsx";
import DoctorLogin from "./pages/auth/DoctorLogin.tsx";
import DoctorSignup from "./pages/auth/DoctorSignup.tsx";
import OnboardingPage from "./pages/patient/OnboardingPage.tsx";
import PatientDashboard from "./pages/patient/PatientDashboard.tsx";
import PatientSettings from "./pages/patient/PatientSettings.tsx";
import PatientProfile from "./pages/patient/PatientProfile.tsx";
import DoctorOnboardingPage from "./pages/doctor/DoctorOnboardingPage.tsx";
import ScanRxPage from "./pages/patient/ScanRxPage.tsx";
import AskAIPage from "./pages/patient/AskAIPage.tsx";
import LogMoodPage from "./pages/patient/LogMoodPage.tsx";
import EmergencyPage from "./pages/patient/EmergencyPage.tsx";
import RecordsPage from "./pages/patient/RecordsPage.tsx";
import RemindersPage from "./pages/patient/RemindersPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PatientProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/select-role" element={<SelectRole />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/signup" element={<PatientSignup />} />
          <Route path="/patient/onboarding" element={<OnboardingPage />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/settings" element={<PatientSettings />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/signup" element={<DoctorSignup />} />
          <Route path="/doctor/onboarding" element={<DoctorOnboardingPage />} />
          <Route path="/patient/scan-rx" element={<ScanRxPage />} />
          <Route path="/patient/ask-ai" element={<AskAIPage />} />
          <Route path="/patient/log-mood" element={<LogMoodPage />} />
          <Route path="/patient/emergency" element={<EmergencyPage />} />
          <Route path="/patient/records" element={<RecordsPage />} />
          <Route path="/patient/reminders" element={<RemindersPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </PatientProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
