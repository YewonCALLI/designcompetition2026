import { useEffect, type RefObject } from "react";

/**
 * Reveals every `.step[data-step]` inside `ref` one after another as it scrolls
 * into view (styles in globals.css). `data-step="n"` fixes the order explicitly;
 * an empty `data-step=""` uses document order.
 */
export function useStepReveal(ref: RefObject<HTMLElement | null>, gap = 160) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    const order = new Map(els.map((el, i) => [el, el.dataset.step ? Number(el.dataset.step) : i]));
    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({ el: e.target as HTMLElement, step: order.get(e.target as HTMLElement) ?? 0 }))
          .sort((a, b) => a.step - b.step);
        if (!shown.length) return;
        const first = shown[0].step;
        for (const { el, step } of shown) {
          el.style.animationDelay = `${(step - first) * gap}ms`;
          el.classList.add("step-in");
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref, gap]);
}
