import { useCallback, useId, useLayoutEffect, useMemo, useState } from "react";
 
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { resolveFieldInvalid } from "@/components/core/utils/fieldInvalid";
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
  children,
  value,
  defaultValue = COLOR_PICKER_DEFAULT_HEX,
  onValueChange,
  size = "base",
  disabled = false,
  readOnly = false,
  name,
  required = false,
  label,
  hint,
  error,
  id: idProp,
  invalid: invalidProp,
  autoFocus,
  tabIndex,
  "aria-invalid": ariaInvalid,
}: UseColorPickerRootStateProps) {
  const formBinding = useFormFieldBinding({
    name,
    value,
    disabled,
    readOnly,
  });
  const resolvedReadOnly = Boolean(formBinding.readOnly);
  const resolvedDisabled = Boolean(formBinding.disabled);
  const boundHex =
    formBinding.bound && formBinding.value != null && formBinding.value !== ""
      ? String(formBinding.value)
      : undefined;
  const isControlled = value !== undefined || boundHex !== undefined;
  const autoId = useId();
  const triggerId = idProp ?? `color-picker-${autoId}`;
  const [hsva, setHsvaState] = useState<HSVA>(() =>
    colorPickerInitialHsva(value ?? boundHex, defaultValue),
  );
 
  useLayoutEffect(() => {
    const external = value ?? boundHex;
    if (!isControlled || external == null) return;
    setHsvaState((current) => {
      if (normalizeHex(external) === normalizeHex(hsvaToHex(current))) {
        return current;
      }
      return hexToHsva(external) ?? current;
    });
  }, [boundHex, isControlled, value]);
 
  const setHsva = useCallback(
    (next: HSVA) => {
      if (resolvedReadOnly) return;
      setHsvaState(next);
      const hex = hsvaToHex(next);
      onValueChange?.(hex);
      if (formBinding.bound) formBinding.setValue(hex);
    },
    [formBinding, onValueChange, resolvedReadOnly],
  );
 
  const hex = hsvaToHex(hsva);
 
  const invalid = resolveFieldInvalid({
    invalid: invalidProp,
    error: error != null || ariaInvalid === true || formBinding["aria-invalid"] === true ? true : undefined,
  });
  const contextValue: ColorPickerContextValue = useMemo(
    () => ({
      hsva,
      setHsva,
      hex,
      disabled: resolvedDisabled,
      readOnly: resolvedReadOnly,
      size,
      invalid,
      triggerId,
      labelId: `${triggerId}-label`,
      required,
      label,
      hint,
      error: error ?? (typeof formBinding.error === "string" ? formBinding.error : undefined),
      name: formBinding.name ?? name,
      autoFocus,
      tabIndex,
    }),
    [
      autoFocus,
      error,
      formBinding.error,
      formBinding.name,
      hex,
      hint,
      hsva,
      invalid,
      label,
      name,
      required,
      resolvedDisabled,
      resolvedReadOnly,
      setHsva,
      size,
      tabIndex,
      triggerId,
    ],
  );
 
  return {
    contextValue,
    isCompound: hasCompoundChildren(children),
  };
}
 