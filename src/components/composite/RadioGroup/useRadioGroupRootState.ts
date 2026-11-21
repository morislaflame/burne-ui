import { useCallback, useId, useMemo, useRef, useState } from "react";
 
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { useFieldSetErrorId, useFieldSetHintId } from "@/components/core/Field";
import { useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { itemsPartTaken } from "@/components/core/utils/itemsBesideChildren";
 
import {
  createRadioGroupKeyDownHandler,
  findFirstEnabledRadioValue,
  radioGroupName,
} from "./radioGroupA11y";
import type { RadioGroupContextValue, UseRadioGroupRootStateProps } from "./radioGroupTypes";
 
export function useRadioGroupRootState({
  required = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled: disabledProp,
  readOnly: readOnlyProp,
  name: nameProp,
  error,
  items,
  children,
  onKeyDown,
  onBlur: onBlurProp,
  hintId: hintIdProp,
  errorId: errorIdProp,
}: UseRadioGroupRootStateProps) {
  const autoId = useId();
  const legendId = useId();
  const formBinding = useFormFieldBinding({
    name: nameProp,
    value: valueProp,
    disabled: disabledProp,
    readOnly: readOnlyProp,
  });
  const groupName = radioGroupName(formBinding.name ?? nameProp, autoId);
  const resolvedDisabled = Boolean(disabledProp ?? formBinding.disabled);
  const resolvedReadOnly = Boolean(readOnlyProp ?? formBinding.readOnly);
  const formBound = formBinding.bound;
  const formInvalid = Boolean(formBound && formBinding.error);
  const hasCompoundError = useMemo(
    () => hasCompoundChild(children, "RadioGroup.Error", "RadioGroupError"),
    [children],
  );
  const resolvedError =
    error ?? (!hasCompoundError && formBound ? formBinding.error : undefined);

  const formValue =
    formBound && formBinding.value != null && formBinding.value !== ""
      ? String(formBinding.value)
      : null;
  const hintId = useFieldSetHintId(hintIdProp);
  const errorId = useFieldSetErrorId(errorIdProp);
 
  const controlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(() => defaultValue ?? null);
  const selectedValue = formBound
    ? formValue
    : controlled
      ? (valueProp ?? null)
      : internalValue;
 
  const fieldsetRef = useRef<HTMLFieldSetElement | null>(null);
  const bindFieldsetRef = useCallback(
    (node: HTMLFieldSetElement | null) => {
      fieldsetRef.current = node;
      if (formBound) {
        const firstInput = node?.querySelector<HTMLElement>('input[type="radio"]:not(:disabled)');
        formBinding.ref(firstInput ?? node);
      }
    },
    [formBinding, formBound],
  );
 
  useNativeFormReset(
    fieldsetRef,
    () => {
      setInternalValue(defaultValue ?? null);
    },
    !controlled && !formBound,
  );
 
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLFieldSetElement>) => {
      onBlurProp?.(event);
      if (formBound && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
        formBinding.onBlur();
      }
    },
    [formBinding, formBound, onBlurProp],
  );
 
  const selectValue = useCallback(
    (next: string | undefined) => {
      if (resolvedReadOnly || resolvedDisabled) return;
      if (required && next == null) return;
      const resolvedNext = next ?? null;
      if (!controlled && !formBound) setInternalValue(resolvedNext);
      onValueChange?.(resolvedNext);
      if (formBound) formBinding.setValue(resolvedNext ?? "");
    },
    [controlled, formBinding, formBound, onValueChange, required, resolvedDisabled, resolvedReadOnly],
  );
 
  const optionList = useMemo(
    () =>
      items && !itemsPartTaken("RadioGroup", children, "RadioRoot", "RadioGroup.List")
        ? items
        : undefined,
    [children, items],
  );
 
  const requiredAnchorValue = useMemo(
    () => findFirstEnabledRadioValue(optionList, children),
    [children, optionList],
  );
 
  const isOptionRequired = useCallback(
    (optionValue: string | undefined, optionDisabled: boolean) => {
      if (!required || resolvedDisabled || optionDisabled) return false;
      if (requiredAnchorValue === "") return false;
      if (requiredAnchorValue !== null) return optionValue === requiredAnchorValue;
      return true;
    },
    [required, requiredAnchorValue, resolvedDisabled],
  );
 
  const handleKeyDown = useMemo(
    () =>
      createRadioGroupKeyDownHandler({
        disabled: resolvedDisabled,
        readOnly: resolvedReadOnly,
        groupName,
        selectValue,
        onKeyDown,
      }),
    [groupName, onKeyDown, resolvedDisabled, resolvedReadOnly, selectValue],
  );
 
  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({
      name: groupName,
      disabled: resolvedDisabled,
      readOnly: resolvedReadOnly,
      required,
      legendId,
      hintId,
      errorId,
      selectedValue,
      selectValue,
      isOptionRequired,
    }),
    [
      errorId,
      groupName,
      hintId,
      isOptionRequired,
      legendId,
      required,
      resolvedDisabled,
      resolvedReadOnly,
      selectValue,
      selectedValue,
    ],
  );
 
  const fieldLabelCtx = useMemo(() => ({ required }), [required]);
 
  return {
    contextValue,
    fieldLabelCtx,
    hintId,
    errorId,
    disabled: resolvedDisabled,
    optionList,
    formInvalid,
    resolvedError,
    bindFieldsetRef,
    handleKeyDown,
    handleBlur,
  };
}
 