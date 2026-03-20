import { PageTransition } from "@/components/layout/page-transition";
import EmpDriverDashboard from "@/pages/employed-driver/dashboard";
import EmpDriverOrdersPage from "@/pages/employed-driver/orders";
import EmpDriverDeliveriesPage from "@/pages/employed-driver/deliveries";
import EmpDriverSchedulePage from "@/pages/employed-driver/schedule";
import EmpDriverMessagesPage from "@/pages/employed-driver/messages";
import EmpDriverSettingsPage from "@/pages/employed-driver/settings";
import type { AppRouteDefinition } from "./types";

export const employedDriverRoutes: AppRouteDefinition[] = [
  { path: "/employed-driver/dashboard", element: <PageTransition><EmpDriverDashboard /></PageTransition> },
  { path: "/employed-driver/orders", element: <PageTransition><EmpDriverOrdersPage /></PageTransition> },
  { path: "/employed-driver/deliveries", element: <PageTransition><EmpDriverDeliveriesPage /></PageTransition> },
  { path: "/employed-driver/schedule", element: <PageTransition><EmpDriverSchedulePage /></PageTransition> },
  { path: "/employed-driver/messages", element: <PageTransition><EmpDriverMessagesPage /></PageTransition> },
  { path: "/employed-driver/settings", element: <PageTransition><EmpDriverSettingsPage /></PageTransition> },
];
