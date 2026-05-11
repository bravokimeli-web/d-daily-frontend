import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, Search, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.jpeg";
import { Button } from "@/components/ui/button";
import { useCart, cartTotals } from "@/store/carts";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/reseller", label: "Resellers" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const setCartOpen = useCart((s) => s.setOpen);
  const { count } = cartTotals(items);
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <header className="absolute inset-x-0 top-0 z-40 lg:sticky backdrop-blur-xl bg-background/85 border-b border-border/60">
      <div className="container-px mx-auto max-w-7xl flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logo} alt="DDaily" className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-cover ring-1 ring-border transition-all duration-200" />
          <div className="leading-tight">
            <div className="font-display font-bold text-sm sm:text-base tracking-tight">D-Daily</div>
            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-muted-foreground -mt-0.5">Ltd · Kenya</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => {
            const active = path === n.to || (n.to !== "/" && path.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                  active ? "text-primary bg-primary-soft" : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button asChild variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex">
            <Link to="/shop">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative" onClick={() => setCartOpen(true)}>
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <div className="container-px mx-auto max-w-7xl py-3 flex flex-col">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium border-b border-border/40 last:border-0"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
