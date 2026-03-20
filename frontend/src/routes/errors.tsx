import { PageTransition } from "@/components/layout/page-transition";
import NotFoundPage from "@/pages/errors/not-found";
import ServerErrorPage from "@/pages/errors/server-error";
import ForbiddenPage from "@/pages/errors/forbidden";
import UnauthorizedPage from "@/pages/errors/unauthorized";
import ServiceUnavailablePage from "@/pages/errors/service-unavailable";
import type { AppRouteDefinition } from "./types";

export const errorRoutes: AppRouteDefinition[] = [
  { path: "/401", element: <PageTransition><UnauthorizedPage /></PageTransition> },
  { path: "/403", element: <PageTransition><ForbiddenPage /></PageTransition> },
  { path: "/500", element: <PageTransition><ServerErrorPage /></PageTransition> },
  { path: "/503", element: <PageTransition><ServiceUnavailablePage /></PageTransition> },
  { path: "*", element: <PageTransition><NotFoundPage /></PageTransition> },
];
