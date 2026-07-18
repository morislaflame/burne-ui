import { useCallback, useMemo, useRef } from "react";

import { mergeFormFieldRules } from "./formAPI";
import { formFieldAriaInvalid } from "./formA11y";
import { useOptionalFormBindingContext } from "./formContext";
import type { UseFormFieldBindingOptions } from "./formTypes";

export function useFormFieldBinding({
  name,
  value: valueProp,
  onChange: onChangeProp,
  disabled: disabledProp,
  readOnly: readOnlyProp,
  rules: rulesProp,
}: UseFormFieldBindingOptions) {
  const form = useOptionalFormBindingContext();
  const explicitValue = valueProp !== undefined;
  const bound = form != null && name != null && !explicitValue;

  const ref = useRef<HTMLElement | null>(null);
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      ref.current = node;
      if (bound && name) form.registerRef(name, node);
    },
    [bound, form, name],
  );

  const disabled = disabledProp ?? form?.disabled ?? false;
  const readOnly = readOnlyProp ?? form?.readOnly ?? false;
  const formError = bound && name ? form.getError(name) : undefined;
  const rules = useMemo(
    () => mergeFormFieldRules(name ? form?.getFieldRules(name) : undefined, rulesProp),
    [form, name, rulesProp],
  );

  const rawValue = bound && name ? form.getValue(name) : valueProp;
  // Keep form-bound controls controlled from mount (undefined → "" would warn in React).
  const value = bound ? (rawValue ?? "") : rawValue;

  const setValue = useCallback(
    (next: unknown) => {
      onChangeProp?.(next);
      if (!bound || !name || !form) return;
      form.setValue(name, next, {
        shouldValidate: form.validateMode === "onChange",
      });
    },
    [bound, form, name, onChangeProp],
  );

  const onBlur = useCallback(() => {
    if (!bound || !name || !form) return;
    form.setTouched(name, true);
    if (form.validateMode === "onBlur") {
      form.validateField(name);
    }
  }, [bound, form, name]);

  return {
    bound,
    name,
    value,
    setValue,
    onBlur,
    disabled: disabled || form?.isSubmitting,
    readOnly,
    ref: setRef,
    "aria-invalid": formFieldAriaInvalid(formError),
    error: formError,
    rules,
  };
}
