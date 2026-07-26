import MedscopeLogo from "@/components/ui/MedscopeLogo";

export const PageLoadingFallback = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 animate-pulse">
          <MedscopeLogo className="h-9 w-9 animate-spin-slow" />
        </div>
        
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold font-heading tracking-tight text-foreground">
            Medscope
          </h2>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest animate-pulse">
            Loading application...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLoadingFallback;
