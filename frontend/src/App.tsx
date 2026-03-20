import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAnimatedFavicon } from "./hooks/app/useAnimatedFavicon";
import ScrollToTop from "./components/layout/scroll-to-top";
import { publicRoutes } from "./routes/public";
import { dispatcherRoutes } from "./routes/dispatcher";
import { driverRoutes } from "./routes/driver";
import { employedDriverRoutes } from "./routes/employed-driver";
import { superadminRoutes } from "./routes/superadmin";
import { errorRoutes } from "./routes/errors";
import type { AppRouteDefinition } from "./routes/types";

const appRoutes: AppRouteDefinition[] = [
  ...publicRoutes,
  ...dispatcherRoutes,
  ...driverRoutes,
  ...employedDriverRoutes,
  ...superadminRoutes,
  ...errorRoutes,
];

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {appRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useAnimatedFavicon();
  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
