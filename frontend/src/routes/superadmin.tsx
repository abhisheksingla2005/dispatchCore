import { PageTransition } from "@/components/layout/page-transition";
import SuperAdminDashboardPage from "@/pages/superadmin/dashboard";
import SuperAdminCompaniesPage from "@/pages/superadmin/companies";
import SuperAdminDriversPage from "@/pages/superadmin/drivers";
import SuperAdminAnalyticsPage from "@/pages/superadmin/analytics";
import SuperAdminSettingsPage from "@/pages/superadmin/settings";
import type { AppRouteDefinition } from "./types";

export const superadminRoutes: AppRouteDefinition[] = [
  { path: "/superadmin", element: <PageTransition><SuperAdminDashboardPage /></PageTransition> },
  { path: "/superadmin/companies", element: <PageTransition><SuperAdminCompaniesPage /></PageTransition> },
  { path: "/superadmin/drivers", element: <PageTransition><SuperAdminDriversPage /></PageTransition> },
  { path: "/superadmin/analytics", element: <PageTransition><SuperAdminAnalyticsPage /></PageTransition> },
  { path: "/superadmin/settings", element: <PageTransition><SuperAdminSettingsPage /></PageTransition> },
];
