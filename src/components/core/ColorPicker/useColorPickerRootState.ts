import { useCallback, useMemo, useState } from "react";

import { colorPickerInitialHsva, COLOR_PICKER_DEFAULT_HEX } from "./colorPickerAPI";
import { hexToHsva, hsvaToHex, type HSVA } from "./colorUtils";
import type { ColorPickerContextValue, UseColorPickerRootStateProps } from "./colorPickerTypes";

export function useColorPickerRootState({
  value,
  defaultValue = COLOR_PICKER_DEFAULT_HEX,
  onValueChange,
  size = "base",
  disabled = false,
}: UseColorPickerRootStateProps) {
  const isControlled = value !== undefined;
  const [internalHsva, setInternalHsva] = useState<HSVA>(() =>
    colorPickerInitialHsva(value, defaultValue),
  );

  const hsva = useMemo(() => {
    if (isControlled && value != null) {
      return hexToHsva(value) ?? internalHsva;
    }
    return internalHsva;
  }, [internalHsva, isControlled, value]);

  const setHsva = useCallback(
    (next: HSVA) => {
      if (!isControlled) setInternalHsva(next);
      onValueChange?.(hsvaToHex(next));
    },
    [isControlled, onValueChange],
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
