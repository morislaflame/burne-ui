import { forwardRef, useLayoutEffect, useRef, type MouseEvent } from "react";

import { Calendar } from "@/components/core/Calendar";
import { Field } from "@/components/core/Field";
import { Popover } from "@/components/core/Popover";
import { KitChevronDown } from "@/components/core/utils/kitIcons";
import { dataOpenState, dataFlag } from "@/components/core/utils/dataContract";
import { ariaInvalidValue, dataInvalidValue } from "@/components/core/utils/fieldInvalid";
import { focusPanelOnOpen } from "@/components/core/utils/focusElement";
import { cn } from "@/utils/cn";

import {
  datePickerSelectionComplete,
  isDatePickerRangeValue,
} from "./datePickerAPI";
import {
  useDatePickerChromeSlot,
  useDatePickerIconMotion,
  useDatePickerTriggerMotion,
} from "./datePickerAnimations";
import { useDatePickerClassNames, useDatePickerContext } from "./datePickerContext";
import {
  DATE_PICKER_ICON_CLASS,
  DATE_PICKER_POPOVER_CLASS,
  DATE_PICKER_VALUE_CLASS,
  DATE_PICKER_VALUE_MUTED_CLASS,
  datePickerIconClass,
  datePickerTriggerClass,
} from "./datePickerStyles";
import type {
  DatePickerErrorProps,
  DatePickerHintProps,
  DatePickerLabelProps,
  DatePickerPopoverProps,
  DatePickerStoredValue,
  DatePickerTriggerProps,
} from "./datePickerTypes";

export const DatePickerLabel = forwardRef<HTMLElement, DatePickerLabelProps>(
  function DatePickerLabel(
    {
      children,
      className,
      id: idProp,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const field = useDatePickerContext();
    const slotClassNames = useDatePickerClassNames();
    const part = useDatePickerChromeSlot("label", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    return (
      <Field.Label
        ref={part.setRef}
        id={idProp ?? field.labelId}
        className={cn(slotClassNames.label, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {children ?? field.label}
      </Field.Label>
    );
  },
);

DatePickerLabel.displayName = "DatePickerLabel";

export const DatePickerTrigger = forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
  function DatePickerTrigger(
    {
      children,
      className,
      motion,
      onClick,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const field = useDatePickerContext();
    const slotClassNames = useDatePickerClassNames();
    const trigger = useDatePickerTriggerMotion({
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
    const icon = useDatePickerIconMotion(field.open);
    const text = field.empty ? field.placeholder : field.display;

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || field.disabled) return;
      field.setOpen(!field.open);
    };

    return (
      // eslint-disable-next-line jsx-a11y/role-supports-aria-props -- date field button publishes invalid and required
      <button
        type="button"
        id={field.triggerId}
        ref={trigger.setRef}
        disabled={field.disabled}
        className={datePickerTriggerClass({
          size: field.size,
          variant: field.variant,
          status: field.status,
          disabled: field.disabled,
          shellHoverMotionClass: trigger.shellHoverMotionClass,
          slotClass: slotClassNames.trigger,
          className,
        })}
        onClick={handleClick}
        {...rest}
        {...trigger.pointerHandlers}
        aria-haspopup="dialog"
        aria-expanded={field.open}
        aria-controls={field.open ? field.panelId : undefined}
        aria-invalid={ariaInvalidValue(field.isInvalid)}
        aria-required={field.required || undefined}
        aria-labelledby={field.labelConnected ? field.labelId : undefined}
        aria-label={field.labelConnected ? undefined : field.placeholder}
        aria-describedby={field.describedBy}
        data-state={dataOpenState(field.open)}
        data-invalid={dataInvalidValue(field.isInvalid)}
        data-required={dataFlag(field.required)}
        data-disabled={dataFlag(field.disabled)}
      >
        {children ?? (
          <>
            <span
              className={cn(
                DATE_PICKER_VALUE_CLASS,
                field.empty && DATE_PICKER_VALUE_MUTED_CLASS,
                slotClassNames.value,
              )}
            >
              {text}
            </span>
            <span
              ref={icon.setRef}
              className={cn(datePickerIconClass(field.size), DATE_PICKER_ICON_CLASS, slotClassNames.icon)}
              aria-hidden
            >
              <KitChevronDown />
            </span>
          </>
        )}
      </button>
    );
  },
);

DatePickerTrigger.displayName = "DatePickerTrigger";

export const DatePickerPopover = forwardRef<HTMLDivElement, DatePickerPopoverProps>(
  function DatePickerPopover({ children, className, ...rest }, ref) {
    const field = useDatePickerContext();
    const slotClassNames = useDatePickerClassNames();
    const panelRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      if (!field.open) return;
      const panel = panelRef.current;
      const trigger = field.triggerRef.current;
      if (!panel || !trigger) return;
      focusPanelOnOpen(panel, { from: trigger });
    }, [field.open, field.triggerRef]);

    const commit = (next: DatePickerStoredValue) => {
      field.commit(next);
      if (datePickerSelectionComplete(next, field.mode)) field.setOpen(false);
    };

    const setPanelRef = (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <Popover.Content
        ref={setPanelRef}
        unstyled
        align="start"
        className={cn(DATE_PICKER_POPOVER_CLASS, slotClassNames.popover, className)}
        {...rest}
        id={field.panelId}
      >
        {children ??
          (field.mode === "range" ? (
            <Calendar
              mode="range"
              size={field.size}
              variant={field.variant}
              locale={field.locale}
              minDate={field.minDate}
              maxDate={field.maxDate}
              defaultMonth={field.defaultMonth}
              value={isDatePickerRangeValue(field.value) ? field.value : { start: null, end: null }}
              onValueChange={commit}
              className={slotClassNames.calendar}
            />
          ) : (
            <Calendar
              mode="single"
              size={field.size}
              variant={field.variant}
              locale={field.locale}
              minDate={field.minDate}
              maxDate={field.maxDate}
              defaultMonth={field.defaultMonth}
              value={field.value instanceof Date ? field.value : null}
              onValueChange={commit}
              className={slotClassNames.calendar}
            />
          ))}
      </Popover.Content>
    );
  },
);

DatePickerPopover.displayName = "DatePickerPopover";

export const DatePickerHint = forwardRef<HTMLElement, DatePickerHintProps>(
  function DatePickerHint(
    {
      children,
      className,
      id: idProp,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const field = useDatePickerContext();
    const slotClassNames = useDatePickerClassNames();
    const part = useDatePickerChromeSlot("hint", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    return (
      <Field.Hint
        ref={part.setRef}
        id={idProp ?? field.hintId}
        status={field.status}
        className={cn(slotClassNames.hint, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {children ?? field.hint}
      </Field.Hint>
    );
  },
);

DatePickerHint.displayName = "DatePickerHint";

export const DatePickerError = forwardRef<HTMLElement, DatePickerErrorProps>(
  function DatePickerError(
    {
      children,
      className,
      id: idProp,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const field = useDatePickerContext();
    const slotClassNames = useDatePickerClassNames();
    const part = useDatePickerChromeSlot("error", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    return (
      <Field.Error
        ref={part.setRef}
        id={idProp ?? field.errorId}
        className={cn(slotClassNames.error, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {children ?? field.error}
      </Field.Error>
    );
  },
);

DatePickerError.displayName = "DatePickerError";

export function DatePickerSimpleBody() {
  const field = useDatePickerContext();
  return (
    <>
      {field.label != null ? <DatePickerLabel /> : null}
      <DatePickerTrigger />
      <DatePickerPopover />
      {field.hint != null ? <DatePickerHint /> : null}
      {field.error != null ? <DatePickerError /> : null}
    </>
  );
}
