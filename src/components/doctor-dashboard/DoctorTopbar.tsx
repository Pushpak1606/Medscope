import React, { useState } from "react";
import { Search, Bell, Menu, Plus, User, Settings, ShieldCheck, LogOut, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import GlobalSearch from "@/components/patient-dashboard/GlobalSearch";
import { toast } from "sonner";

import { useDoctor } from "@/context/DoctorContext";

export interface DoctorTopbarProps {
  doctorName?: string;
  specialty?: string;
  onOpenMobileMenu?: () => void;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
}

export const DoctorTopbar: React.FC<DoctorTopbarProps> = ({
  doctorName: overrideName,
  specialty: overrideSpecialty,
  onOpenMobileMenu,
  onPrimaryAction,
  primaryActionLabel = "New Consultation",
}) => {
  const { doctorProfile } = useDoctor();
  const doctorName = overrideName || doctorProfile.fullName;
  const specialty = overrideSpecialty || doctorProfile.specialty;
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Dynamic time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const handleLogout = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("medscope-")) {
        localStorage.removeItem(key);
      }
    });
    toast.success("Logged out successfully");
    navigate("/auth/select-role");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background/60 backdrop-blur-2xl border-b border-border/40 py-3.5 px-4 sm:px-6 lg:px-8 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Side: Mobile Menu + Doctor Greeting */}
        <div className="flex items-center gap-3.5 min-w-0">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              aria-label="Open navigation menu"
              className="lg:hidden flex items-center justify-center p-2 rounded-2xl bg-card border border-border/50 text-foreground hover:bg-muted transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="flex flex-col min-w-0">
            <h1 className="text-base sm:text-lg font-bold font-heading text-foreground tracking-tight truncate flex items-center gap-2">
              <span>{greeting}, {doctorName}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 inline-block" />
            </h1>
            <p className="text-xs text-muted-foreground font-medium truncate hidden sm:block">
              {specialty}
            </p>
          </div>
        </div>

        {/* Right Side: Global Search, Notifications, Theme, Profile, Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Global Search Input / Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="relative flex items-center justify-center gap-2 rounded-full bg-card/60 hover:bg-card/90 border border-border/50 px-3 sm:px-4 h-10 shadow-sm transition-all text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4 text-primary shrink-0" />
            <span className="hidden md:inline">Search patients, records...</span>
          </button>
          <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />

          {/* Notification Icon */}
          <button
            aria-label="View notifications"
            onClick={() => toast.info("No urgent clinical alerts at this time.")}
            className="relative flex items-center justify-center h-10 w-10 rounded-full bg-card/60 hover:bg-card/90 border border-border/50 text-foreground shadow-sm transition-all"
          >
            <Bell className="h-4 w-4 text-foreground/80" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emerald-500 border border-background animate-pulse" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Doctor Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                aria-label="Open doctor profile menu"
                className="relative h-10 w-10 rounded-full border-2 border-primary/30 hover:border-primary transition-all p-0"
              >
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${doctorName}`}
                    alt={doctorName}
                  />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    DS
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{doctorName}</p>
                  <p className="text-xs text-muted-foreground">{specialty}</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    <ShieldCheck className="h-3 w-3" /> Licensed Clinical Practitioner
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/doctor/settings" className="flex w-full items-center">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  <span>Professional Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/doctor/settings" className="flex w-full items-center">
                  <Settings className="mr-2 h-4 w-4 text-primary" />
                  <span>Workspace Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Primary Action Button */}
          <Button
            onClick={onPrimaryAction || (() => navigate("/doctor/consultations"))}
            className="rounded-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground font-semibold px-4 h-10 shadow-lg shadow-primary/20 hover:scale-105 transition-transform hidden sm:flex items-center gap-2 text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>{primaryActionLabel}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DoctorTopbar;
