import { useState } from "react";
import { Bell, Search, Activity, User, Settings, LogOut } from "lucide-react";
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

  return (
    <header className="flex items-center justify-between w-full pb-2">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary shadow-lg shadow-primary/20 text-white hover:scale-105 transition-transform">
          <Activity className="h-5 w-5" />
        </Link>
        <div className="hidden lg:block font-heading font-extrabold text-xl tracking-tight text-foreground">
          Medscope
        </div>
      </div>

      {/* Main Desktop Navigation */}
      <nav className="hidden xl:flex items-center gap-1 p-1 bg-background/40 backdrop-blur-md rounded-2xl border border-border/50">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname.includes(link.path);
          return (
            <Link
              key={link.label}
              to={link.path}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
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
      <div className="flex items-center gap-2 sm:gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-card border border-border/50 shadow-sm hover:bg-muted relative"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4 text-foreground/80" />
        </Button>
        <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
        
        <NotificationPanel>
          <Button variant="ghost" size="icon" className="rounded-full bg-card border border-border/50 shadow-sm hover:bg-muted relative">
            <Bell className="h-4 w-4 text-foreground/80" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 animate-pulse border border-background"></span>
          </Button>
        </NotificationPanel>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-1 border-2 border-primary/20 hover:border-primary/50 transition-colors p-0">
              <Avatar className="h-full w-full">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}`} alt={profile.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile.name}</p>
                <p className="text-xs text-muted-foreground leading-none">Profile {profile.profileCompleteness}% complete</p>
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
    </header>
  );
};

export default DashboardHeader;
