import type { Product, Category } from "@/data/products";
import { getApiBaseUrl } from "@/lib/api";

/** Raw product row from GET /api/products */
export type ApiProductRow = {
  slug: string;
  name: string;
  price: number | null;
  category: string;
  image: string;
  tagline?: string;
  description?: string;
  usage?: string[];
  safety?: string[];
  specs?: { label: string; value: string }[];
  badge?: string;
  originalPrice?: number;
  images?: string[];
  variants?: { id: string; label: string; price: number; originalPrice?: number }[];
};

export function mapApiProductToStorefront(p: ApiProductRow): Product {
  return {
    slug: p.slug,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    category: p.category as Category,
    image: p.image,
    tagline: p.tagline ?? "",
    description: p.description ?? "",
    usage: Array.isArray(p.usage) ? p.usage : [],
    safety: Array.isArray(p.safety) ? p.safety : [],
    specs: Array.isArray(p.specs) ? p.specs : [],
    badge: p.badge,
    images: p.images,
    variants: p.variants,
  };
}

export async function fetchActiveStorefrontProducts(): Promise<Product[]> {
  const res = await fetch(`${getApiBaseUrl()}/products?active=true`);
  if (!res.ok) throw new Error("Failed to load products");
  const json = (await res.json()) as { data?: ApiProductRow[] };
  const rows = json.data ?? [];
  return rows.map(mapApiProductToStorefront);
}
