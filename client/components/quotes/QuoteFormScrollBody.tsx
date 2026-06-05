"use client";

import { useEffect, useRef, type ReactNode } from "react";

type QuoteFormScrollBodyProps = {
  step: number;
  children: ReactNode;
};

/** Quote form body: step pane animation; on narrow layouts scrolls page so new step isn’t clipped after removing inner scroll. */
export function QuoteFormScrollBody({ step, children }: QuoteFormScrollBodyProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: 0, behavior: "smooth" });
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 900px)").matches) return;
    const card = el.closest(".fc");
    if (!(card instanceof HTMLElement)) return;
    const navGap = 12;
    const top = card.getBoundingClientRect().top + window.scrollY - navGap;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#quote-form") return;
    const scrollToForm = () => {
      const el = ref.current;
      if (!el) return;
      const card = el.closest(".fc");
      const target = card instanceof HTMLElement ? card : el;
      const navGap = 96;
      const top = target.getBoundingClientRect().top + window.scrollY - navGap;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };
    const timer = window.setTimeout(scrollToForm, 150);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="fb" ref={ref} id="quote-form">
      <div className="step-pane" key={step}>
        {children}
      </div>
    </div>
  );
}
