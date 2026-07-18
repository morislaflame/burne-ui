import { useCallback, useMemo, useRef } from "react";

import { mergeFormFieldRules, readControlValueFromEvent } from "./formAPI";
import { formFieldAriaInvalid } from "./formA11y";
import { useOptionalFormBindingContext } from "./formContext";
import type { UseFormControlPropsOptions } from "./formTypes";

export function useFormControlProps({
  name,
  value: valueProp,
  onChange: onChangeProp,
  onBlur: onBlurProp,
  disabled: disabledProp,
  readOnly: readOnlyProp,
  type,
  rules: rulesProp,
}: UseFormControlPropsOptions) {
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
  const onChange = useCallback(
    (event: unknown) => {
      onChangeProp?.(event);
      if (!bound || !name || !form) return;
      const next = readControlValueFromEvent(event, type);
      form.setValue(name, next, {
        shouldValidate: form.validateMode === "onChange",
      });
    },
    [bound, form, name, onChangeProp, type],
  );

  const onBlur = useCallback(
    (event: unknown) => {
      onBlurProp?.(event);
      if (!bound || !name || !form) return;
      form.setTouched(name, true);
      if (form.validateMode === "onBlur") {
        form.validateField(name);
      }
    },
    [bound, form, name, onBlurProp],
  );

  // Form-bound fields must stay controlled from the first render.
  // `getValue` is undefined until the field is written — coerce to "" (same as Select/ComboBox).
  return {
    bound,
    name,
    value:
      bound && type === "checkbox"
        ? Boolean(rawValue)
        : bound
          ? ((rawValue ?? "") as string | number | readonly string[])
          : (rawValue as string | number | readonly string[] | undefined),
    checked: bound && type === "checkbox" ? Boolean(rawValue) : undefined,
    onChange,
    onBlur,
    disabled: disabled || form?.isSubmitting,
    readOnly,
    ref: setRef,
    "aria-invalid": formFieldAriaInvalid(formError),
    error: formError,
    rules,
  };
}

export function useFormField(name: string, rules?: UseFormControlPropsOptions["rules"]) {
  return useFormControlProps({ name, rules });
}
