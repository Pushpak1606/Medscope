import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Calendar, Settings, Smile, User, Camera, HeartPulse, Activity } from "lucide-react"

export function GlobalCommand() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/scan-rx"))}>
            <Camera className="mr-2 h-4 w-4 text-blue-500" />
            <span>Scan Medicine (Rx)</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/log-mood"))}>
            <Smile className="mr-2 h-4 w-4 text-pink-500" />
            <span>Log Mood</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/emergency"))}>
            <HeartPulse className="mr-2 h-4 w-4 text-red-500" />
            <span>Emergency Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/dashboard"))}>
            <Activity className="mr-2 h-4 w-4" />
            <span>Patient Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/patient/consultations"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Consultations</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
