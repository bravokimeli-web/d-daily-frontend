import type { Product, Category } from "@/data/products";
import { products as staticCatalogProducts, getProduct } from "@/data/products";
import { getApiBaseUrl } from "@/lib/api";

/**
 * Built-in catalog (data/products.ts) plus live API products.
 * Same slug: API version wins so admin can override a built-in item.
 * API-only slugs are appended after the static list order.
 */
export function mergeStaticAndApiProducts(apiList: Product[]): Product[] {
  const bySlug = new Map<string, Product>();
  for (const p of staticCatalogProducts) {
    bySlug.set(p.slug, p);
  }
  for (const p of apiList) {
    bySlug.set(p.slug, p);
  }

  const ordered: Product[] = [];
  const seen = new Set<string>();

  for (const p of staticCatalogProducts) {
    ordered.push(bySlug.get(p.slug)!);
    seen.add(p.slug);
  }
  for (const p of apiList) {
    if (!seen.has(p.slug)) {
      ordered.push(p);
      seen.add(p.slug);
    }
  }
  return ordered;
}

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
  let apiList: Product[] = [];
  try {
    const res = await fetch(`${getApiBaseUrl()}/products?active=true`);
    if (res.ok) {
      const json = (await res.json()) as { data?: ApiProductRow[] };
      apiList = (json.data ?? []).map(mapApiProductToStorefront);
    }
  } catch {
    /* offline / CORS — still show static catalog */
  }
  return mergeStaticAndApiProducts(apiList);
}

/** Active product from API, or built-in static product if API has no match. */
export async function fetchStorefrontProductOrStatic(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/${encodeURIComponent(slug)}`);
    if (res.ok) {
      const json = (await res.json()) as { success?: boolean; data?: ApiProductRow };
      if (json.success && json.data) return mapApiProductToStorefront(json.data);
    }
  } catch {
    /* fall through to static */
  }
  return getProduct(slug) ?? null;
}
