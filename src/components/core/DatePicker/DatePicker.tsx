import { useMemo } from "react";

import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label/labelContext";
import { Popover } from "@/components/core/Popover";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { useSkinVariant } from "@/skins/skinContext";

import {
  resolveDatePickerMotionDefaults,
  resolveDatePickerMotionParams,
} from "./datePickerAnimations";
import {
  DatePickerClassNamesProvider,
  DatePickerMotionProvider,
  DatePickerProvider,
} from "./datePickerContext";
import { DatePickerSimpleBody } from "./datePickerParts";
import { DATE_PICKER_POPOVER_PANEL_CLASS, DATE_PICKER_ROOT_CLASS } from "./datePickerStyles";
import type { DatePickerProps, DatePickerStoredValue } from "./datePickerTypes";
import { useDatePickerRootState } from "./useDatePickerRootState";
import { cn } from "@/utils/cn";

export function DatePickerRoot(props: DatePickerProps) {
  const {
    children,
    className,
    classNames,
    label,
    hint,
    error,
    invalid,
    id,
    name,
    required,
    status,
    size = "base",
    disabled,
    placeholder,
    open,
    defaultOpen,
    onOpenChange,
    variant,
    locale,
    minDate,
    maxDate,
    defaultMonth,
    side,
    motion,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
    mode: modeProp,
    value,
    defaultValue,
    onValueChange,
    ...rest
  } = props;

  const mode = modeProp ?? "single";
  const resolvedVariant = useSkinVariant(variant);
  const state = useDatePickerRootState({
    children,
    mode,
    label,
    hint,
    error,
    invalid,
    id,
    name,
    required,
    status,
    size,
    disabled,
    placeholder,
    value,
    defaultValue,
    onValueChange: onValueChange as ((value: DatePickerStoredValue) => void) | undefined,
    open,
    defaultOpen,
    onOpenChange,
    variant: resolvedVariant,
    locale,
    minDate,
    maxDate,
    defaultMonth,
    side,
  });

  const motionDefaults = useMemo(
    () =>
      resolveDatePickerMotionDefaults({
        variant: resolvedVariant,
        disabled: state.contextValue.disabled,
      }),
    [resolvedVariant, state.contextValue.disabled],
  );
  const motionParams = useMemo(
    () =>
      resolveDatePickerMotionParams({
        variant: resolvedVariant,
        disabled: state.contextValue.disabled,
        pointerInside: state.contextValue.pointerInsideRef,
      }),
    [resolvedVariant, state.contextValue.disabled, state.contextValue.pointerInsideRef],
  );

  return (
    <DatePickerProvider value={state.contextValue}>
      <DatePickerClassNamesProvider classNames={classNames}>
        <DatePickerMotionProvider
          motion={motion}
          defaults={motionDefaults}
          params={motionParams}
          controller={motionController}
          motionState={motionState}
          motionPayload={motionPayload}
          playInitialState={playInitialState}
        >
          <FieldLabelContext.Provider value={state.fieldLabel}>
            <Field
              size={size}
              className={cn(DATE_PICKER_ROOT_CLASS, classNames?.root, className)}
              {...rest}
              {...dataVariantProps({
                size,
                variant: resolvedVariant,
                status: state.contextValue.status,
              })}
            >
              <Popover
                open={state.contextValue.open}
                onOpenChange={state.contextValue.setOpen}
                anchorRef={state.contextValue.triggerRef}
                side={state.contextValue.side}
                classNames={{ panel: DATE_PICKER_POPOVER_PANEL_CLASS }}
              >
                {state.isCompound ? children : <DatePickerSimpleBody />}
                {name ? (
                  <input type="hidden" name={name} value={state.contextValue.serialized} />
                ) : null}
              </Popover>
            </Field>
          </FieldLabelContext.Provider>
        </DatePickerMotionProvider>
      </DatePickerClassNamesProvider>
    </DatePickerProvider>
  );
}

DatePickerRoot.displayName = "DatePicker";
