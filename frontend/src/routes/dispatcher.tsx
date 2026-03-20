import { PageTransition } from "@/components/layout/page-transition";
import DashboardPage from "@/pages/dispatcher/dashboard";
import OrdersPage from "@/pages/dispatcher/orders";
import ShipmentsPage from "@/pages/dispatcher/shipments";
import MapOverviewPage from "@/pages/dispatcher/map";
import MessagesPage from "@/pages/dispatcher/messages";
import SettingsPage from "@/pages/dispatcher/settings";
import DriversPage from "@/pages/dispatcher/drivers";
import DispatcherAnalyticsPage from "@/pages/dispatcher/analytics";
import DispatcherMarketplace from "@/pages/dispatcher/marketplace";
import DispatcherDriverRoutesPage from "@/pages/dispatcher/driver-routes";
import type { AppRouteDefinition } from "./types";

export const dispatcherRoutes: AppRouteDefinition[] = [
  { path: "/dashboard", element: <PageTransition><DashboardPage /></PageTransition> },
  { path: "/dashboard/orders", element: <PageTransition><OrdersPage /></PageTransition> },
  { path: "/dashboard/shipments", element: <PageTransition><ShipmentsPage /></PageTransition> },
  { path: "/dashboard/map", element: <PageTransition><MapOverviewPage /></PageTransition> },
  { path: "/dashboard/messages", element: <PageTransition><MessagesPage /></PageTransition> },
  { path: "/dashboard/settings", element: <PageTransition><SettingsPage /></PageTransition> },
  { path: "/dashboard/drivers", element: <PageTransition><DriversPage /></PageTransition> },
  { path: "/dashboard/analytics", element: <PageTransition><DispatcherAnalyticsPage /></PageTransition> },
  { path: "/dispatcher/marketplace", element: <PageTransition><DispatcherMarketplace /></PageTransition> },
  { path: "/dispatcher/driver-routes", element: <PageTransition><DispatcherDriverRoutesPage /></PageTransition> },
];
