import { useCallback, useRef, useState } from "react";
import type { PointerEvent } from "react";

import { createConvergeRippleAtPointer, type ConvergeRipple } from "./pressRipple";

/**
 * Состояние и пуш новых рипплов от pointer; геометрию читаем **синхронно** в обработчике —
 * в deferred-апдейтере `setState` у React `e.currentTarget` уже может быть `null`.
 */
export function useConvergeRipples(): {
  ripples: ConvergeRipple[];
  pushFromPointer: (e: PointerEvent<HTMLElement>) => void;
  dismiss: (id: number) => void;
} {
  const idRef = useRef(0);
  const [ripples, setRipples] = useState<ConvergeRipple[]>([]);

  const dismiss = useCallback((id: number) => {
    setRipples((prev) => prev.filter((rp) => rp.id !== id));
  }, []);

  const pushFromPointer = useCallback((e: PointerEvent<HTMLElement>) => {
    const target = e.currentTarget;
    if (!target) return;
    const id = ++idRef.current;
    const ripple = createConvergeRippleAtPointer(
      target,
      e.clientX,
      e.clientY,
      id,
    );
    setRipples((prev) => [...prev, ripple]);
  }, []);

  return { ripples, pushFromPointer, dismiss };
}
