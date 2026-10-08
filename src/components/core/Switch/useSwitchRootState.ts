import { useId, useMemo, useRef, useState } from "react";
 
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
 
import { resolveFieldInvalid } from "@/components/core/utils/fieldInvalid";
import { useFieldInvalid } from "@/components/core/Field/fieldContext";
import { compoundHasLabel, compoundUsesInlineMotion, countSecondaryLines } from "./switchAPI";
import { switchErrorId, switchHintId, switchInputId, switchLabelId } from "./switchA11y";
import { SWITCH_LAYOUT } from "./switchStyles";
import type { SwitchFieldContextValue, UseSwitchRootStateProps } from "./switchTypes";
 
export function useSwitchRootState(
  {
    children,
    label,
    hint,
    error,
    invalid,
    labelPosition = "right",
    size = "base",
    disabled: disabledRoot,
    className,
    ...controlRest
  }: UseSwitchRootStateProps & { className?: string },
) {
  const autoId = useId();
  const switchId = switchInputId(
    typeof controlRest.id === "string" ? controlRest.id : undefined,
    autoId,
  );
  const labelId = switchLabelId(switchId);
  const hintId = switchHintId(switchId);
  const errorId = switchErrorId(switchId);
  const [, setSqueezeToken] = useState(0);
  const [mergedChecked, setMergedChecked] = useState<boolean | null>(() => {
    if (typeof controlRest.checked === "boolean") return controlRest.checked;
    if (controlRest.defaultChecked != null) return Boolean(controlRest.defaultChecked);
    return null;
  });
 
  const { isCompound, hasCompoundHint, hasCompoundError, hasCompoundLabel } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasCompoundHint: compound ? hasCompoundChild(children, "Switch.Hint") : false,
      hasCompoundError: compound ? hasCompoundChild(children, "Switch.Error") : false,
      hasCompoundLabel: compound ? compoundHasLabel(children) : false,
    };
  }, [children]);
  const useInlineCompoundMotion = isCompound && compoundUsesInlineMotion(className);
  const hasHint = hint != null;
  const hasError = error != null;
  const isInvalid = resolveFieldInvalid({
    invalid,
    error: (isCompound ? hasCompoundError : hasError) ? true : undefined,
    inheritedInvalid: useFieldInvalid(),
  });
  const secondaryLines = countSecondaryLines(
    isCompound,
    hasHint,
    hasError,
    hasCompoundHint,
    hasCompoundError,
  );
  const hasTextColumn = isCompound ? hasCompoundLabel : label != null;
  const disabled = disabledRoot;
  const enableTextMotion =
    !disabled && hasTextColumn && (!isCompound || useInlineCompoundMotion);
 
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
      required: false,
    }),
    [labelId, switchId],
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
    error,
    hasHint,
    hasError,
    hintId,
    errorId,
    disabled,
    enableTextMotion,
    textColRef,
    labelPosition,
    controlRest,
  };
}
 