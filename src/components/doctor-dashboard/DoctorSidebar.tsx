import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import MedscopeLogo from "@/components/ui/MedscopeLogo";
import {
  LayoutGrid,
  Users,
  Calendar,
  Stethoscope,
  Pill,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

export const DOCTOR_NAV_ITEMS: NavItem[] = [
  { label: "Workspace", path: "/doctor/dashboard", icon: LayoutGrid },
  { label: "Patients", path: "/doctor/patients", icon: Users },
  { label: "Schedule", path: "/doctor/schedule", icon: Calendar, badge: "3 Today" },
  { label: "Consultations", path: "/doctor/consultations", icon: Stethoscope },
  { label: "Medicine Assistant", path: "/doctor/medicine-assistant", icon: Pill },
  { label: "Community", path: "/doctor/community", icon: MessageSquare },
  { label: "Settings", path: "/doctor/settings", icon: Settings },
];

export interface DoctorSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  className?: string;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  className,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("medscope-")) {
        localStorage.removeItem(key);
      }
    });
    toast.success("Doctor session ended securely");
    navigate("/auth/select-role");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 relative z-10">
      {/* Top Branding Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-2">
          <Link
            to="/doctor/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-3 group transition-transform duration-300"
          >
            <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 shadow-lg shadow-primary/20 text-white group-hover:scale-105 transition-transform shrink-0">
              <MedscopeLogo className="h-5 w-5" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-heading font-extrabold text-lg tracking-tight text-foreground leading-none">
                  Medscope
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-primary mt-1">
                  Doctor Workspace
                </span>
              </motion.div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:flex items-center justify-center h-8 w-8 rounded-xl bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-colors"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-2">
          {DOCTOR_NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/doctor/dashboard" && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={cn(
                  "relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group select-none",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold border border-primary/20 shadow-sm shadow-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60 hover:border-border/40 border border-transparent"
                )}
              >
                {/* Active left indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Outlined Icon */}
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 stroke-[1.75]",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />

                {!collapsed && (
                  <div className="flex items-center justify-between w-full min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold rounded-full border shrink-0",
                          item.badge === "AI"
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-muted text-muted-foreground border-border/40"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Logout Action */}
      <div className="pt-4 border-t border-border/40">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3.5 w-full px-3.5 py-3 rounded-2xl text-sm font-medium text-destructive/90 hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all duration-300 group select-none"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-0.5 stroke-[1.75]" />
          {!collapsed && <span className="font-semibold">Logout Workspace</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop & Laptop Fixed Glass Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-card/40 backdrop-blur-2xl border-r border-border/50 transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64 sm:w-72",
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile & Tablet Drawer Modal Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="absolute top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-card/95 backdrop-blur-3xl border-r border-border/60 shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DoctorSidebar;
