import { PageTransition } from "@/components/layout/page-transition";
import { AuthPage } from "@/pages/auth/login";
import { SignupPage } from "@/pages/auth/signup";
import LandingPage from "@/pages/landing";
import PricingPage from "@/pages/extra/pricing";
import PrivacyPage from "@/pages/extra/privacy";
import TermsPage from "@/pages/extra/terms";
import SecurityPage from "@/pages/extra/security";
import DocsPage from "@/pages/extra/docs";
import BlogPage from "@/pages/extra/blog";
import ContactPage from "@/pages/extra/contact";
import AboutPage from "@/pages/extra/about";
import CareersPage from "@/pages/extra/careers";
import FAQPage from "@/pages/extra/faq";
import SitemapPage from "@/pages/extra/sitemap";
import CustomerTrackingPage from "@/pages/tracking/tracking";
import type { AppRouteDefinition } from "./types";

export const publicRoutes: AppRouteDefinition[] = [
  { path: "/", element: <PageTransition><LandingPage /></PageTransition> },
  { path: "/login", element: <PageTransition><AuthPage /></PageTransition> },
  { path: "/signup", element: <PageTransition><SignupPage /></PageTransition> },
  { path: "/pricing", element: <PageTransition><PricingPage /></PageTransition> },
  { path: "/privacy", element: <PageTransition><PrivacyPage /></PageTransition> },
  { path: "/terms", element: <PageTransition><TermsPage /></PageTransition> },
  { path: "/security", element: <PageTransition><SecurityPage /></PageTransition> },
  { path: "/docs", element: <PageTransition><DocsPage /></PageTransition> },
  { path: "/blog", element: <PageTransition><BlogPage /></PageTransition> },
  { path: "/contact", element: <PageTransition><ContactPage /></PageTransition> },
  { path: "/about", element: <PageTransition><AboutPage /></PageTransition> },
  { path: "/careers", element: <PageTransition><CareersPage /></PageTransition> },
  { path: "/faq", element: <PageTransition><FAQPage /></PageTransition> },
  { path: "/sitemap", element: <PageTransition><SitemapPage /></PageTransition> },
  { path: "/track/:trackingCode", element: <PageTransition><CustomerTrackingPage /></PageTransition> },
];
