"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "almadina-cart";

export type CartLine = {
  slug: string;
  name: string;
  price: number; // whole rupees
  image: string;
  size: string;
  qty: number;
};

export type DetailedItem = CartLine & { lineTotal: number };

type CartContextValue = {
  items: DetailedItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (item: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage once on mount (intentional one-time sync).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist whenever the cart changes (after initial hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore quota / private-mode errors
    }
  }, [lines, hydrated]);

  const addItem = (item: Omit<CartLine, "qty">, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { ...item, qty }];
    });
  };

  const setQty = (slug: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty } : i)),
    );
  };

  const removeItem = (slug: string) =>
    setLines((prev) => prev.filter((i) => i.slug !== slug));

  const clear = () => setLines([]);

  const { items, count, subtotal } = useMemo(() => {
    const detailed: DetailedItem[] = lines.map((l) => ({
      ...l,
      lineTotal: l.price * l.qty,
    }));
    return {
      items: detailed,
      count: detailed.reduce((n, i) => n + i.qty, 0),
      subtotal: detailed.reduce((n, i) => n + i.lineTotal, 0),
    };
  }, [lines]);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    hydrated,
    addItem,
    setQty,
    removeItem,
    clear,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
