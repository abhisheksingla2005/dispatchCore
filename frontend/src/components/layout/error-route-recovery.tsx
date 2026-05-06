import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { consumeLastNonErrorRoute } from "@/lib/api";

function isReloadNavigation(): boolean {
  const navEntry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return navEntry?.type === "reload";
}

export function ErrorRouteRecovery({ children }: { children: ReactNode }) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (!isReloadNavigation()) {
      return;
    }

    const previousRoute = consumeLastNonErrorRoute();
    if (!previousRoute) {
      return;
    }

    const currentRoute = `${pathname}${search}${hash}`;
    if (previousRoute !== currentRoute) {
      window.location.replace(previousRoute);
    }
  }, [pathname, search, hash]);

  return <>{children}</>;
}
