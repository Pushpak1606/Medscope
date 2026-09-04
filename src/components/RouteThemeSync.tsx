import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";

export const RouteThemeSync = () => {
  const { pathname } = useLocation();
  const { setActiveSection } = useTheme();

  useEffect(() => {
    if (pathname.startsWith("/doctor")) {
      setActiveSection("doctor");
    } else if (pathname.startsWith("/patient")) {
      setActiveSection("patient");
    } else {
      setActiveSection("global");
    }
  }, [pathname, setActiveSection]);

  return null;
};

export default RouteThemeSync;
