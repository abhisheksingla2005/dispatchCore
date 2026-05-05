import { lazy, Suspense } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { LoadingScreen } from "@/components/ui/loading-screen";
import type { AppRouteDefinition } from "./types";

// Lazy-load all employed driver pages
const EmpDriverDashboard = lazy(() => import("@/pages/employed-driver/dashboard"));
const EmpDriverOrdersPage = lazy(() => import("@/pages/employed-driver/orders"));
const EmpDriverDeliveriesPage = lazy(() => import("@/pages/employed-driver/deliveries"));
const EmpDriverSchedulePage = lazy(() => import("@/pages/employed-driver/schedule"));
const EmpDriverMessagesPage = lazy(() => import("@/pages/employed-driver/messages"));
const EmpDriverSettingsPage = lazy(() => import("@/pages/employed-driver/settings"));

const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen />}>
    {children}
  </Suspense>
);

export const employedDriverRoutes: AppRouteDefinition[] = [
  { path: "/employed-driver/dashboard", element: <PageTransition><LazyPage><EmpDriverDashboard /></LazyPage></PageTransition> },
  { path: "/employed-driver/orders", element: <PageTransition><LazyPage><EmpDriverOrdersPage /></LazyPage></PageTransition> },
  { path: "/employed-driver/deliveries", element: <PageTransition><LazyPage><EmpDriverDeliveriesPage /></LazyPage></PageTransition> },
  { path: "/employed-driver/schedule", element: <PageTransition><LazyPage><EmpDriverSchedulePage /></LazyPage></PageTransition> },
  { path: "/employed-driver/messages", element: <PageTransition><LazyPage><EmpDriverMessagesPage /></LazyPage></PageTransition> },
  { path: "/employed-driver/settings", element: <PageTransition><LazyPage><EmpDriverSettingsPage /></LazyPage></PageTransition> },
];
