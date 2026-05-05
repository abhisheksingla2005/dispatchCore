import { lazy, Suspense } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { LoadingScreen } from "@/components/ui/loading-screen";
import type { AppRouteDefinition } from "./types";

// Lazy-load all driver pages to reduce initial bundle
const DriverDashboard = lazy(() => import("@/pages/driver/dashboard"));
const DriverMarketplace = lazy(() => import("@/pages/driver/marketplace"));
const DriverBidsPage = lazy(() => import("@/pages/driver/bids"));
const DriverDeliveriesPage = lazy(() => import("@/pages/driver/deliveries"));
const DriverEarningsPage = lazy(() => import("@/pages/driver/earnings"));
const DriverMessagesPage = lazy(() => import("@/pages/driver/messages"));
const DriverSettingsPage = lazy(() => import("@/pages/driver/settings"));
const DriverRoutesPage = lazy(() => import("@/pages/driver/routes"));

const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen />}>
    {children}
  </Suspense>
);

export const driverRoutes: AppRouteDefinition[] = [
  { path: "/driver/dashboard", element: <PageTransition><LazyPage><DriverDashboard /></LazyPage></PageTransition> },
  { path: "/driver/marketplace", element: <PageTransition><LazyPage><DriverMarketplace /></LazyPage></PageTransition> },
  { path: "/driver/bids", element: <PageTransition><LazyPage><DriverBidsPage /></LazyPage></PageTransition> },
  { path: "/driver/deliveries", element: <PageTransition><LazyPage><DriverDeliveriesPage /></LazyPage></PageTransition> },
  { path: "/driver/routes", element: <PageTransition><LazyPage><DriverRoutesPage /></LazyPage></PageTransition> },
  { path: "/driver/earnings", element: <PageTransition><LazyPage><DriverEarningsPage /></LazyPage></PageTransition> },
  { path: "/driver/messages", element: <PageTransition><LazyPage><DriverMessagesPage /></LazyPage></PageTransition> },
  { path: "/driver/settings", element: <PageTransition><LazyPage><DriverSettingsPage /></LazyPage></PageTransition> },
];
