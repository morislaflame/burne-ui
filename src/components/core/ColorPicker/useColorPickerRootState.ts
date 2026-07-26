import { useCallback, useLayoutEffect, useMemo, useState } from "react";

import { colorPickerInitialHsva, COLOR_PICKER_DEFAULT_HEX } from "./colorPickerAPI";
import { hexToHsva, hsvaToHex, normalizeHex, type HSVA } from "./colorUtils";
import type { ColorPickerContextValue, UseColorPickerRootStateProps } from "./colorPickerTypes";

/**
 * HSVA is the source of truth (not hex).
 * Hex round-trip collapses hue 360 → 0 (same RGB), which would snap the hue
 * slider thumb back to the start — keep the current HSVA when the external hex
 * still represents the same color.
 */
export function useColorPickerRootState({
  value,
  defaultValue = COLOR_PICKER_DEFAULT_HEX,
  onValueChange,
  size = "base",
  disabled = false,
}: UseColorPickerRootStateProps) {
  const isControlled = value !== undefined;
  const [hsva, setHsvaState] = useState<HSVA>(() =>
    colorPickerInitialHsva(value, defaultValue),
  );

  useLayoutEffect(() => {
    if (!isControlled || value == null) return;
    setHsvaState((current) => {
      if (normalizeHex(value) === normalizeHex(hsvaToHex(current))) {
        return current;
      }
      return hexToHsva(value) ?? current;
    });
  }, [isControlled, value]);

  const setHsva = useCallback(
    (next: HSVA) => {
      setHsvaState(next);
      onValueChange?.(hsvaToHex(next));
    },
    [onValueChange],
  );

  const hex = hsvaToHex(hsva);

  const contextValue: ColorPickerContextValue = useMemo(
    () => ({ hsva, setHsva, hex, disabled, size }),
    [hsva, setHsva, hex, disabled, size],
  );

  return {
    contextValue,
  };
}
