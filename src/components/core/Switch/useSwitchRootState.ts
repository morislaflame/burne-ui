import { useId, useMemo, useRef, useState } from "react";

import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";

import { compoundHasLabel, compoundUsesInlineMotion, countSecondaryLines } from "./switchAPI";
import { switchErrorId, switchHintId } from "./switchA11y";
import { SWITCH_LAYOUT } from "./switchStyles";
import type { SwitchFieldContextValue, UseSwitchRootStateProps } from "./switchTypes";

export function useSwitchRootState(
  {
    children,
    label,
    hint,
    error,
    labelPosition = "right",
    size = "base",
    disabled: disabledRoot,
    className,
    ...controlRest
  }: UseSwitchRootStateProps & { className?: string },
) {
  const autoId = useId();
  const switchId = `switch-${autoId}`;
  const hintId = switchHintId(switchId);
  const errorId = switchErrorId(switchId);
  const [, setSqueezeToken] = useState(0);

  const isCompound = hasCompoundChildren(children);
  const hasCompoundHint = isCompound ? hasCompoundChild(children, "Switch.Hint") : false;
  const hasCompoundError = isCompound ? hasCompoundChild(children, "Switch.Error") : false;
  const hasCompoundLabel = isCompound ? compoundHasLabel(children) : false;
  const useInlineCompoundMotion = isCompound && compoundUsesInlineMotion(className);
  const hasHint = hint != null;
  const hasError = error != null;
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
      hintId,
      errorId,
      size,
      labelPosition,
      disabled,
      isCompound,
      hasCompoundHint,
      hasCompoundError,
      hasTextColumn,
      hintConnected: isCompound ? hasCompoundHint : hasHint,
      errorConnected: isCompound ? hasCompoundError : hasError,
      useInlineCompoundMotion,
      textMotionRef: textColRef,
      setSqueezeToken,
    }),
    [
      disabled,
      hasCompoundHint,
      hasCompoundError,
      hasHint,
      hasError,
      hasTextColumn,
      hintId,
      errorId,
      isCompound,
      labelPosition,
      size,
      switchId,
      useInlineCompoundMotion,
    ],
  );

  return {
    fieldCtx,
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
