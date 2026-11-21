/**
 * Slot motion for ColorPicker — look here first.
 *
 * DOM slots: `contentPanel`, `area`, `areaThumb`, `hexInput`, `alphaInput`, `presets`, `previewSwatch`
 * (`hueSlider` / `alphaSlider` / `trigger` are passed through to ColorSlider / Popover).
 *
 * Not slots: area thumb `left`/`top` drag geometry (kit-internal).
 * Root is a portal-host map. Host `ColorPicker.Content` plays optional `enter`
 * on `contentPanel` (also `hexInput` / `alphaInput` / `presets`). `change` plays on `area` when
 * hex updates (excludes `areaThumb`). Area / areaThumb skip mount `enter` — they
 * are the drag surface (`playEnter: false`); thumb `left`/`top` is kit-internal.
 * Pointer → motion press → drag (`useColorPickerAreaDrag`) unless `defaultPrevented`.
 * Defaults: empty.
 */
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
 
import { focusElement } from "@/components/core/utils/focusElement";
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  useSlotPhaseOnChange,
} from "@/components/core/utils/slotMotion";
 
import { clampN } from "./colorUtils";
import { useOptionalColorPickerMotionScope } from "./colorPickerContext";
import type {
  ColorPickerMotion,
  ColorPickerPartMotion,
  UseColorPickerAreaDragProps,
} from "./colorPickerTypes";
import {
  COLOR_PICKER_AREA_KEYBOARD_STEP,
  COLOR_PICKER_AREA_KEYBOARD_STEP_LARGE,
} from "./colorPickerA11y";
 
export function resolveColorPickerMotionDefaults(): ColorPickerMotion {
  return {};
}
 
export function useColorPickerSlotMotion<T extends HTMLElement>(
  slot: keyof ColorPickerMotion,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    playEnter = true,
  }: {
    motion?: ColorPickerPartMotion;
    forwardedRef?: ForwardedRef<T>;
    onPointerOver?: (e: ReactPointerEvent<T>) => void;
    onPointerOut?: (e: ReactPointerEvent<T>) => void;
    onPointerDown?: (e: ReactPointerEvent<T>) => void;
    onPointerUp?: (e: ReactPointerEvent<T>) => void;
    playEnter?: boolean;
  } = {},
) {
  const scope = useOptionalColorPickerMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<T>({
    scope,
    slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(playEnter ? scope : null, slot, part.targetRef);
  return part;
}
 
export function useColorPickerAreaChange(hex: string) {
  const scope = useOptionalColorPickerMotionScope();
  useSlotPhaseOnChange(scope, "area", hex, {
    phase: "change",
    exclude: ["areaThumb"],
  });
}
 
export function useColorPickerAreaDrag({
  hsva,
  setHsva,
  disabled = false,
  readOnly = false,
}: UseColorPickerAreaDragProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLButtonElement>(null);
  const dragging = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const blocked = disabled || readOnly;
 
  const update = useCallback(
    (clientX: number, clientY: number) => {
      if (blocked) return;
      const el = areaRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const s = clampN(((clientX - rect.left) / rect.width) * 100, 0, 100);
      const v = clampN(100 - ((clientY - rect.top) / rect.height) * 100, 0, 100);
      setHsva({ ...hsva, s: Math.round(s), v: Math.round(v) });
    },
    [blocked, hsva, setHsva],
  );
 
  const updateRef = useRef(update);
  useLayoutEffect(() => {
    updateRef.current = update;
  }, [update]);
 
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) {
        return;
      }
      updateRef.current(e.clientX, e.clientY);
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) {
        return;
      }
      activePointerIdRef.current = null;
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
  }, []);
 
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (blocked || e.button !== 0) return;
      e.preventDefault();
      activePointerIdRef.current = e.pointerId;
      dragging.current = true;
      update(e.clientX, e.clientY);
      focusElement(thumbRef.current);
    },
    [blocked, update],
  );
 
  const handleThumbKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (blocked) return;
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
    [blocked, hsva, setHsva],
  );
 
  return {
    areaRef,
    thumbRef,
    handlePointerDown,
    handleThumbKeyDown,
  };
}
 