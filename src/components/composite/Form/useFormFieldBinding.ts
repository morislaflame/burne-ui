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
 
  const registerRef = form?.registerRef;
  const setFormValue = form?.setValue;
  const setTouched = form?.setTouched;
  const validateField = form?.validateField;
  const getFieldRules = form?.getFieldRules;
  const validateMode = form?.validateMode;

  const onChangeRef = useRef(onChangeProp);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest user onChange without recreating bound setter
  onChangeRef.current = onChangeProp;

  const ref = useRef<HTMLElement | null>(null);
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      ref.current = node;
      if (bound && name) registerRef?.(name, node);
    },
    [bound, name, registerRef],
  );
 
  const disabled = disabledProp ?? form?.disabled ?? false;
  const readOnly = readOnlyProp ?? form?.readOnly ?? false;
  const formError = bound && name ? form.getError(name) : undefined;
  const rules = useMemo(
    () => mergeFormFieldRules(name ? getFieldRules?.(name) : undefined, rulesProp),
    [getFieldRules, name, rulesProp],
  );
 
  const rawValue = bound && name ? form.getValue(name) : valueProp;
  // Keep form-bound controls controlled from mount (undefined → "" would warn in React).
  const value = bound ? (rawValue ?? "") : rawValue;
 
  const setValue = useCallback(
    (next: unknown) => {
      onChangeRef.current?.(next);
      if (!bound || !name || !setFormValue) return;
      setFormValue(name, next, {
        shouldValidate: validateMode === "onChange",
      });
    },
    [bound, name, setFormValue, validateMode],
  );
 
  const onBlur = useCallback(() => {
    if (!bound || !name) return;
    setTouched?.(name, true);
    if (validateMode === "onBlur") {
      validateField?.(name);
    }
  }, [bound, name, setTouched, validateField, validateMode]);
 
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
 