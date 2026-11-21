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
 
  const registerRef = form?.registerRef;
  const setFormValue = form?.setValue;
  const setTouched = form?.setTouched;
  const validateField = form?.validateField;
  const getFieldRules = form?.getFieldRules;
  const validateMode = form?.validateMode;

  const onChangeRef = useRef(onChangeProp);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest user onChange without recreating handler
  onChangeRef.current = onChangeProp;

  const onBlurRef = useRef(onBlurProp);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest user onBlur without recreating handler
  onBlurRef.current = onBlurProp;

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
  const onChange = useCallback(
    (event: unknown) => {
      onChangeRef.current?.(event);
      if (!bound || !name || !setFormValue) return;
      const next = readControlValueFromEvent(event, type);
      setFormValue(name, next, {
        shouldValidate: validateMode === "onChange",
      });
    },
    [bound, name, setFormValue, type, validateMode],
  );
 
  const onBlur = useCallback(
    (event: unknown) => {
      onBlurRef.current?.(event);
      if (!bound || !name) return;
      setTouched?.(name, true);
      if (validateMode === "onBlur") {
        validateField?.(name);
      }
    },
    [bound, name, setTouched, validateField, validateMode],
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
 