import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DocStepConsultationProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

const inputClass =
  "h-12 bg-card border-border/80 hover:bg-background focus-visible:bg-background focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all rounded-xl";

const DocStepConsultation = ({ data, onChange }: DocStepConsultationProps) => {
  return (
    <div className="space-y-7">
      {/* Consultation type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Preferred consultation type</Label>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { value: "chat", label: "Chat", emoji: "💬" },
            { value: "audio", label: "Audio call", emoji: "📞" },
            { value: "video", label: "Video call", emoji: "📹" },
            { value: "all", label: "All types", emoji: "✅" },
          ].map((opt) => {
            const isActive = data.consultationType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange("consultationType", opt.value)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-violet-500/10 border-violet-500 text-violet-600 shadow-sm dark:text-violet-400"
                    : "bg-background/50 border-border/60 text-muted-foreground hover:border-violet-500/40 hover:text-foreground"
                )}
              >
                <span>{opt.emoji}</span> {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Consultation mode */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Consultation mode</Label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { value: "online", label: "Online only", emoji: "🌐" },
            { value: "in-clinic", label: "In-clinic", emoji: "🏥" },
            { value: "both", label: "Both", emoji: "🔄" },
          ].map((opt) => {
            const isActive = data.consultationMode === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange("consultationMode", opt.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-violet-500/10 border-violet-500 text-violet-600 shadow-sm dark:text-violet-400"
                    : "bg-background/50 border-border/60 text-muted-foreground hover:border-violet-500/40 hover:text-foreground"
                )}
              >
                <span className="text-lg">{opt.emoji}</span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fee & Duration */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="fee" className="text-sm font-semibold text-foreground/80">
            Consultation fee <span className="text-muted-foreground font-normal">(₹, optional)</span>
          </Label>
          <Input
            id="fee"
            type="number"
            placeholder="500"
            value={data.fee || ""}
            onChange={(e) => onChange("fee", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground/80">Average consultation duration</Label>
          <Select value={data.duration || ""} onValueChange={(v) => onChange("duration", v)}>
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="20">20 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Switches section */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/80">Additional preferences</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground/80">Accepts assistant doctor support?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Allow a backup doctor to handle overflow</p>
            </div>
            <Switch
              checked={data.acceptsAssistant || false}
              onCheckedChange={(v) => onChange("acceptsAssistant", v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground/80">AI medicine guidance support?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Receive AI-powered prescription suggestions</p>
            </div>
            <Switch
              checked={data.aiGuidance || false}
              onCheckedChange={(v) => onChange("aiGuidance", v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground/80">Community case discussions?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Participate in peer case discussions</p>
            </div>
            <Switch
              checked={data.communityDiscussion || false}
              onCheckedChange={(v) => onChange("communityDiscussion", v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocStepConsultation;
