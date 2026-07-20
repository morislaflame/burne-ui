import { useOptionalRadioGroupContext } from "@/components/composite/RadioGroup/radioGroupContext";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useCallback, useId, useMemo, useRef, type ChangeEvent, type MouseEvent, type ReactNode } from "react";

import { radioErrorId, radioHintId, radioInputId } from "./radioA11y";
import { compoundUsesInlineMotion } from "./radioAPI";
import { RADIO_SIZE_LAYOUT } from "./radioStyles";
import type { RadioFieldContextValue, UseRadioRootStateProps } from "./radioTypes";

export function useRadioRootState(
  {
    size = "base",
    variant = "default",
    danger = false,
    disabled,
    checked,
    defaultChecked,
    onChange,
    id: idProp,
    name,
    value,
    required,
    form,
    autoFocus,
    tabIndex,
    readOnly,
    onBlur,
    onFocus,
    label,
    hint,
    error,
  }: UseRadioRootStateProps,
  children: ReactNode | undefined,
  className?: string,
  onClick?: (e: MouseEvent<HTMLInputElement>) => void,
) {
  const group = useOptionalRadioGroupContext();
  const optionValueStr = value !== undefined && value !== null ? String(value) : undefined;
  const inGroup = group != null && optionValueStr != null;

  const autoId = useId();
  const inputId = radioInputId(idProp, autoId);
  const hintId = radioHintId(inputId);
  const errorId = radioErrorId(inputId);

  const isExplicitlyControlled = checked !== undefined;
  const groupChecked = inGroup ? group.selectedValue === optionValueStr : undefined;
  const resolvedChecked = isExplicitlyControlled
    ? checked
    : groupChecked !== undefined
      ? groupChecked
      : undefined;

  const [mergedChecked, setMergedChecked, isControlled] = useControllableState({
    value: resolvedChecked,
    defaultValue: Boolean(inGroup || isExplicitlyControlled ? undefined : defaultChecked),
  });

  const inputName = name ?? group?.name;
  const isDisabled = Boolean(disabled ?? group?.disabled);
  const isCompound = hasCompoundChildren(children);
  const hasCompoundLabel = isCompound ? hasCompoundChild(children, "RadioLabel") : false;
  const hasCompoundHint = isCompound ? hasCompoundChild(children, "RadioHint") : false;
  const hasCompoundError = isCompound ? hasCompoundChild(children, "RadioError") : false;
  const hasLabel = isCompound ? hasCompoundLabel : Boolean(label);
  const useInlineCompoundMotion = isCompound && compoundUsesInlineMotion(className);
  const enableTextMotion = !isDisabled && (!isCompound || useInlineCompoundMotion);
  const sz = RADIO_SIZE_LAYOUT[size];
  const hasHint = hint != null;
  const hasError = error != null;
  const secondaryLines = isCompound
    ? (hasCompoundHint ? 1 : 0) + (hasCompoundError ? 1 : 0)
    : (hasHint ? 1 : 0) + (hasError ? 1 : 0);

  const textColRef = useRef<HTMLElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!isExplicitlyControlled && !inGroup) setMergedChecked(e.target.checked);
      onChange?.(e);
      if (e.defaultPrevented) return;
      if (inGroup && e.target.checked && optionValueStr != null) {
        group.selectValue(optionValueStr);
      }
    },
    [group, inGroup, isExplicitlyControlled, onChange, optionValueStr, setMergedChecked],
  );

  const canClearSelection =
    !isDisabled && !readOnly && !required && !(inGroup && group.isRequired);

  const inputRequired =
    required ?? (inGroup && group.isRequired ? group.claimRequiredAnchor() : undefined);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLInputElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || !canClearSelection || !mergedChecked) return;

      e.preventDefault();

      if (inGroup) {
        group.selectValue(undefined);
        return;
      }

      if (!isExplicitlyControlled) {
        setMergedChecked(false);
      }
    },
    [
      canClearSelection,
      group,
      inGroup,
      isExplicitlyControlled,
      mergedChecked,
      onClick,
      setMergedChecked,
    ],
  );

  const contextValue: RadioFieldContextValue = useMemo(
    () => ({
      inputId,
      hintId,
      errorId,
      size,
      variant,
      mergedChecked,
      isDisabled,
      isControlled,
      isCompound,
      hasCompoundHint,
      hasCompoundError,
      hintConnected: isCompound ? hasCompoundHint : hasHint,
      errorConnected: isCompound ? hasCompoundError : hasError,
      hasLabel,
      useInlineCompoundMotion,
      textMotionRef: textColRef,
      danger,
      inputName,
      onChange: handleChange,
      onActivate: handleClick,
      inputProps: {
        value,
        defaultChecked: !isControlled ? defaultChecked : undefined,
        required: inputRequired,
        form,
        autoFocus,
        tabIndex,
        readOnly,
        onBlur,
        onFocus,
      },
    }),
    [
      danger,
      defaultChecked,
      form,
      autoFocus,
      errorId,
      handleChange,
      handleClick,
      hasCompoundError,
      hasCompoundHint,
      hasError,
      hasHint,
      hasLabel,
      hintId,
      inputId,
      inputName,
      isCompound,
      useInlineCompoundMotion,
      isControlled,
      isDisabled,
      mergedChecked,
      onBlur,
      onFocus,
      inputRequired,
      readOnly,
      size,
      tabIndex,
      value,
      variant,
    ],
  );

  return {
    contextValue,
    isCompound,
    isDisabled,
    mergedChecked,
    enableTextMotion,
    textColRef,
    secondaryLines,
    sz,
    hasHint,
    hasError,
    label,
    hint,
    error,
    hintId,
    errorId,
    danger,
  };
}
