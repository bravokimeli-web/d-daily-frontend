import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { categories, type Category } from "@/data/products";
import { ProductCard } from "@/components/commerce/ProductCard";
import { z } from "zod";
import type { Product } from "@/data/products";
import { fetchActiveStorefrontProducts, mergeStaticAndApiProducts } from "@/lib/storefrontCatalog";
import { toast } from "sonner";

const searchSchema = z.object({
  category: z.enum(["lighting", "home-protection", "farm-protection", "fashion-design"]).optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => searchSchema.parse(s),
  component: ShopPage,
});

function ShopPage() {
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q ?? "");
  const cat = search.category;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQ(search.q ?? "");
  }, [search.q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchActiveStorefrontProducts();
        if (!cancelled) setProducts(list);
      } catch {
        if (!cancelled) {
          toast.error("Could not reach the server. Showing built-in catalog only.");
          setProducts(mergeStaticAndApiProducts([]));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const query = q.trim() || search.q;

  const filtered = products.filter((p) => {
    if (cat && p.category !== cat) return false;
    if (query && !`${p.name} ${p.tagline}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const isFashionDesign = cat === "fashion-design";

  return (
    <div className="container-px mx-auto max-w-7xl py-12 md:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Shop</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">
          {isFashionDesign ? "Fashion & Design" : "All products"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {isFashionDesign
            ? "Stylish products are arriving soon — stay tuned for our new fashion collection."
            : "Premium essentials, ready to ship across Kenya."}
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Link
          to="/shop"
          search={search.q ? { q: search.q } : undefined}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!cat ? "bg-foreground text-background" : "bg-muted hover:bg-accent"}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            to="/shop"
            search={search.q ? { category: c.id as Category, q: search.q } : { category: c.id as Category }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === c.id ? "bg-foreground text-background" : "bg-muted hover:bg-accent"}`}
          >
            {c.name}
          </Link>
        ))}
        <div className="ml-auto flex w-full max-w-md items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="h-10 flex-1 rounded-full border border-input bg-card text-sm px-4 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Link
            to="/shop"
            search={{ ...(cat ? { category: cat } : {}), q: q || undefined }}
            className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Search
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> product{filtered.length === 1 ? "" : "s"}
          {cat ? ` in ${categories.find((c) => c.id === cat)?.name}` : ""}
          {query ? ` for "${query}"` : ""}
        </p>
        {(cat || search.q) && (
          <Link to="/shop" className="font-semibold text-primary hover:underline">
            Clear filters
          </Link>
        )}
      </div>

      {loading ? (
        <div className="mt-16 text-center text-muted-foreground">Loading products…</div>
      ) : (
        <>
          {isFashionDesign && (
            <div className="mt-10 rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center">
              <p className="text-sm uppercase tracking-[0.32em] text-primary">Fashion & Design</p>
              <h2 className="mt-4 text-3xl font-semibold">Something stylish is coming soon</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
                We’re curating a fresh collection of design-led products for brands, creatives, and modern homes.
                Check back shortly for the launch.
              </p>
            </div>
          )}

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <ProductCard product={p} key={p.slug} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              <p className="text-lg font-semibold text-foreground">
                {cat === "fashion-design" ? "Fashion & Design products are coming soon." : "No products match your filters."}
              </p>
              <p className="mt-2">
                {cat === "fashion-design"
                  ? "We’re working on stylish products for this category. Browse our other collections while you wait."
                  : "Try clearing category filters or searching with a different keyword."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Link
                  to="/shop"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  View all products
                </Link>
                <Link
                  to="/shop"
                  className="rounded-full border border-input px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
                >
                  Clear filters
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
