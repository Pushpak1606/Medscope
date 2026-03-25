import { Home, ClipboardList, Calendar, BookOpen, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: Home, label: "Home", path: "/patient/dashboard" },
  { icon: ClipboardList, label: "Reminders", path: "/patient/reminders" },
  { icon: Calendar, label: "Consult", path: "/patient/consultations" },
  { icon: BookOpen, label: "Journal", path: "/patient/journal" },
  { icon: Users, label: "Community", path: "/patient/community" },
];

const MobileNavDock = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:hidden pb-safe">
      <div className="mx-auto max-w-md h-16 bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)] flex items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          
          const NavItemContent = (
            <>
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-full bg-primary -mt-0.5"></span>
              )}
              <div className="relative">
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive
                      ? "text-primary scale-110 drop-shadow-[0_2px_8px_rgba(var(--primary),0.5)]"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />

              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold transition-colors leading-none",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {item.label}
              </span>
            </>
          );

          return (
            <Link
              key={item.label}
              to={item.path}
              className="relative flex flex-col items-center justify-center w-14 h-full gap-1 group"
            >
              {NavItemContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavDock;
