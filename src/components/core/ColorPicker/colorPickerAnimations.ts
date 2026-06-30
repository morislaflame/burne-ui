import { useCallback, useEffect, useRef } from "react";

import { clampN } from "./colorUtils";
import type { UseColorPickerAreaDragProps } from "./colorPickerTypes";

export function useColorPickerAreaDrag({ hsva, setHsva }: UseColorPickerAreaDragProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback(
    (clientX: number, clientY: number) => {
      const el = areaRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = clampN(((clientX - rect.left) / rect.width) * 100, 0, 100);
      const v = clampN(100 - ((clientY - rect.top) / rect.height) * 100, 0, 100);
      setHsva({ ...hsva, s: Math.round(s), v: Math.round(v) });
    },
    [hsva, setHsva],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (dragging.current) update(e.clientX, e.clientY);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [update]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragging.current = true;
      update(e.clientX, e.clientY);
    },
    [update],
  );

  return {
    areaRef,
    handlePointerDown,
  };
}
