import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface">
      <div className="container-px mx-auto max-w-7xl py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-display font-bold text-xl">D-Daily Ltd</div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Trusted home, farm and pest-protection essentials. Made for the African market — built to last.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Shop</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/shop" className="hover:text-primary transition-colors">All products</Link></li>
            <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
            <li><Link to="/reseller" className="hover:text-primary transition-colors">Become a reseller</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Company</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
            <li><Link to="/safety" className="hover:text-primary transition-colors">Safety & Education</Link></li>
            <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Reach us</div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary"/>Nairobi, Kenya</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary"/>+254 106555333</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary"/>ddailykenya01@gmail.com
</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-px mx-auto max-w-7xl py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} D-Daily Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
