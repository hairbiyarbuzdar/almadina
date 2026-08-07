"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CartDrawer } from "./cart-drawer";
import { PageTransition } from "./page-transition";
import { FlyToCartProvider } from "./fly-to-cart";

/**
 * Wraps pages in the storefront chrome (header / footer / cart), except on the
 * admin dashboard (`/dab`), which provides its own layout.
 */
export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dab");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <FlyToCartProvider>
      {/* Opaque content layer that scrolls up over the footer (curtain reveal). */}
      <div className="relative z-10 min-h-screen bg-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.55)]">
        <SiteHeader />
        {children}
      </div>

      {/* Footer pinned behind the content — revealed as the content scrolls past. */}
      <div className="sticky bottom-0 z-0">
        <SiteFooter />
      </div>

      <CartDrawer />
      <PageTransition />
    </FlyToCartProvider>
  );
}
