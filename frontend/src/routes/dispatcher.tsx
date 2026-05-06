import { lazy } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { LazyPage } from "@/components/layout/lazy-page";
import type { AppRouteDefinition } from "./types";

// Lazy-load all dispatcher pages to reduce initial bundle
const DashboardPage = lazy(() => import("@/pages/dispatcher/dashboard"));
const OrdersPage = lazy(() => import("@/pages/dispatcher/orders"));
const ShipmentsPage = lazy(() => import("@/pages/dispatcher/shipments"));
const MapOverviewPage = lazy(() => import("@/pages/dispatcher/map"));
const MessagesPage = lazy(() => import("@/pages/dispatcher/messages"));
const SettingsPage = lazy(() => import("@/pages/dispatcher/settings"));
const DriversPage = lazy(() => import("@/pages/dispatcher/drivers"));
const DispatcherAnalyticsPage = lazy(() => import("@/pages/dispatcher/analytics"));
const DispatcherMarketplace = lazy(() => import("@/pages/dispatcher/marketplace"));
const DispatcherDriverRoutesPage = lazy(() => import("@/pages/dispatcher/driver-routes"));

export const dispatcherRoutes: AppRouteDefinition[] = [
  { path: "/dashboard", element: <PageTransition><LazyPage><DashboardPage /></LazyPage></PageTransition> },
  { path: "/dashboard/orders", element: <PageTransition><LazyPage><OrdersPage /></LazyPage></PageTransition> },
  { path: "/dashboard/shipments", element: <PageTransition><LazyPage><ShipmentsPage /></LazyPage></PageTransition> },
  { path: "/dashboard/map", element: <PageTransition><LazyPage><MapOverviewPage /></LazyPage></PageTransition> },
  { path: "/dashboard/messages", element: <PageTransition><LazyPage><MessagesPage /></LazyPage></PageTransition> },
  { path: "/dashboard/settings", element: <PageTransition><LazyPage><SettingsPage /></LazyPage></PageTransition> },
  { path: "/dashboard/drivers", element: <PageTransition><LazyPage><DriversPage /></LazyPage></PageTransition> },
  { path: "/dashboard/analytics", element: <PageTransition><LazyPage><DispatcherAnalyticsPage /></LazyPage></PageTransition> },
  { path: "/dispatcher/marketplace", element: <PageTransition><LazyPage><DispatcherMarketplace /></LazyPage></PageTransition> },
  { path: "/dispatcher/driver-routes", element: <PageTransition><LazyPage><DispatcherDriverRoutesPage /></LazyPage></PageTransition> },
];
