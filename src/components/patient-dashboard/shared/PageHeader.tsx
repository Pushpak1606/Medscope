import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

const PageHeader = ({ title, subtitle, backHref = "/patient/dashboard", backLabel = "Back" }: PageHeaderProps) => {
  return (
    <div className="flex flex-col mb-8 gap-2">
      <Link 
        to={backHref}
        className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        {backLabel}
      </Link>
      <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
