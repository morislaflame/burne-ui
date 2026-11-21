import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { EN_LOCALE, resolveCalendarLocale, type CalendarLocale, type CalendarRangeValue, type CalendarView } from "@/components/core/Calendar";
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import type { InputSize, InputVariant } from "@/components/core/Input";
import type { PopoverSide } from "@/components/core/Popover";
import { useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";

import { datePickerDescribedBy, datePickerFieldIds } from "./datePickerA11y";
import {
  datePickerPlaceholder,
  formatDatePickerDisplay,
  parseDatePickerFormValue,
  serializeDatePickerValue,
} from "./datePickerAPI";
import type { DatePickerMode, DatePickerStoredValue } from "./datePickerTypes";

const EMPTY_RANGE: CalendarRangeValue = { start: null, end: null };
const EMPTY_DATES: Date[] = [];

export type UseDatePickerRootStateProps = {
  children?: ReactNode;
  mode?: DatePickerMode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  size?: InputSize;
  icon?: ReactNode | null;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: DatePickerStoredValue;
  defaultValue?: DatePickerStoredValue;
  onValueChange?: (value: DatePickerStoredValue) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: InputVariant;
  locale?: string | CalendarLocale;
  minDate?: Date;
  maxDate?: Date;
  isDateUnavailable?: (date: Date) => boolean;
  defaultMonth?: Date;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  side?: PopoverSide;
};

export function useDatePickerRootState({
  children,
  mode = "single",
  label,
  hint,
  error,
  invalid,
  id,
  name,
  required = false,
  size = "base",
  icon,
  disabled = false,
  readOnly: readOnlyProp = false,
  placeholder,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  variant = "default",
  locale: localeProp = EN_LOCALE,
  minDate,
  maxDate,
  isDateUnavailable,
  defaultMonth,
  month,
  onMonthChange,
  view,
  defaultView,
  onViewChange,
  side = "bottom",
}: UseDatePickerRootStateProps) {
  const form = useOptionalFormBindingContext();
  const formBinding = useFormFieldBinding({
    name,
    value: valueProp,
    disabled,
    readOnly: readOnlyProp,
  });
  const labels = useBurneLabels();
  const reactId = useId();
  const triggerId = id ?? `date-picker-${reactId}`;
  const ids = datePickerFieldIds(triggerId);
  const isCompound = hasCompoundChildren(children);
  const formMessage = name ? form?.getError(name) : undefined;
  const resolvedError = error ?? formBinding.error ?? formMessage;
  const resolvedDisabled = Boolean(formBinding.disabled);
  const resolvedReadOnly = Boolean(formBinding.readOnly);

  const fallbackDefault =
    defaultValue ?? (mode === "range" ? EMPTY_RANGE : mode === "multiple" ? EMPTY_DATES : null);
  const explicit = valueProp !== undefined;
  const bound = formBinding.bound;
  const formParsed = useMemo(
    () => (bound ? parseDatePickerFormValue(formBinding.value, mode) : undefined),
    [bound, formBinding.value, mode],
  );
  const controlled = explicit ? valueProp : formParsed;
  const isControlled = controlled !== undefined;
  const [internalValue, setInternalValue] = useState<DatePickerStoredValue>(fallbackDefault);
  const value = isControlled ? controlled : internalValue;

  const onValueChangeRef = useRef(onValueChange);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest callback without recreating commit
  onValueChangeRef.current = onValueChange;

  const locked = resolvedDisabled || resolvedReadOnly;

  const [rawOpen, setOpenState] = useControllableState({
    value: locked ? false : openProp,
    defaultValue: locked ? false : defaultOpen,
    onChange: onOpenChange,
  });
  const open = locked ? false : rawOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      if (next && locked) return;
      setOpenState(next);
    },
    [locked, setOpenState],
  );

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const pointerInsideRef = useRef(false);

  useNativeFormReset(
    triggerRef,
    () => {
      setInternalValue(fallbackDefault);
    },
    !isControlled,
  );

  const commit = useCallback(
    (next: DatePickerStoredValue) => {
      if (locked) return;
      if (!isControlled) setInternalValue(next);
      onValueChangeRef.current?.(next);
      const serialized = serializeDatePickerValue(next, mode);
      if (bound) {
        formBinding.setValue(serialized);
      } else if (name && form) {
        form.setValue(name, serialized, {
          shouldValidate: form.validateMode === "onChange",
        });
      }
    },
    [bound, form, formBinding, isControlled, locked, mode, name],
  );

  const setFormTriggerRef = formBinding.ref as (node: HTMLButtonElement | null) => void;
  const notifyBlur = formBinding.onBlur;

  const locale = useMemo(() => resolveCalendarLocale(localeProp), [localeProp]);
  const display = formatDatePickerDisplay(value, mode, locale);
  const labelConnected = isCompound
    ? hasCompoundChild(children, "DatePickerLabel") || hasCompoundChild(children, "Label")
    : label != null;
  const hintConnected = isCompound ? hasCompoundChild(children, "DatePickerHint") : hint != null;
  const errorConnected = isCompound
    ? hasCompoundChild(children, "DatePickerError")
    : resolvedError != null;
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: resolvedError != null || errorConnected,
    formInvalid: formBinding["aria-invalid"] === true || Boolean(formMessage),
  });
  const contextValue = useMemo(
    () => ({
      mode,
      value,
      commit,
      open,
      setOpen,
      disabled: resolvedDisabled,
      readOnly: resolvedReadOnly,
      placeholder: datePickerPlaceholder(mode, placeholder, labels),
      display: display.text,
      empty: display.empty,
      size,
      icon,
      variant,
      locale,
      minDate,
      maxDate,
      isDateUnavailable,
      defaultMonth,
      month,
      onMonthChange,
      view,
      defaultView,
      onViewChange,
      side,
      triggerId,
      panelId: ids.panelId,
      labelId: ids.labelId,
      hintId: ids.hintId,
      errorId: ids.errorId,
      label,
      hint,
      error: resolvedError,
      name: formBinding.name ?? name,
      serialized: serializeDatePickerValue(value, mode),
      required,
      isInvalid,
      labelConnected,
      hintConnected,
      errorConnected,
      describedBy: datePickerDescribedBy({
        hintConnected,
        errorConnected,
        hintId: ids.hintId,
        errorId: ids.errorId,
      }),
      triggerRef,
      pointerInsideRef,
      setFormTriggerRef,
      notifyBlur,
    }),
    [
      commit,
      defaultMonth,
      defaultView,
      month,
      onMonthChange,
      onViewChange,
      view,
      display.empty,
      display.text,
      errorConnected,
      formBinding.name,
      hint,
      hintConnected,
      ids.errorId,
      ids.hintId,
      ids.labelId,
      ids.panelId,
      isInvalid,
      label,
      labelConnected,
      labels,
      locale,
      maxDate,
      isDateUnavailable,
      minDate,
      mode,
      name,
      notifyBlur,
      open,
      placeholder,
      required,
      resolvedDisabled,
      resolvedReadOnly,
      resolvedError,
      setFormTriggerRef,
      setOpen,
      icon,
      side,
      size,
      triggerId,
      value,
      variant,
    ],
  );

  return {
    isCompound,
    contextValue,
    fieldLabel: {
      controlId: triggerId,
      labelId: ids.labelId,
      required,
    },
  };
}
