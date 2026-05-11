/**
 * D-Daily API Client
 * Thin wrapper around fetch for communicating with the Express backend.
 */

/** Production backend when `VITE_API_URL` is unset or invalid at build time (e.g. only `/api` on Vercel). */
const DEFAULT_PRODUCTION_API = "https://d-daily-e-commerce-backend.onrender.com/api";

/**
 * Base URL for Express `/api` routes (no trailing slash).
 * - Production: must be absolute `https://…`. Relative `/api` would POST to the static host → HTTP 405.
 * - Development: if unset, uses `/api` + Vite proxy to `localhost:5000`.
 */
export function getApiBaseUrl(): string {
  const rawInput = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

  const normalizeHttpBase = (s: string): string => {
    const base = s.replace(/\/+$/, "");
    if (base.endsWith("/api")) return base;
    return `${base}/api`;
  };

  if (import.meta.env.DEV) {
    if (!rawInput) return "/api";
    if (!/^https?:\/\//i.test(rawInput)) return "/api";
    return normalizeHttpBase(rawInput);
  }

  if (!rawInput || !/^https?:\/\//i.test(rawInput)) {
    return DEFAULT_PRODUCTION_API;
  }
  return normalizeHttpBase(rawInput);
}

const BASE_URL = getApiBaseUrl();

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "API error");
  return data;
}

// ─── Products ──────────────────────────────────────────────────────────────────

export interface Product {
  _id: string;
  slug: string;
  name: string;
  price: number | null;
  category: string;
  image: string;
  tagline: string;
  description: string;
  usage: string[];
  safety: string[];
  specs: { label: string; value: string }[];
  badge?: string;
  stock: number;
  isActive: boolean;
}

export const productsApi = {
  getAll: (params?: { category?: string; search?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ success: boolean; data: Product[] }>(`/products${qs ? `?${qs}` : ""}`);
  },
  getBySlug: (slug: string) =>
    request<{ success: boolean; data: Product }>(`/products/${slug}`),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  slug: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface CreateOrderPayload {
  customer: {
    name: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
  };
  items: OrderItem[];
  courier?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    order: { id: string; orderNumber: string; total: number; status: string };
    payment: { authorizationUrl: string; reference: string; accessCode: string };
  };
}

export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    request<CreateOrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verify: (reference: string) =>
    request<{ success: boolean; data: { orderNumber: string; status: string; total: number; paidAt: string } }>(
      `/orders/verify/${reference}`
    ),

  getByOrderNumber: (orderNumber: string) =>
    request<{ success: boolean; data: unknown }>(`/orders/${orderNumber}`),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  login: (email: string, password: string) =>
    request<{ success: boolean; data: { token: string; admin: { name: string; email: string; role: string } } }>(
      "/admin/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),

  getDashboard: (token: string) =>
    request<{ success: boolean; data: unknown }>("/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
