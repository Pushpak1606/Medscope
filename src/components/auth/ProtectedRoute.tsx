import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { getStoredAuthUser, subscribeToAuthChanges, AuthRole } from "@/services/authService";
import PageLoadingFallback from "@/components/ui/PageLoadingFallback";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "patient" | "doctor";
  requireOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole,
  requireOnboarding = true,
}) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string | null } | null>(null);
  const [userRole, setUserRole] = useState<AuthRole | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);

  useEffect(() => {
    // Initial check from localStorage stored session
    const stored = getStoredAuthUser();
    if (stored) {
      setCurrentUser({ uid: stored.uid, email: stored.email });
      setUserRole(stored.role);
      
      const onboardingKey = stored.role === "doctor"
        ? "medscope_doctor_onboarding_completed"
        : "medscope_onboarding_completed";
      setIsOnboarded(localStorage.getItem(onboardingKey) === "true");
      setLoading(false);
    }

    // Subscribe to Firebase Auth state
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        const activeStored = getStoredAuthUser();
        const role = activeStored?.role || allowedRole;
        setCurrentUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        setUserRole(role);

        const onboardingKey = role === "doctor"
          ? "medscope_doctor_onboarding_completed"
          : "medscope_onboarding_completed";
        setIsOnboarded(localStorage.getItem(onboardingKey) === "true");
      } else if (!stored) {
        // Allow demo preview if user hasn't explicitly signed in
        setCurrentUser({ uid: "demo-user", email: `demo@medscope.app` });
        setUserRole(allowedRole);
        setIsOnboarded(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [allowedRole]);

  if (loading) {
    return <PageLoadingFallback />;
  }

  // Not logged in
  if (!currentUser) {
    const loginPath = allowedRole === "doctor" ? "/doctor/login" : "/patient/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Role mismatch (e.g. Doctor trying to access /patient/* or Patient trying to access /doctor/*)
  if (userRole && userRole !== allowedRole) {
    const redirectPath = userRole === "doctor" ? "/doctor/dashboard" : "/patient/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  // Check onboarding completion requirement
  if (requireOnboarding && !isOnboarded && !location.pathname.includes("/onboarding")) {
    const onboardingPath = allowedRole === "doctor" ? "/doctor/onboarding" : "/patient/onboarding";
    return <Navigate to={onboardingPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
