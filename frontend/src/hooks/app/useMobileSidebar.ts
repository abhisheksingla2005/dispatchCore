/**
 * useMobileSidebar — Shared mobile sidebar state
 *
 * Manages open/close for mobile drawer overlay.
 * Auto-closes on route change and on resize above breakpoint.
 */

import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

const MOBILE_BREAKPOINT = 1024; // lg

export function useMobileSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close when resized above breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= MOBILE_BREAKPOINT) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggle = useCallback(() => setMobileOpen((p) => !p), []);
  const close = useCallback(() => setMobileOpen(false), []);

  return { mobileOpen, toggle, close };
}
