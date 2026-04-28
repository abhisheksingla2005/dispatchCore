/**
 * MobileSidebarWrapper — Responsive sidebar container
 *
 * Desktop: renders sidebar normally (sticky, flex column).
 * Mobile (<lg): sidebar hidden, hamburger top bar shown, sidebar slides out as drawer.
 *
 * Usage: Sidebar component renders MobileTopBar OUTSIDE the page flex container,
 * and MobileSidebarWrapper inside. The parent page layout must wrap everything
 * in a flex-col → flex-row structure for mobile compatibility.
 */

import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";

interface MobileSidebarWrapperProps {
  children: ReactNode;
  mobileOpen: boolean;
  onClose: () => void;
  desktopOpen: boolean;
}

export function MobileSidebarWrapper({
  children,
  mobileOpen,
  onClose,
  desktopOpen,
}: MobileSidebarWrapperProps) {
  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <nav
        className={`hidden lg:flex sticky top-0 h-screen shrink-0 flex-col transition-all duration-300 ease-in-out ${
          desktopOpen ? "w-60" : "w-[68px]"
        } border-border bg-card`}
      >
        {children}
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <nav
        className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col bg-card border-r border-border shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
        {children}
      </nav>
    </>
  );
}

/**
 * MobileTopBar — Hamburger + branding shown only on mobile (<lg).
 * Must be placed BEFORE the flex sidebar+content layout.
 */
interface MobileTopBarProps {
  onMenuClick: () => void;
  title?: string;
}

export function MobileTopBar({ onMenuClick, title }: MobileTopBarProps) {
  return (
    <div className="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>
      <span className="text-sm font-semibold text-foreground">{title || "dispatchCore"}</span>
    </div>
  );
}
