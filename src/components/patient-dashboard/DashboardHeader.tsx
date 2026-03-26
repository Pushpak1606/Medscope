import { useState } from "react";
import { Bell, Search, User, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import NotificationPanel from "./NotificationPanel";
import GlobalSearch from "./GlobalSearch";
import MedscopeLogo from "@/components/ui/MedscopeLogo";

const NAV_LINKS = [
  { label: "Dashboard", path: "/patient/dashboard" },
  { label: "Reminders", path: "/patient/reminders" },
  { label: "Consultations", path: "/patient/consultations" },
  { label: "Wellness", path: "/patient/wellness" },
  { label: "Journal", path: "/patient/journal" },
  { label: "Community", path: "/patient/community" },
];

interface DashboardHeaderProps {
  profile: any;
}

const DashboardHeader = ({ profile }: DashboardHeaderProps) => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const userName = profile?.fullName || "Patient";

  return (
    <header className="flex flex-col gap-3 w-full pb-2">
      {/* Top Row: Brand + Actions */}
      <div className="flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/patient/dashboard" className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary shadow-lg shadow-primary/20 text-white hover:scale-105 transition-transform">
            <MedscopeLogo className="h-6 w-6" />
          </Link>
          <div className="hidden sm:block font-heading font-extrabold text-xl tracking-tight text-foreground">
            Medscope
          </div>
        </div>

        {/* Main Desktop Navigation — shown at lg+ */}
        <nav className="hidden lg:flex items-center justify-center gap-1 p-1 bg-background/40 backdrop-blur-md rounded-2xl border border-border/50 mx-auto">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname.includes(link.path);
            return (
              <Link
                key={link.label}
                to={link.path}
                className={cn(
                  "px-2 md:px-3 lg:px-4 py-1.5 md:py-2 rounded-xl text-[11px] md:text-xs lg:text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search button — icon on small, text on xl+ */}
          <button
            onClick={() => setSearchOpen(true)}
            className="relative flex items-center justify-center gap-2 group rounded-full bg-gradient-to-r hover:bg-gradient-to-l from-blue-500/20 to-indigo-500/20 px-3 xl:px-5 h-10 border border-blue-200/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-500 overflow-hidden backdrop-blur-md"
          >
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
            <Search className="h-4 w-4 text-foreground/80 shrink-0" />
            <span className="hidden xl:inline text-foreground/80 font-medium text-sm pr-2">Search here...</span>
          </button>
          <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
          
          <NotificationPanel>
            <Button variant="ghost" size="icon" aria-label="Open notifications" className="rounded-full bg-card border border-border/50 shadow-sm hover:bg-muted relative">
              <Bell className="h-4 w-4 text-foreground/80" />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 animate-pulse border border-background"></span>
            </Button>
          </NotificationPanel>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label="Open user menu" className="relative h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary/50 transition-colors p-0">
                <Avatar className="h-full w-full">
                  <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`} alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{userName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs text-muted-foreground leading-none">Profile {profile?.profileCompleteness || 0}% complete</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/patient/profile" className="flex w-full items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/patient/settings" className="flex w-full items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
