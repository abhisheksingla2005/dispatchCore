import { Suspense } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";

export const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen />}>
    {children}
  </Suspense>
);
