import { Heart } from "lucide-react";
import MedscopeLogo from "@/components/ui/MedscopeLogo";
import { Link } from "react-router-dom";

const links = {
  Platform: [
    { label: "AI Assistant", href: "#" },
    { label: "Live Consultations", href: "#" },
    { label: "Reminders", href: "#" },
    { label: "Community", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "FAQ", href: "#faq" },
  ],
};

const Footer = () => (
  <footer className="relative border-t border-border/40 bg-background pt-20 pb-10 overflow-hidden mt-auto">
    {/* Subtle Glow Behind Logo */}
    <div className="absolute left-0 top-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

    <div className="container relative z-10 hidden sm:block">
      <div className="grid gap-12 md:grid-cols-5 lg:gap-8">
        <div className="md:col-span-2 lg:pr-12">
          <Link to="/" className="inline-flex items-center gap-2 font-heading text-xl font-bold text-foreground transition-opacity hover:opacity-90">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <MedscopeLogo className="h-5 w-5" />
            </div>
            <span>Medscope</span>
          </Link>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground max-w-sm">
            AI-powered healthcare support for patients and doctors. Smarter care, better outcomes, accessible anywhere.
          </p>
        </div>
        
        {Object.entries(links).map(([group, items]) => (
          <div key={group}>
            <h4 className="mb-5 text-sm font-bold text-foreground">{group}</h4>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.label}>
                  <a 
                    href={item.href} 
                    className="group inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span className="relative transform transition-transform duration-300 group-hover:translate-x-1">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Medscope. All rights reserved.
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Made with <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 animate-pulse" /> for better healthcare
        </p>
      </div>
    </div>
    
    <div className="container relative z-10 sm:hidden">
      <div className="flex flex-col gap-10">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 font-heading text-xl font-bold text-foreground transition-opacity hover:opacity-90">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <MedscopeLogo className="h-5 w-5" />
            </div>
            <span>Medscope</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            AI-powered healthcare support for patients and doctors.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          {Object.entries(links).slice(0, 2).map(([group, items]) => (
            <div key={group}>
              <h4 className="mb-4 text-sm font-bold text-foreground">{group}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center gap-4 border-t border-border/40 pt-8">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> for healthcare
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Medscope. 
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
