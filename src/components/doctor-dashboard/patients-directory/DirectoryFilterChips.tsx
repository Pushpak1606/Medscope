import React from "react";

export type PatientFilterCategory =
  | "all"
  | "today"
  | "recent"
  | "critical"
  | "followup"
  | "new";

export interface DirectoryFilterChipsProps {
  activeFilter: PatientFilterCategory;
  onFilterChange: (filter: PatientFilterCategory) => void;
  counts?: Record<PatientFilterCategory, number>;
}

const FILTER_ITEMS: { id: PatientFilterCategory; label: string }[] = [
  { id: "all", label: "All Patients" },
  { id: "today", label: "Today's Visits" },
  { id: "recent", label: "Recently Viewed" },
  { id: "critical", label: "Critical / High Risk" },
  { id: "followup", label: "Pending Follow-up" },
  { id: "new", label: "New Patients" },
];

export const DirectoryFilterChips: React.FC<DirectoryFilterChipsProps> = ({
  activeFilter,
  onFilterChange,
  counts = { all: 1420, today: 8, recent: 6, critical: 3, followup: 5, new: 12 },
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {FILTER_ITEMS.map((chip) => {
        const isActive = activeFilter === chip.id;
        const count = counts[chip.id];

        return (
          <button
            key={chip.id}
            onClick={() => onFilterChange(chip.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-2 border select-none cursor-pointer ${
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                : "bg-card/60 hover:bg-card border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{chip.label}</span>
            {count !== undefined && (
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DirectoryFilterChips;
