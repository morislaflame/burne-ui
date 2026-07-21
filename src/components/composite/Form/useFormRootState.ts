import { useCallback, useId, useMemo, useRef, useState, type FormEvent } from "react";

import { buildFormErrorSummaryMessage, buildFormSuccessAnnounceMessage, focusFirstFormInvalidField } from "./formA11y";
import { setFormValueAtPath, validateFormFieldRules } from "./formAPI";
import type { FormBindingContextValue, FormFieldRules, FormValues } from "./formTypes";

import { countFormErrors } from "./formAPI";
import type { FormShellIds, UseFormRootStateProps } from "./formTypes";

export function useFormRootState({
  defaultValues,
  values: valuesProp,
  onValuesChange,
  rules: rulesProp,
  resolver,
  validateMode = "onSubmit",
  disabled = false,
  readOnly = false,
  size,
  onSubmit,
  onSubmitError,
}: UseFormRootStateProps) {
  const titleId = useId();
  const descriptionId = useId();
  const errorSummaryId = useId();
  const announceId = useId();

  const shellIds: FormShellIds = {
    titleId,
    descriptionId,
    errorSummaryId,
    announceId,
  };

  const controlled = valuesProp !== undefined;
  const [internalValues, setInternalValues] = useState<FormValues>(defaultValues ?? {});
  const values = controlled ? valuesProp : internalValues;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [submitCount, setSubmitCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announce, setAnnounce] = useState<string | null>(null);

  const fieldRefs = useRef(new Map<string, HTMLElement>());
  const fieldRulesRef = useRef(rulesProp ?? {});
  fieldRulesRef.current = rulesProp ?? {};

  const setValues = useCallback(
    (next: FormValues) => {
      if (!controlled) setInternalValues(next);
      onValuesChange?.(next);
    },
    [controlled, onValuesChange],
  );

  const getValue = useCallback((name: string) => {
    const parts = name.split(".");
    return parts.reduce<unknown>((acc, key) => {
      if (acc == null || typeof acc !== "object") return undefined;
      return (acc as Record<string, unknown>)[key];
    }, values);
  }, [values]);

  const setValue = useCallback(
    (name: string, value: unknown, options?: { shouldValidate?: boolean }) => {
      const nextValues = setFormValueAtPath(values, name, value);
      setValues(nextValues);
      if (options?.shouldValidate) {
        const message = validateFormFieldRules(value, nextValues, fieldRulesRef.current[name]);
        setErrors((prev) => {
          const next = { ...prev };
          if (message) next[name] = message;
          else delete next[name];
          return next;
        });
      }
    },
    [setValues, values],
  );

  const getError = useCallback((name: string) => errors[name], [errors]);
  const getErrors = useCallback(() => errors, [errors]);

  const getFieldRules = useCallback((name: string) => fieldRulesRef.current[name], []);

  const setTouched = useCallback((name: string, nextTouched: boolean) => {
    setTouchedState((prev) => ({ ...prev, [name]: nextTouched }));
  }, []);

  const isTouched = useCallback((name: string) => Boolean(touched[name]), [touched]);

  const registerRef = useCallback((name: string, node: HTMLElement | null) => {
    if (node) fieldRefs.current.set(name, node);
    else fieldRefs.current.delete(name);
  }, []);

  const registerFieldRules = useCallback((name: string, rules?: FormFieldRules) => {
    if (rules == null) return;
    fieldRulesRef.current = { ...fieldRulesRef.current, [name]: rules };
  }, []);

  const unregisterFieldRules = useCallback((name: string) => {
    const next = { ...fieldRulesRef.current };
    delete next[name];
    fieldRulesRef.current = next;
  }, []);

  const validateField = useCallback(
    (name: string) => {
      const message = validateFormFieldRules(
        getValue(name),
        values,
        fieldRulesRef.current[name],
      );
      setErrors((prev) => {
        const next = { ...prev };
        if (message) next[name] = message;
        else delete next[name];
        return next;
      });
      return message;
    },
    [getValue, values],
  );

  const validateForm = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    for (const name of Object.keys(fieldRulesRef.current)) {
      const message = validateFormFieldRules(
        getValue(name),
        values,
        fieldRulesRef.current[name],
      );
      if (message) nextErrors[name] = message;
    }
    setErrors(nextErrors);
    return nextErrors;
  }, [getValue, values]);

  const focusFirstInvalid = useCallback(() => {
    focusFirstFormInvalidField(fieldRefs.current, errors);
  }, [errors]);

  const clearAnnounce = useCallback(() => setAnnounce(null), []);

  const bindingValue = useMemo<FormBindingContextValue>(
    () => ({
      disabled,
      readOnly,
      size,
      validateMode,
      isSubmitting,
      submitCount,
      getValue,
      setValue,
      getError,
      getErrors,
      getFieldRules,
      setTouched,
      isTouched,
      registerRef,
      registerFieldRules,
      unregisterFieldRules,
      validateField,
      validateForm,
      focusFirstInvalid,
      announce,
      clearAnnounce,
    }),
    [
      announce,
      clearAnnounce,
      disabled,
      focusFirstInvalid,
      getError,
      getErrors,
      getFieldRules,
      getValue,
      isSubmitting,
      isTouched,
      readOnly,
      registerRef,
      registerFieldRules,
      unregisterFieldRules,
      setTouched,
      setValue,
      size,
      submitCount,
      validateField,
      validateForm,
      validateMode,
    ],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitCount((n) => n + 1);
      setAnnounce(null);

      let nextErrors: Record<string, string> = validateForm();

      if (resolver) {
        const result = await resolver(values);
        if (result.errors) {
          nextErrors = { ...nextErrors, ...(result.errors as Record<string, string>) };
          setErrors(nextErrors);
        }
      }

      if (countFormErrors(nextErrors) > 0) {
        setAnnounce(buildFormErrorSummaryMessage(countFormErrors(nextErrors)));
        focusFirstFormInvalidField(fieldRefs.current, nextErrors);
        onSubmitError?.(nextErrors);
        return;
      }

      if (!onSubmit) return;

      try {
        setIsSubmitting(true);
        await onSubmit(values);
        setAnnounce(buildFormSuccessAnnounceMessage());
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, onSubmitError, resolver, validateForm, values],
  );

  const hasErrors = countFormErrors(errors) > 0;

  return {
    shellIds,
    bindingValue,
    handleSubmit,
    errors,
    hasErrors,
    isSubmitting,
    announce,
  };
}
