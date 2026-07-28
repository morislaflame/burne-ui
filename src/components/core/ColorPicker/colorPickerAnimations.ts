import { useCallback, useEffect, useRef } from "react";

import { focusElement } from "@/components/core/utils/focusElement";

import { clampN } from "./colorUtils";
import type { UseColorPickerAreaDragProps } from "./colorPickerTypes";
import {
  COLOR_PICKER_AREA_KEYBOARD_STEP,
  COLOR_PICKER_AREA_KEYBOARD_STEP_LARGE,
} from "./colorPickerA11y";

export function useColorPickerAreaDrag({ hsva, setHsva }: UseColorPickerAreaDragProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLButtonElement>(null);
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
    (e: React.PointerEvent<HTMLElement>) => {
      e.preventDefault();
      dragging.current = true;
      update(e.clientX, e.clientY);
      focusElement(thumbRef.current);
    },
    [update],
  );

  const handleThumbKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const large = e.shiftKey;
      const step = large
        ? COLOR_PICKER_AREA_KEYBOARD_STEP_LARGE
        : COLOR_PICKER_AREA_KEYBOARD_STEP;
      let nextS = hsva.s;
      let nextV = hsva.v;

      switch (e.key) {
        case "ArrowLeft":
          nextS = hsva.s - step;
          break;
        case "ArrowRight":
          nextS = hsva.s + step;
          break;
        case "ArrowUp":
          nextV = hsva.v + step;
          break;
        case "ArrowDown":
          nextV = hsva.v - step;
          break;
        case "Home":
          nextS = 0;
          break;
        case "End":
          nextS = 100;
          break;
        case "PageUp":
          nextV = hsva.v + COLOR_PICKER_AREA_KEYBOARD_STEP_LARGE;
          break;
        case "PageDown":
          nextV = hsva.v - COLOR_PICKER_AREA_KEYBOARD_STEP_LARGE;
          break;
        default:
          return;
      }

      e.preventDefault();
      setHsva({
        ...hsva,
        s: Math.round(clampN(nextS, 0, 100)),
        v: Math.round(clampN(nextV, 0, 100)),
      });
    },
    [hsva, setHsva],
  );

  return {
    areaRef,
    thumbRef,
    handlePointerDown,
    handleThumbKeyDown,
  };
}
