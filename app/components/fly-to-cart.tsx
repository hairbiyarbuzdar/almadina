"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { motion } from "motion/react";

type FlyFn = (image: string, fromRect: DOMRect, onDone?: () => void) => void;

type Clone = {
  id: number;
  image: string;
  left: number;
  top: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  scale: number;
  rotate: number;
  onDone?: () => void;
};

const FlyContext = createContext<FlyFn | null>(null);
let nextId = 0;

export function FlyToCartProvider({ children }: { children: React.ReactNode }) {
  const [clones, setClones] = useState<Clone[]>([]);

  const fly = useCallback<FlyFn>((image, fromRect, onDone) => {
    const target = document.querySelector("[data-cart-target]");
    const to = target?.getBoundingClientRect();
    if (!to) {
      onDone?.();
      return;
    }

    const srcCx = fromRect.left + fromRect.width / 2;
    const srcCy = fromRect.top + fromRect.height / 2;
    const toCx = to.left + to.width / 2;
    const toCy = to.top + to.height / 2;

    setClones((c) => [
      ...c,
      {
        id: nextId++,
        image,
        left: fromRect.left,
        top: fromRect.top,
        width: fromRect.width,
        height: fromRect.height,
        dx: toCx - srcCx,
        dy: toCy - srcCy,
        scale: Math.max(0.05, to.width / fromRect.width),
        rotate: Math.random() * 24 - 12,
        onDone,
      },
    ]);
  }, []);

  const remove = (clone: Clone) => {
    setClones((c) => c.filter((x) => x.id !== clone.id));
    clone.onDone?.();
  };

  return (
    <FlyContext.Provider value={fly}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-[9998]">
        {clones.map((c) => (
          <motion.img
            key={c.id}
            src={c.image}
            alt=""
            initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
            animate={{
              x: c.dx,
              y: c.dy,
              scale: c.scale,
              rotate: c.rotate,
              opacity: 0.9,
            }}
            transition={{
              // Slower, fully-visible flight with a soft spring wobble at the end.
              default: { type: "spring", duration: 1.1, bounce: 0.32 },
              // Arc: rise a touch before dropping into the cart.
              y: { type: "spring", duration: 1.1, bounce: 0.4 },
              opacity: { duration: 1.1, ease: "easeIn" },
            }}
            onAnimationComplete={() => remove(c)}
            style={{
              position: "fixed",
              left: c.left,
              top: c.top,
              width: c.width,
              height: c.height,
              objectFit: "cover",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>
    </FlyContext.Provider>
  );
}

export function useFlyToCart() {
  return useContext(FlyContext);
}
