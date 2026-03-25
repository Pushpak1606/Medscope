import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Bell, FileText, Home, Settings, Calendar, 
  User, Pill, MessageSquare, BotMessageSquare, Camera, BookHeart, PhoneCall
} from "lucide-react";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearch = ({ open, onOpenChange }: GlobalSearchProps) => {
  const navigate = useNavigate();

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search anything (Cmd+K)..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Access">
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/dashboard"))}>
            <Home className="mr-2 h-4 w-4 text-blue-500" />
            <span>Dashboard Home</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/reminders"))}>
            <Bell className="mr-2 h-4 w-4 text-amber-500" />
            <span>Reminders</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/consultations"))}>
            <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
            <span>Consultations</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Main Features">
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/ask-ai"))}>
            <BotMessageSquare className="mr-2 h-4 w-4 text-purple-500" />
            <span>Ask AI</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/scan-rx"))}>
            <Camera className="mr-2 h-4 w-4 text-blue-500" />
            <span>Scan Rx (Medicine Details)</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/log-mood"))}>
            <BookHeart className="mr-2 h-4 w-4 text-pink-500" />
            <span>Log Mood</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/emergency"))}>
            <PhoneCall className="mr-2 h-4 w-4 text-red-500" />
            <span>Emergency Contact</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/records"))}>
            <FileText className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Medical Records</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings & Account">
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/profile"))}>
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>My Profile</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/settings"))}>
            <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Account Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/community"))}>
            <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Community Support</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;
