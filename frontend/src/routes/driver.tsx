import { PageTransition } from "@/components/layout/page-transition";
import DriverDashboard from "@/pages/driver/dashboard";
import DriverMarketplace from "@/pages/driver/marketplace";
import DriverBidsPage from "@/pages/driver/bids";
import DriverDeliveriesPage from "@/pages/driver/deliveries";
import DriverEarningsPage from "@/pages/driver/earnings";
import DriverMessagesPage from "@/pages/driver/messages";
import DriverSettingsPage from "@/pages/driver/settings";
import DriverRoutesPage from "@/pages/driver/routes";
import type { AppRouteDefinition } from "./types";

export const driverRoutes: AppRouteDefinition[] = [
  { path: "/driver/dashboard", element: <PageTransition><DriverDashboard /></PageTransition> },
  { path: "/driver/marketplace", element: <PageTransition><DriverMarketplace /></PageTransition> },
  { path: "/driver/bids", element: <PageTransition><DriverBidsPage /></PageTransition> },
  { path: "/driver/deliveries", element: <PageTransition><DriverDeliveriesPage /></PageTransition> },
  { path: "/driver/routes", element: <PageTransition><DriverRoutesPage /></PageTransition> },
  { path: "/driver/earnings", element: <PageTransition><DriverEarningsPage /></PageTransition> },
  { path: "/driver/messages", element: <PageTransition><DriverMessagesPage /></PageTransition> },
  { path: "/driver/settings", element: <PageTransition><DriverSettingsPage /></PageTransition> },
];
