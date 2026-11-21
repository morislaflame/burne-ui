import { useId, useMemo, useRef, useState } from "react";
 
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";
 
import {
  compoundHasLabel,
  compoundUsesInlineMotion,
  countSecondaryLines,
  readSwitchCompoundControlProps,
} from "./switchAPI";
import { switchErrorId, switchHintId, switchInputId, switchLabelId } from "./switchA11y";
import { SWITCH_LAYOUT } from "./switchStyles";
import type { SwitchFieldContextValue, UseSwitchRootStateProps, UseSwitchRootStateResult } from "./switchTypes";
 
export function useSwitchRootState(
  {
    children,
    label,
    hint,
    error,
    invalid,
    labelPosition = "end",
    size = "base",
    disabled: disabledRoot,
    className,
    ...controlRest
  }: UseSwitchRootStateProps & { className?: string },
): UseSwitchRootStateResult {
  const compoundControlProps = useMemo(
    () => readSwitchCompoundControlProps(children),
    [children],
  );
  const resolvedName =
    typeof controlRest.name === "string"
      ? controlRest.name
      : typeof compoundControlProps.name === "string"
        ? compoundControlProps.name
        : undefined;
  const resolvedCheckedProp =
    controlRest.checked !== undefined ? controlRest.checked : compoundControlProps.checked;
  const resolvedDefaultCheckedProp =
    controlRest.defaultChecked !== undefined
      ? controlRest.defaultChecked
      : compoundControlProps.defaultChecked;
  const resolvedReadOnlyProp =
    controlRest.readOnly !== undefined ? controlRest.readOnly : compoundControlProps.readOnly;
  const resolvedDisabledProp =
    disabledRoot !== undefined ? disabledRoot : compoundControlProps.disabled;
  const resolvedRequiredProp = Boolean(
    controlRest.required ?? compoundControlProps.required,
  );

  const formBinding = useFormFieldBinding({
    name: resolvedName,
    value: resolvedCheckedProp,
    disabled: resolvedDisabledProp,
    readOnly: resolvedReadOnlyProp,
  });

  const autoId = useId();
  const switchId = switchInputId(
    typeof controlRest.id === "string"
      ? controlRest.id
      : typeof compoundControlProps.id === "string"
        ? compoundControlProps.id
        : undefined,
    autoId,
  );
  const labelId = switchLabelId(switchId);
  const hintId = switchHintId(switchId);
  const errorId = switchErrorId(switchId);
  const [, setSqueezeToken] = useState(0);
  const [mergedChecked, setMergedChecked] = useState<boolean | null>(() => {
    if (typeof resolvedCheckedProp === "boolean") return resolvedCheckedProp;
    if (formBinding.bound) return Boolean(formBinding.value);
    if (resolvedDefaultCheckedProp != null) return Boolean(resolvedDefaultCheckedProp);
    return null;
  });
 
  const { isCompound, hasCompoundHint, hasCompoundError, hasCompoundLabel } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasCompoundHint: compound
        ? hasCompoundChild(children, "Switch.Hint", "SwitchHint")
        : false,
      hasCompoundError: compound
        ? hasCompoundChild(children, "Switch.Error", "SwitchError")
        : false,
      hasCompoundLabel: compound ? compoundHasLabel(children) : false,
    };
  }, [children]);
  const useInlineCompoundMotion = isCompound && compoundUsesInlineMotion(className);
  const resolvedError =
    error ?? (!hasCompoundError && formBinding.bound ? formBinding.error : undefined);
  const hasHint = hint != null;
  const hasError = resolvedError != null;
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: isCompound ? hasCompoundError : hasError,
    formInvalid: Boolean(formBinding.bound && formBinding.error),
  });
  const secondaryLines = countSecondaryLines(
    isCompound,
    hasHint,
    hasError,
    hasCompoundHint,
    hasCompoundError,
  );
  const hasTextColumn = isCompound ? hasCompoundLabel : label != null;
  const disabled = Boolean(resolvedDisabledProp ?? formBinding.disabled);
  const readOnly = Boolean(resolvedReadOnlyProp ?? formBinding.readOnly);
  const enableTextMotion =
    !disabled && hasTextColumn && (!isCompound || useInlineCompoundMotion);
 
  const isChecked =
    mergedChecked ??
    Boolean(
      formBinding.bound
        ? formBinding.value
        : (resolvedCheckedProp ?? resolvedDefaultCheckedProp),
    );
 
  const textColRef = useRef<HTMLElement>(null);
  const sz = SWITCH_LAYOUT[size];
 
  const fieldCtx = useMemo<SwitchFieldContextValue>(
    () => ({
      switchId,
      labelId,
      hintId,
      errorId,
      labelConnected: hasCompoundLabel,
      size,
      labelPosition,
      disabled,
      disabledProp: resolvedDisabledProp,
      readOnly,
      readOnlyProp: resolvedReadOnlyProp,
      invalidProp: invalid,
      required: resolvedRequiredProp,
      isCompound,
      hasCompoundHint,
      hasCompoundError,
      hasTextColumn,
      hintConnected: isCompound ? hasCompoundHint : hasHint,
      errorConnected: isCompound ? hasCompoundError : hasError,
      isInvalid,
      useInlineCompoundMotion,
      textMotionRef: textColRef,
      setSqueezeToken,
      mergedChecked,
      setMergedChecked,
    }),
    [
      disabled,
      resolvedDisabledProp,
      readOnly,
      resolvedReadOnlyProp,
      invalid,
      resolvedRequiredProp,
      hasCompoundHint,
      hasCompoundError,
      hasCompoundLabel,
      hasHint,
      hasError,
      isInvalid,
      hasTextColumn,
      hintId,
      errorId,
      labelId,
      isCompound,
      labelPosition,
      mergedChecked,
      size,
      switchId,
      useInlineCompoundMotion,
    ],
  );
 
  const fieldLabelContext = useMemo(
    () => ({
      controlId: switchId,
      labelId,
      required: resolvedRequiredProp,
    }),
    [labelId, resolvedRequiredProp, switchId],
  );
 
  return {
    fieldCtx,
    fieldLabelContext,
    isCompound,
    hasTextColumn,
    secondaryLines,
    sz,
    label,
    hint,
    error: resolvedError,
    hasHint,
    hasError,
    hintId,
    errorId,
    disabled,
    readOnly,
    required: resolvedRequiredProp,
    isChecked,
    enableTextMotion,
    textColRef,
    labelPosition,
    controlRest,
  };
}
 