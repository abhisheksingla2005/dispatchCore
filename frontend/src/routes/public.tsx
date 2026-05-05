import { lazy, Suspense } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { LoadingScreen } from "@/components/ui/loading-screen";
import type { AppRouteDefinition } from "./types";

// Public pages: landing and auth can load immediately, others lazy-load
import { AuthPage } from "@/pages/auth/login";
import { SignupPage } from "@/pages/auth/signup";
import LandingPage from "@/pages/landing";

// Lazy-load extra pages and tracking
const PricingPage = lazy(() => import("@/pages/extra/pricing"));
const PrivacyPage = lazy(() => import("@/pages/extra/privacy"));
const TermsPage = lazy(() => import("@/pages/extra/terms"));
const SecurityPage = lazy(() => import("@/pages/extra/security"));
const DocsPage = lazy(() => import("@/pages/extra/docs"));
const BlogPage = lazy(() => import("@/pages/extra/blog"));
const ContactPage = lazy(() => import("@/pages/extra/contact"));
const AboutPage = lazy(() => import("@/pages/extra/about"));
const CareersPage = lazy(() => import("@/pages/extra/careers"));
const FAQPage = lazy(() => import("@/pages/extra/faq"));
const SitemapPage = lazy(() => import("@/pages/extra/sitemap"));
const CustomerTrackingPage = lazy(() => import("@/pages/tracking/tracking"));

const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen />}>
    {children}
  </Suspense>
);

export const publicRoutes: AppRouteDefinition[] = [
  { path: "/", element: <PageTransition><LandingPage /></PageTransition> },
  { path: "/login", element: <PageTransition><AuthPage /></PageTransition> },
  { path: "/signup", element: <PageTransition><SignupPage /></PageTransition> },
  { path: "/pricing", element: <PageTransition><LazyPage><PricingPage /></LazyPage></PageTransition> },
  { path: "/privacy", element: <PageTransition><LazyPage><PrivacyPage /></LazyPage></PageTransition> },
  { path: "/terms", element: <PageTransition><LazyPage><TermsPage /></LazyPage></PageTransition> },
  { path: "/security", element: <PageTransition><LazyPage><SecurityPage /></LazyPage></PageTransition> },
  { path: "/docs", element: <PageTransition><LazyPage><DocsPage /></LazyPage></PageTransition> },
  { path: "/blog", element: <PageTransition><LazyPage><BlogPage /></LazyPage></PageTransition> },
  { path: "/contact", element: <PageTransition><LazyPage><ContactPage /></LazyPage></PageTransition> },
  { path: "/about", element: <PageTransition><LazyPage><AboutPage /></LazyPage></PageTransition> },
  { path: "/careers", element: <PageTransition><LazyPage><CareersPage /></LazyPage></PageTransition> },
  { path: "/faq", element: <PageTransition><LazyPage><FAQPage /></LazyPage></PageTransition> },
  { path: "/sitemap", element: <PageTransition><LazyPage><SitemapPage /></LazyPage></PageTransition> },
  { path: "/track/:trackingCode", element: <PageTransition><LazyPage><CustomerTrackingPage /></LazyPage></PageTransition> },
];
