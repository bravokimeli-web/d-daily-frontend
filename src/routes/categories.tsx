import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, products } from "@/data/products";

export const Route = createFileRoute("/categories")({
  component: () => (
    <div className="container-px mx-auto max-w-7xl py-16">
      <h1 className="font-display text-4xl md:text-5xl font-bold">Categories</h1>
      <p className="mt-3 text-muted-foreground max-w-xl">Explore our product universe.</p>
      <div className="mt-10 grid md:grid-cols-2 gap-5">
        {categories.map((c) => {
          const items = products.filter((p) => p.category === c.id);
          return (
            <Link key={c.id} to="/shop" search={{ category: c.id }} className="group rounded-3xl bg-card border p-8 hover:border-primary/40 hover:shadow-soft transition-all">
              <div className="font-display text-2xl font-bold group-hover:text-primary">{c.name}</div>
              <p className="mt-2 text-muted-foreground">{c.description}</p>
              <div className="mt-6 flex -space-x-3">
                {items.slice(0, 4).map((p) => (
                  <img key={p.slug} src={p.image} alt="" className="h-14 w-14 rounded-xl border-2 border-card object-cover bg-surface"/>
                ))}
              </div>
              <div className="mt-6 text-sm font-semibold text-primary">Browse {items.length} products →</div>
            </Link>
          );
        })}
      </div>
    </div>
  ),
});
