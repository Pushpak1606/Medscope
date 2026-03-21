import { Activity } from "lucide-react";

const links = {
  Platform: ["AI Assistant", "Live Consultations", "Reminders", "Community"],
  Company: ["About Us", "Careers", "Contact", "Blog"],
  Support: ["Help Center", "Privacy Policy", "Terms of Service", "FAQ"],
};

const Footer = () => (
  <footer className="border-t border-border/60 bg-background py-14">
    <div className="container">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <a href="#" className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
            <Activity className="h-5 w-5 text-primary" />
            Medscope
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
            AI-powered healthcare support for patients and doctors. Smarter care, better outcomes.
          </p>
        </div>
        {Object.entries(links).map(([group, items]) => (
          <div key={group}>
            <h4 className="mb-4 text-sm font-bold text-foreground">{group}</h4>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Medscope. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
