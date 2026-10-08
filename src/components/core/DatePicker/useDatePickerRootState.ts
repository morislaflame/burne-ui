import { useCallback, useId, useMemo, useRef } from "react";
import type { ReactNode } from "react";

import { EN_LOCALE, resolveCalendarLocale, type CalendarLocale, type CalendarRangeValue } from "@/components/core/Calendar";
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import type { PopoverSide } from "@/components/core/Popover";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useResolvedFieldInvalid, visualStatusForInvalid } from "@/components/core/utils/fieldInvalid";

import { datePickerDescribedBy, datePickerFieldIds } from "./datePickerA11y";
import {
  datePickerPlaceholder,
  formatDatePickerDisplay,
  serializeDatePickerValue,
} from "./datePickerAPI";
import type { DatePickerMode, DatePickerStoredValue } from "./datePickerTypes";

const EMPTY_RANGE: CalendarRangeValue = { start: null, end: null };

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
  status?: InputStatus;
  size?: InputSize;
  disabled?: boolean;
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
  defaultMonth?: Date;
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
  status = "default",
  size = "base",
  disabled = false,
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
  defaultMonth,
  side = "bottom",
}: UseDatePickerRootStateProps) {
  const form = useOptionalFormBindingContext();
  const reactId = useId();
  const triggerId = id ?? `date-picker-${reactId}`;
  const ids = datePickerFieldIds(triggerId);
  const isCompound = hasCompoundChildren(children);
  const formMessage = name ? form?.getError(name) : undefined;
  const resolvedError = error ?? formMessage;
  const formDisabled = form?.disabled === true;
  const resolvedDisabled = disabled || formDisabled;

  const [value, setStoredValue] = useControllableState<DatePickerStoredValue>({
    value: valueProp,
    defaultValue: defaultValue ?? (mode === "range" ? EMPTY_RANGE : null),
    onChange: onValueChange,
  });

  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const pointerInsideRef = useRef(false);

  const commit = useCallback(
    (next: DatePickerStoredValue) => {
      setStoredValue(next);
      if (name) form?.setValue(name, serializeDatePickerValue(next, mode));
    },
    [form, mode, name, setStoredValue],
  );

  const locale = useMemo(() => resolveCalendarLocale(localeProp), [localeProp]);
  const display = formatDatePickerDisplay(value, mode, locale);
  const labelConnected = isCompound ? hasCompoundChild(children, "DatePickerLabel") : label != null;
  const hintConnected = isCompound ? hasCompoundChild(children, "DatePickerHint") : hint != null;
  const errorConnected = isCompound
    ? hasCompoundChild(children, "DatePickerError")
    : resolvedError != null;
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: resolvedError != null || errorConnected,
    formInvalid: false,
  });
  const paintedStatus = visualStatusForInvalid(status, isInvalid, "default");

  const contextValue = useMemo(
    () => ({
      mode,
      value,
      commit,
      open,
      setOpen,
      disabled: resolvedDisabled,
      placeholder: datePickerPlaceholder(mode, placeholder),
      display: display.text,
      empty: display.empty,
      size,
      variant,
      status: paintedStatus,
      locale,
      minDate,
      maxDate,
      defaultMonth,
      side,
      triggerId,
      panelId: ids.panelId,
      labelId: ids.labelId,
      hintId: ids.hintId,
      errorId: ids.errorId,
      label,
      hint,
      error: resolvedError,
      name,
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
    }),
    [
      commit,
      defaultMonth,
      display.empty,
      display.text,
      errorConnected,
      hint,
      hintConnected,
      ids.errorId,
      ids.hintId,
      ids.labelId,
      ids.panelId,
      isInvalid,
      label,
      labelConnected,
      locale,
      maxDate,
      minDate,
      mode,
      name,
      open,
      paintedStatus,
      placeholder,
      required,
      resolvedDisabled,
      resolvedError,
      setOpen,
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
