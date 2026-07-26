import React from "react";
import { Search, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface DirectorySearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  recentSearches?: string[];
  onSelectRecent?: (query: string) => void;
}

export const DirectorySearch: React.FC<DirectorySearchProps> = ({
  searchQuery,
  onSearchChange,
  recentSearches = ["Marcus Vance", "PAT-101", "CAD", "Troponin T", "O Positive"],
  onSelectRecent,
}) => {
  return (
    <div className="space-y-3">
      {/* Large Glass Search Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-primary shrink-0 pointer-events-none" />
        
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search patients by name, Medical ID (e.g. PAT-101), diagnosis, phone or blood group..."
          className="w-full h-14 pl-12 pr-12 rounded-2xl bg-card/70 border-border/60 backdrop-blur-2xl text-sm font-medium placeholder:text-muted-foreground focus:border-primary shadow-lg shadow-black/5 dark:shadow-black/40"
        />

        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Recent Searches Chips */}
      {recentSearches && recentSearches.length > 0 && (
        <div className="flex items-center gap-2 text-xs flex-wrap px-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" /> Quick Search:
          </span>
          {recentSearches.map((term, idx) => (
            <button
              key={idx}
              onClick={() => onSelectRecent && onSelectRecent(term)}
              className="px-2.5 py-1 rounded-full bg-card/60 hover:bg-card border border-border/50 text-[11px] font-semibold text-foreground hover:border-primary/40 transition-all cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectorySearch;
