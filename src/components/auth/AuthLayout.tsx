import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  sidePanel: React.ReactNode;
  role: "patient" | "doctor";
}

const AuthLayout = ({ children, sidePanel, role }: AuthLayoutProps) => (
  <div className="min-h-screen bg-background">
    <div className="container flex min-h-screen flex-col lg:flex-row">
      {/* Side Panel */}
      <div className="hidden lg:flex lg:w-[440px] xl:w-[480px] flex-col justify-between rounded-3xl bg-surface border border-border/60 m-4 mr-0 p-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="mt-8">
            <Link to="/" className="text-xl font-extrabold font-heading text-foreground tracking-tight">
              Med<span className="text-primary">scope</span>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center py-8">
          {sidePanel}
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Medscope. All rights reserved.
        </p>
      </div>

      {/* Main Form Area */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 lg:px-12">
        {/* Mobile header */}
        <div className="mb-6 flex w-full max-w-md items-center justify-between lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <Link to="/" className="text-lg font-extrabold font-heading text-foreground tracking-tight">
            Med<span className="text-primary">scope</span>
          </Link>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
