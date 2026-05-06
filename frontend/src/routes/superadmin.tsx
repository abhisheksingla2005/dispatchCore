import { lazy } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { LazyPage } from "@/components/layout/lazy-page";
import type { AppRouteDefinition } from "./types";

// Lazy-load all superadmin pages
const SuperAdminDashboardPage = lazy(() => import("@/pages/superadmin/dashboard"));
const SuperAdminCompaniesPage = lazy(() => import("@/pages/superadmin/companies"));
const SuperAdminDriversPage = lazy(() => import("@/pages/superadmin/drivers"));
const SuperAdminAnalyticsPage = lazy(() => import("@/pages/superadmin/analytics"));
const SuperAdminSettingsPage = lazy(() => import("@/pages/superadmin/settings"));


export const superadminRoutes: AppRouteDefinition[] = [
  { path: "/superadmin", element: <PageTransition><LazyPage><SuperAdminDashboardPage /></LazyPage></PageTransition> },
  { path: "/superadmin/companies", element: <PageTransition><LazyPage><SuperAdminCompaniesPage /></LazyPage></PageTransition> },
  { path: "/superadmin/drivers", element: <PageTransition><LazyPage><SuperAdminDriversPage /></LazyPage></PageTransition> },
  { path: "/superadmin/analytics", element: <PageTransition><LazyPage><SuperAdminAnalyticsPage /></LazyPage></PageTransition> },
  { path: "/superadmin/settings", element: <PageTransition><LazyPage><SuperAdminSettingsPage /></LazyPage></PageTransition> },
];
