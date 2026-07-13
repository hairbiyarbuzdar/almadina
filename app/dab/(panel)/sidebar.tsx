"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../actions";

const NAV = [
  { href: "/dab", label: "Dashboard" },
  { href: "/dab/products", label: "Products" },
  { href: "/dab/categories", label: "Categories" },
  { href: "/dab/orders", label: "Orders" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-60 lg:min-h-screen bg-ink text-white/80 flex lg:flex-col shrink-0">
      <div className="px-6 py-6 hidden lg:block">
        <div className="font-display text-lg tracking-[0.25em] text-white">
          AL-MADINA
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">
          Admin
        </div>
      </div>

      <nav className="flex lg:flex-col gap-1 px-3 lg:px-3 py-3 lg:py-2 flex-1 overflow-x-auto">
        {NAV.map((item) => {
          const active =
            item.href === "/dab"
              ? pathname === "/dab"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2.5 text-sm rounded whitespace-nowrap transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 lg:mt-auto">
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
