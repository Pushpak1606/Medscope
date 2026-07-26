import React from "react";
import DoctorGlassCard from "../DoctorGlassCard";
import { SearchX, RefreshCcw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DirectoryEmptyStateProps {
  searchQuery?: string;
  onReset?: () => void;
}

export const DirectoryEmptyState: React.FC<DirectoryEmptyStateProps> = ({
  searchQuery = "",
  onReset,
}) => {
  return (
    <DoctorGlassCard variant="default" padding="lg" className="py-16 text-center space-y-4 max-w-xl mx-auto">
      <div className="p-4 rounded-3xl bg-primary/10 text-primary w-16 h-16 mx-auto flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
        <SearchX className="h-8 w-8" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-extrabold font-heading text-foreground">
          No Patients Found
        </h3>
        <p className="text-xs sm:text-sm font-medium text-muted-foreground max-w-md mx-auto">
          {searchQuery
            ? `No patient records match "${searchQuery}". Please check the spelling or search by Medical ID, Diagnosis, or Blood Group.`
            : "No patient records match the selected filter category."}
        </p>
      </div>

      <div className="pt-2">
        <Button
          onClick={onReset}
          className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs h-10 px-5 gap-2 shadow-md shadow-primary/20"
        >
          <RefreshCcw className="h-4 w-4" />
          <span>Reset Search & Filters</span>
        </Button>
      </div>
    </DoctorGlassCard>
  );
};

export default DirectoryEmptyState;
