import { hasAnalyticsConsent } from "@/lib/cookies";

const isBrowser = typeof window !== "undefined";

export const initializeAnalytics = () => {
  if (!isBrowser || !hasAnalyticsConsent()) return;

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function () {
    w.dataLayer.push(arguments);
  };
};

export const trackPageView = () => {
  if (!isBrowser || !hasAnalyticsConsent()) return;

  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag("event", "page_view", {
      page_path: window.location.pathname,
    });
  } else if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: "page_view", page_path: window.location.pathname });
  }
};
