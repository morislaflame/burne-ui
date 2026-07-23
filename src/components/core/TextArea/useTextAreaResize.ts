import { useCallback, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";
import { readControlHeightPx } from "@/components/core/utils/controlHeightMeasure";

const MAX_HEIGHT_PX = 640;
/** Keyboard step for ArrowUp / ArrowDown on the resize handle. */
const KEYBOARD_RESIZE_STEP_PX = 16;

export function useTextAreaResize(
  shellRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  blocked: boolean,
  size: ComponentSize,
): {
  onResizePointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  onResizeKeyDown: (e: ReactKeyboardEvent<HTMLButtonElement>) => void;
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

  const adjustHeightBy = useCallback(
    (delta: number) => {
      const shell = shellRef.current;
      if (!shell) return;
      const minHeight = readControlHeightPx(size);
      const current = shell.getBoundingClientRect().height;
      const next = Math.min(MAX_HEIGHT_PX, Math.max(minHeight, current + delta));
      setHeight(next);
    },
    [setHeight, shellRef, size],
  );

  const onResizePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
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

  const onResizeKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (blocked || !enabled) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        adjustHeightBy(KEYBOARD_RESIZE_STEP_PX);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        adjustHeightBy(-KEYBOARD_RESIZE_STEP_PX);
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        setHeight(readControlHeightPx(size));
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        setHeight(MAX_HEIGHT_PX);
      }
    },
    [adjustHeightBy, blocked, enabled, setHeight, size],
  );

  return { onResizePointerDown, onResizeKeyDown };
}
