import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { PatientProvider, usePatient } from "@/context/PatientContext";
import { useEffect } from "react";
import { useDoctor } from "@/context/DoctorContext";
import { ConsultationProvider } from "@/context/ConsultationContext";
import { DoctorProvider, hydrateDoctorContextFromFirestore } from "@/context/DoctorContext";
import { hydratePatientContextFromFirestore } from "@/context/PatientContext";
import { ChatHistoryProvider } from "@/context/ChatHistoryContext";

/* Pulls doctors/{uid} from Firestore into DoctorContext once on mount. */
const DoctorHydrator = () => {
  const { updateDoctorProfile } = useDoctor();
  useEffect(() => {
    hydrateDoctorContextFromFirestore(updateDoctorProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

/* Pulls patients/{uid} from Firestore into PatientContext once on mount. */
const PatientHydrator = () => {
  const { updateProfile } = usePatient();
  useEffect(() => {
    hydratePatientContextFromFirestore(updateProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};
import ScrollToTop from "@/components/ScrollToTop";
import PageLoadingFallback from "@/components/ui/PageLoadingFallback";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const SelectRole = lazy(() => import("./pages/auth/SelectRole.tsx"));
const PatientLogin = lazy(() => import("./pages/auth/PatientLogin.tsx"));
const PatientSignup = lazy(() => import("./pages/auth/PatientSignup.tsx"));
const DoctorLogin = lazy(() => import("./pages/auth/DoctorLogin.tsx"));
const DoctorSignup = lazy(() => import("./pages/auth/DoctorSignup.tsx"));
const OnboardingPage = lazy(() => import("./pages/patient/OnboardingPage.tsx"));
const PatientDashboard = lazy(() => import("./pages/patient/PatientDashboard.tsx"));
const PatientSettings = lazy(() => import("./pages/patient/PatientSettings.tsx"));
const PatientProfile = lazy(() => import("./pages/patient/PatientProfile.tsx"));
const EditProfile = lazy(() => import("./pages/patient/EditProfile.tsx"));
const DoctorOnboardingPage = lazy(() => import("./pages/doctor/DoctorOnboardingPage.tsx"));
const DoctorDashboard = lazy(() => import("./pages/doctor/DoctorDashboard.tsx"));
const PatientWorkspacePage = lazy(() => import("./pages/doctor/PatientWorkspacePage.tsx"));
const ConsultationWorkspacePage = lazy(() => import("./pages/doctor/ConsultationWorkspacePage.tsx"));
const DoctorMedicineAssistantPage = lazy(() => import("./pages/doctor/DoctorMedicineAssistantPage.tsx"));
const DoctorSchedulePage = lazy(() => import("./pages/doctor/DoctorSchedulePage.tsx"));
const DoctorClinicalAiPage = lazy(() => import("./pages/doctor/DoctorClinicalAiPage.tsx"));
const DoctorCommunityPage = lazy(() => import("./pages/doctor/DoctorCommunityPage.tsx"));
const DoctorSettingsPage = lazy(() => import("./pages/doctor/DoctorSettingsPage.tsx"));
const DoctorPatientsPage = lazy(() => import("./pages/doctor/DoctorPatientsPage.tsx"));
const ScanRxPage = lazy(() => import("./pages/patient/ScanRxPage.tsx"));
const AskAIPage = lazy(() => import("./pages/patient/AskAIPage.tsx"));
const LogMoodPage = lazy(() => import("./pages/patient/LogMoodPage.tsx"));
const LogVitalsPage = lazy(() => import("./pages/patient/LogVitalsPage.tsx"));
const EmergencyPage = lazy(() => import("./pages/patient/EmergencyPage.tsx"));
const RecordsPage = lazy(() => import("./pages/patient/RecordsPage.tsx"));
const RemindersPage = lazy(() => import("./pages/patient/RemindersPage.tsx"));
const ConsultationsPage = lazy(() => import("./pages/patient/ConsultationsPage.tsx"));
const FindDoctorsPage = lazy(() => import("./pages/patient/FindDoctorsPage.tsx"));
const WellnessPage = lazy(() => import("./pages/patient/WellnessPage.tsx"));
const JournalPage = lazy(() => import("./pages/patient/JournalPage.tsx"));
const AICompanionPage = lazy(() => import("./pages/patient/AICompanionPage.tsx"));
const CommunityPage = lazy(() => import("./pages/patient/CommunityPage.tsx"));
const CommunityGroupPage = lazy(() => import("./pages/patient/CommunityGroupPage.tsx"));
const MentalHealthScreeningPage = lazy(() => import("./pages/patient/MentalHealthScreeningPage.tsx"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoonPage"));

// Initialize global font scaling before React mounts to prevent FOUC
const initFontSize = () => {
  if (localStorage.getItem("medscope-font-size") === "large") {
    document.documentElement.classList.add("font-large");
  } else {
    document.documentElement.classList.remove("font-large");
  }
};
initFontSize();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <TooltipProvider>
      <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <DoctorProvider>
            <DoctorHydrator />
            <PatientProvider>
              <PatientHydrator />
              <ConsultationProvider>
                <ChatHistoryProvider>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth/select-role" element={<SelectRole />} />
                    <Route path="/patient/login" element={<PatientLogin />} />
                    <Route path="/patient/signup" element={<PatientSignup />} />
                    <Route path="/patient/onboarding" element={<OnboardingPage />} />
                    <Route path="/patient/dashboard" element={<PatientDashboard />} />
                    <Route path="/patient/settings" element={<PatientSettings />} />
                    <Route path="/patient/profile" element={<PatientProfile />} />
                    <Route path="/patient/profile/edit" element={<EditProfile />} />
                    <Route path="/doctor/login" element={<DoctorLogin />} />
                    <Route path="/doctor/signup" element={<DoctorSignup />} />
                    <Route path="/doctor/onboarding" element={<DoctorOnboardingPage />} />
                    <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                    <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
                    <Route path="/doctor/patients/:id" element={<PatientWorkspacePage />} />
                    <Route path="/doctor/consultations" element={<ConsultationWorkspacePage />} />
                    <Route path="/doctor/consultations/:id" element={<ConsultationWorkspacePage />} />
                    <Route path="/doctor/medicine-assistant" element={<DoctorMedicineAssistantPage />} />
                    <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
                    <Route path="/doctor/clinical-ai" element={<DoctorClinicalAiPage />} />
                    <Route path="/doctor/community" element={<DoctorCommunityPage />} />
                    <Route path="/doctor/settings" element={<DoctorSettingsPage />} />
                    <Route path="/patient/scan-rx" element={<ScanRxPage />} />
                    <Route path="/patient/ask-ai" element={<AskAIPage />} />
                    <Route path="/patient/log-mood" element={<LogMoodPage />} />
                    <Route path="/patient/log-vitals" element={<LogVitalsPage />} />
                    <Route path="/patient/emergency" element={<EmergencyPage />} />
                    <Route path="/patient/records" element={<RecordsPage />} />
                    <Route path="/patient/reminders" element={<RemindersPage />} />
                    <Route path="/patient/consultations" element={<ConsultationsPage />} />
                    <Route path="/patient/find-doctors" element={<FindDoctorsPage />} />
                    <Route path="/patient/wellness" element={<WellnessPage />} />
                    <Route path="/patient/journal" element={<JournalPage />} />
                    <Route path="/patient/ai-companion" element={<AICompanionPage />} />
                    <Route path="/patient/community" element={<CommunityPage />} />
                    <Route path="/patient/community/:id" element={<CommunityGroupPage />} />
                    <Route path="/patient/mental-screening" element={<MentalHealthScreeningPage />} />
                    
                    {/* Legal & Placeholder Routes */}
                    <Route path="/legal/terms" element={<ComingSoonPage title="Terms of Service" desc="Our terms of service and user agreements will be updated here." />} />
                    <Route path="/legal/privacy" element={<ComingSoonPage title="Privacy Policy" desc="Our patient privacy and data compliance guidelines will be detailed here." />} />
                    <Route path="/coming-soon" element={<ComingSoonPage />} />

                    {/* CATCH-ALL ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ChatHistoryProvider>
            </ConsultationProvider>
          </PatientProvider>
        </DoctorProvider>
        </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
