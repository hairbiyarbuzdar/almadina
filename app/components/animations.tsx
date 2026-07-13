"use client";

import {
  useLayoutEffect,
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// useLayoutEffect on the client (avoids SSR warning), useEffect on the server.
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fades + slides its content in when it scrolls into view. */
export function Reveal({
  children,
  className,
  as,
  y = 24,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  y?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useIso(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [y, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Staggers its direct children in when the group scrolls into view. */
export function RevealStagger({
  children,
  className,
  as,
  y = 24,
  stagger = 0.12,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  y?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useIso(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [y, stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Counts a number up from 0 when it scrolls into view. Keeps any suffix (e.g. "+", "k"). */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useIso(() => {
    const el = ref.current;
    if (!el) return;
    const match = String(value).match(/^([\d,]+)(.*)$/);
    if (!match || reducedMotion()) return;

    const target = parseInt(match[1].replace(/,/g, ""), 10);
    const suffix = match[2];
    const grouped = match[1].includes(",");
    const counter = { n: 0 };
    el.textContent = `0${suffix}`;

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        n: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          const v = Math.round(counter.n);
          el.textContent = `${grouped ? v.toLocaleString("en-US") : v}${suffix}`;
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
