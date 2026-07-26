import React from "react";
import { Minus, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NumberStepperProps {
  value: number | "";
  onChange: (value: number | "") => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  variant?: "horizontal" | "vertical-stacked";
  unit?: string;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  placeholder,
  className,
  inputClassName,
  variant = "horizontal",
  unit,
}) => {
  const numValue = typeof value === "number" ? value : 0;

  const handleDecrement = () => {
    const next = Math.max(min, numValue - step);
    const rounded = Number(next.toFixed(2));
    onChange(rounded);
  };

  const handleIncrement = () => {
    const next = Math.min(max, numValue + step);
    const rounded = Number(next.toFixed(2));
    onChange(rounded);
  };

  if (variant === "vertical-stacked") {
    return (
      <div className={cn("relative flex items-center w-full group", className)}>
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder={placeholder}
          className={cn(
            "pr-10 font-extrabold text-foreground rounded-xl border-border bg-background/60 focus:ring-primary focus:border-primary/50 transition-all",
            inputClassName
          )}
        />
        {unit && (
          <span className="absolute right-10 text-xs font-semibold text-muted-foreground pointer-events-none pr-1">
            {unit}
          </span>
        )}
        <div className="absolute right-1 flex flex-col gap-0.5 z-10 pr-0.5">
          <button
            type="button"
            onClick={handleIncrement}
            className="h-4 w-5 flex items-center justify-center rounded-t-md bg-card/80 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-150 active:scale-95 border border-border/40 shadow-xs cursor-pointer"
            title="Increase value"
          >
            <ChevronUp className="w-3 h-3 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="h-4 w-5 flex items-center justify-center rounded-b-md bg-card/80 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-150 active:scale-95 border border-border/40 shadow-xs cursor-pointer"
            title="Decrease value"
          >
            <ChevronDown className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5 w-full", className)}>
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={handleDecrement}
        disabled={typeof value === "number" && value <= min}
        className="h-10 w-10 shrink-0 rounded-xl border-border/60 bg-card/80 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all active:scale-95 shadow-sm cursor-pointer"
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </Button>

      <div className="relative flex-1">
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder={placeholder}
          className={cn(
            "text-center font-extrabold text-foreground rounded-xl border-border bg-background/60 focus:ring-primary focus:border-primary/50 transition-all",
            inputClassName
          )}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground pointer-events-none">
            {unit}
          </span>
        )}
      </div>

      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={handleIncrement}
        disabled={typeof value === "number" && value >= max}
        className="h-10 w-10 shrink-0 rounded-xl border-border/60 bg-card/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all active:scale-95 shadow-sm cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </Button>
    </div>
  );
};

export default NumberStepper;
