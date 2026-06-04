import { useCallback, useEffect, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";
import { readControlHeightPx } from "@/components/core/utils/controlSizeLayout";

const MAX_HEIGHT_PX = 640;

export function useTextAreaResize(
  shellRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  blocked: boolean,
  size: ComponentSize,
): {
  onResizePointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
} {
  const setHeight = useCallback(
    (next: number | null) => {
      const shell = shellRef.current;
      if (!shell) return;
      if (next != null) shell.style.height = `${next}px`;
      else shell.style.removeProperty("height");
    },
    [shellRef],
  );

  useEffect(() => {
    if (!enabled) setHeight(null);
  }, [enabled, setHeight]);

  const onResizePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (blocked || !enabled) return;
      e.preventDefault();
      e.stopPropagation();

      const shell = shellRef.current;
      const handle = e.currentTarget;
      if (!shell) return;

      const startY = e.clientY;
      const startHeight = shell.getBoundingClientRect().height;
      const minHeight = readControlHeightPx(size);

      handle.setPointerCapture(e.pointerId);

      const onMove = (ev: globalThis.PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        const next = Math.min(
          MAX_HEIGHT_PX,
          Math.max(minHeight, startHeight + (ev.clientY - startY)),
        );
        setHeight(next);
      };

      const onUp = (ev: globalThis.PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        handle.releasePointerCapture(e.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    },
    [blocked, enabled, setHeight, shellRef, size],
  );

  return { onResizePointerDown };
}
