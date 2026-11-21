import { useCallback, useId, useMemo, useRef, useState, type FormEvent } from "react";

import { useBurneLabels } from "@/theme/BurneLabelsProvider";

import {
  buildFormErrorSummaryMessage,
  buildFormSuccessAnnounceMessage,
  focusFirstFormInvalidField,
} from "./formA11y";
import {
  cleanFormResolverErrors,
  countFormErrors,
  getFormValueAtPath,
  mergeFormFieldRules,
  setFormValueAtPath,
  validateFormFieldRules,
} from "./formAPI";
import type {
  FormBindingContextValue,
  FormFieldRules,
  FormShellIds,
  FormValues,
  UseFormRootStateProps,
} from "./formTypes";

export function useFormRootState({
  defaultValues,
  values: valuesProp,
  onValuesChange,
  rules: rulesProp,
  resolver,
  validateMode = "onSubmit",
  disabled = false,
  readOnly = false,
  onSubmit,
  onSubmitError,
  onReset,
}: UseFormRootStateProps) {
  const labels = useBurneLabels();
  const titleId = useId();
  const descriptionId = useId();
  const errorSummaryId = useId();
  const announceId = useId();

  const shellIds: FormShellIds = useMemo(
    () => ({
      titleId,
      descriptionId,
      errorSummaryId,
      announceId,
    }),
    [announceId, descriptionId, errorSummaryId, titleId],
  );

  const controlled = valuesProp !== undefined;
  const [internalValues, setInternalValues] = useState<FormValues>(() => defaultValues ?? {});
  const values = controlled ? valuesProp : internalValues;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [submitCount, setSubmitCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announce, setAnnounce] = useState<string | null>(null);

  const fieldRefs = useRef(new Map<string, HTMLElement>());
  const registeredRulesRef = useRef<Record<string, FormFieldRules>>({});
  const rulesPropRef = useRef(rulesProp);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest prop rules without wiping field-registered rules
  rulesPropRef.current = rulesProp;

  const valuesRef = useRef(values);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest values for stable context callbacks
  valuesRef.current = values;

  const errorsRef = useRef(errors);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest errors for stable context callbacks
  errorsRef.current = errors;

  const touchedRef = useRef(touched);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest touched map for stable context callbacks
  touchedRef.current = touched;

  const controlledRef = useRef(controlled);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest controlled flag for stable callbacks
  controlledRef.current = controlled;

  const defaultValuesRef = useRef(defaultValues);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest defaultValues for native form reset
  defaultValuesRef.current = defaultValues;

  const onValuesChangeRef = useRef(onValuesChange);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest onValuesChange callback
  onValuesChangeRef.current = onValuesChange;

  const onResetRef = useRef(onReset);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest user onReset handler
  onResetRef.current = onReset;

  const resolveRulesForField = useCallback((name: string): FormFieldRules | undefined => {
    return mergeFormFieldRules(registeredRulesRef.current[name], rulesPropRef.current?.[name]);
  }, []);

  const setValues = useCallback((next: FormValues) => {
    if (!controlledRef.current) {
      valuesRef.current = next;
      setInternalValues(next);
    }
    onValuesChangeRef.current?.(next);
  }, []);

  const getValue = useCallback((name: string) => {
    return getFormValueAtPath(valuesRef.current, name);
  }, []);

  const setValue = useCallback(
    (name: string, value: unknown, options?: { shouldValidate?: boolean }) => {
      const nextValues = setFormValueAtPath(valuesRef.current, name, value);
      setValues(nextValues);
      if (options?.shouldValidate || Boolean(errorsRef.current[name])) {
        const message = validateFormFieldRules(value, nextValues, resolveRulesForField(name));
        const prevErrors = errorsRef.current;
        if ((message ?? undefined) !== prevErrors[name]) {
          const next = { ...prevErrors };
          if (message) next[name] = message;
          else delete next[name];
          errorsRef.current = next;
          setErrors(next);
        }
      }
    },
    [resolveRulesForField, setValues],
  );

  const getError = useCallback((name: string) => errorsRef.current[name], []);
  const getErrors = useCallback(() => errorsRef.current, []);

  const getFieldRules = useCallback(
    (name: string) => resolveRulesForField(name),
    [resolveRulesForField],
  );

  const setTouched = useCallback((name: string, nextTouched: boolean) => {
    const prevTouched = touchedRef.current;
    if (Boolean(prevTouched[name]) === nextTouched) return;
    const next = { ...prevTouched, [name]: nextTouched };
    touchedRef.current = next;
    setTouchedState(next);
  }, []);

  const isTouched = useCallback((name: string) => Boolean(touchedRef.current[name]), []);

  const registerRef = useCallback((name: string, node: HTMLElement | null) => {
    if (node) fieldRefs.current.set(name, node);
    else fieldRefs.current.delete(name);
  }, []);

  const registerFieldRules = useCallback((name: string, rules?: FormFieldRules) => {
    if (rules == null) return;
    registeredRulesRef.current = { ...registeredRulesRef.current, [name]: rules };
  }, []);

  const unregisterFieldRules = useCallback((name: string) => {
    const next = { ...registeredRulesRef.current };
    delete next[name];
    registeredRulesRef.current = next;
  }, []);

  const validateField = useCallback(
    (name: string) => {
      const currentValues = valuesRef.current;
      const message = validateFormFieldRules(
        getFormValueAtPath(currentValues, name),
        currentValues,
        resolveRulesForField(name),
      );
      const prevErrors = errorsRef.current;
      if ((message ?? undefined) !== prevErrors[name]) {
        const next = { ...prevErrors };
        if (message) next[name] = message;
        else delete next[name];
        errorsRef.current = next;
        setErrors(next);
      }
      return message;
    },
    [resolveRulesForField],
  );

  const validateForm = useCallback(() => {
    const currentValues = valuesRef.current;
    const ruleNames = new Set<string>([
      ...Object.keys(registeredRulesRef.current),
      ...Object.keys(rulesPropRef.current ?? {}),
    ]);
    const nextErrors: Record<string, string> = {};
    for (const name of ruleNames) {
      const message = validateFormFieldRules(
        getFormValueAtPath(currentValues, name),
        currentValues,
        resolveRulesForField(name),
      );
      if (message) nextErrors[name] = message;
    }
    errorsRef.current = nextErrors;
    setErrors(nextErrors);
    return nextErrors;
  }, [resolveRulesForField]);

  const focusFirstInvalid = useCallback(() => {
    focusFirstFormInvalidField(fieldRefs.current, errorsRef.current);
  }, []);

  const clearAnnounce = useCallback(() => setAnnounce(null), []);

  const bindingValue = useMemo<FormBindingContextValue>(() => {
    // Subscribe context consumers to values/errors/touched snapshots while keeping method identities stable.
    void values;
    void errors;
    void touched;
    return {
      disabled,
      readOnly,
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
    };
  }, [
    announce,
    clearAnnounce,
    disabled,
    errors,
    focusFirstInvalid,
    getError,
    getErrors,
    getFieldRules,
    getValue,
    isSubmitting,
    isTouched,
    readOnly,
    registerFieldRules,
    registerRef,
    setTouched,
    setValue,
    submitCount,
    touched,
    unregisterFieldRules,
    validateField,
    validateForm,
    validateMode,
    values,
  ]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitCount((n) => n + 1);
      setAnnounce(null);

      let submitValues = valuesRef.current;
      let nextErrors: Record<string, string> = validateForm();

      if (resolver) {
        const result = await resolver(submitValues);
        if (result.values !== undefined) {
          submitValues = result.values;
        }
        if (result.errors) {
          const cleaned = cleanFormResolverErrors(result.errors);
          nextErrors = { ...nextErrors, ...cleaned };
          errorsRef.current = nextErrors;
          setErrors(nextErrors);
        }
      }

      const errorTotal = countFormErrors(nextErrors);
      if (errorTotal > 0) {
        setAnnounce(buildFormErrorSummaryMessage(errorTotal, labels));
        focusFirstFormInvalidField(fieldRefs.current, nextErrors);
        onSubmitError?.(nextErrors);
        return;
      }

      if (!onSubmit) return;

      try {
        setIsSubmitting(true);
        await onSubmit(submitValues);
        setAnnounce(buildFormSuccessAnnounceMessage(labels));
      } finally {
        setIsSubmitting(false);
      }
    },
    [labels, onSubmit, onSubmitError, resolver, validateForm],
  );

  const handleReset = useCallback((event: FormEvent<HTMLFormElement>) => {
    onResetRef.current?.(event);
    if (event.defaultPrevented) return;
    const initial = defaultValuesRef.current ?? {};
    if (!controlledRef.current) {
      valuesRef.current = initial;
      setInternalValues(initial);
    }
    onValuesChangeRef.current?.(initial);
    errorsRef.current = {};
    touchedRef.current = {};
    setErrors({});
    setTouchedState({});
    setSubmitCount(0);
    setAnnounce(null);
  }, []);

  const hasErrors = countFormErrors(errors) > 0;

  return {
    shellIds,
    bindingValue,
    handleSubmit,
    handleReset,
    errors,
    hasErrors,
    isSubmitting,
    announce,
  };
}
 