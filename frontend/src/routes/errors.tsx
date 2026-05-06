import { type ReactElement } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { ErrorRouteRecovery } from "@/components/layout/error-route-recovery";
import NotFoundPage from "@/pages/errors/not-found";
import ServerErrorPage from "@/pages/errors/server-error";
import ForbiddenPage from "@/pages/errors/forbidden";
import UnauthorizedPage from "@/pages/errors/unauthorized";
import ServiceUnavailablePage from "@/pages/errors/service-unavailable";
import type { AppRouteDefinition } from "./types";

const withErrorRecovery = (node: ReactElement): ReactElement => (
  <ErrorRouteRecovery>
    <PageTransition>{node}</PageTransition>
  </ErrorRouteRecovery>
);

export const errorRoutes: AppRouteDefinition[] = [
  { path: "/unauthorized", element: withErrorRecovery(<UnauthorizedPage />) },
  { path: "/401", element: withErrorRecovery(<UnauthorizedPage />) },

  { path: "/forbidden", element: withErrorRecovery(<ForbiddenPage />) },
  { path: "/403", element: withErrorRecovery(<ForbiddenPage />) },

  { path: "/server-error", element: withErrorRecovery(<ServerErrorPage />) },
  { path: "/500", element: withErrorRecovery(<ServerErrorPage />) },

  {
    path: "/service-unavailable",
    element: withErrorRecovery(<ServiceUnavailablePage />),
  },
  { path: "/503", element: withErrorRecovery(<ServiceUnavailablePage />) },

  { path: "/not-found", element: withErrorRecovery(<NotFoundPage />) },
  { path: "/404", element: withErrorRecovery(<NotFoundPage />) },

  { path: "*", element: withErrorRecovery(<NotFoundPage />) },
];
