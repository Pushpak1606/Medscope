import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SelectRole from "./pages/auth/SelectRole.tsx";
import PatientLogin from "./pages/auth/PatientLogin.tsx";
import PatientSignup from "./pages/auth/PatientSignup.tsx";
import DoctorLogin from "./pages/auth/DoctorLogin.tsx";
import DoctorSignup from "./pages/auth/DoctorSignup.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/select-role" element={<SelectRole />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/signup" element={<PatientSignup />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/signup" element={<DoctorSignup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
