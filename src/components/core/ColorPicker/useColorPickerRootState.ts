import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
 
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";
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
  disabled: disabledProp,
  readOnly: readOnlyProp,
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
    disabled: disabledProp,
    readOnly: readOnlyProp,
  });
  const formBound = formBinding.bound;
  const resolvedReadOnly = Boolean(readOnlyProp ?? formBinding.readOnly);
  const resolvedDisabled = Boolean(disabledProp ?? formBinding.disabled);
  const boundHex =
    formBound && formBinding.value != null && formBinding.value !== ""
      ? String(formBinding.value)
      : undefined;
  const externalHex = value ?? boundHex;
  const isControlled = value !== undefined || formBound;
  const autoId = useId();
  const triggerId = idProp ?? `color-picker-${autoId}`;
  const [hsva, setHsvaState] = useState<HSVA>(() =>
    colorPickerInitialHsva(externalHex, defaultValue),
  );
  const pendingHsvaRef = useRef<HSVA | null>(null);
 
  useLayoutEffect(() => {
    if (!isControlled) return;
    const targetHex = externalHex ?? defaultValue;
    const pending = pendingHsvaRef.current;
    pendingHsvaRef.current = null;
    if (pending && normalizeHex(targetHex) === normalizeHex(hsvaToHex(pending))) {
      setHsvaState(pending);
      return;
    }
    setHsvaState((current) => {
      if (normalizeHex(targetHex) === normalizeHex(hsvaToHex(current))) {
        return current;
      }
      return hexToHsva(targetHex) ?? current;
    });
  }, [defaultValue, externalHex, isControlled]);
 
  const resetToDefault = useCallback(() => {
    pendingHsvaRef.current = null;
    setHsvaState(colorPickerInitialHsva(undefined, defaultValue));
  }, [defaultValue]);
 
  const setHsva = useCallback(
    (next: HSVA) => {
      if (resolvedDisabled || resolvedReadOnly) return;
      const nextHex = hsvaToHex(next);
      if (!isControlled) {
        setHsvaState(next);
      } else {
        pendingHsvaRef.current = next;
        const currentTarget = externalHex ?? defaultValue;
        if (normalizeHex(nextHex) === normalizeHex(currentTarget)) {
          setHsvaState(next);
        }
      }
      onValueChange?.(nextHex);
      if (formBound) formBinding.setValue(nextHex);
    },
    [defaultValue, externalHex, formBinding, formBound, isControlled, onValueChange, resolvedDisabled, resolvedReadOnly],
  );
 
  const hex = hsvaToHex(hsva);
 
  const hasCompoundError = useMemo(
    () => hasCompoundChild(children, "ColorPicker.Error", "ColorPickerError"),
    [children],
  );
  const resolvedError =
    error ?? (!hasCompoundError && formBound ? formBinding.error : undefined);
 
  const invalid = useResolvedFieldInvalid({
    invalid: ariaInvalid === true ? true : invalidProp,
    errorConnected: resolvedError != null || hasCompoundError,
    formInvalid: Boolean(formBound && formBinding.error),
  });
 
  const registerTriggerRef = formBound ? formBinding.ref : undefined;
  const onTriggerBlur = formBound ? formBinding.onBlur : undefined;
 
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
      error: resolvedError,
      name: formBinding.name ?? name,
      autoFocus,
      tabIndex,
      registerTriggerRef,
      onTriggerBlur,
    }),
    [
      autoFocus,
      formBinding.name,
      hex,
      hint,
      hsva,
      invalid,
      label,
      name,
      onTriggerBlur,
      registerTriggerRef,
      required,
      resolvedDisabled,
      resolvedError,
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
    isControlled,
    resetToDefault,
  };
}
 