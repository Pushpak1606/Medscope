import { cn } from "@/lib/utils";

interface MedscopeLogoProps {
  className?: string;
}

const MedscopeLogo = ({ className }: MedscopeLogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className={cn("h-5 w-5", className)}
    aria-label="Medscope logo"
  >
    <rect width="32" height="32" rx="8" fill="currentColor" className="text-primary" />
    <polyline
      points="4,17 9,17 12,8 16,24 20,11 23,17 28,17"
      fill="none"
      stroke="white"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default MedscopeLogo;
