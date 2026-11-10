import { forwardRef, useMemo, useRef, type ForwardedRef } from "react";

import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label/labelContext";
import { dataFlag } from "@/components/core/utils/dataContract";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { dataInvalidValue } from "@/components/core/utils/fieldInvalid";
import { useFieldControlFocus } from "@/components/core/utils/fieldFormDom";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { useSkinVariant } from "@/skins/skinContext";
import { cn } from "@/utils/cn";

import {
  resolveNumberInputMotionDefaults,
  resolveNumberInputMotionParams,
} from "./numberInputAnimations";
import {
  NumberInputClassNamesProvider,
  NumberInputMotionProvider,
  NumberInputProvider,
} from "./numberInputContext";
import { NumberInputCompoundBody, NumberInputSimpleBody } from "./numberInputParts";
import { NUMBER_INPUT_ROOT_CLASS } from "./numberInputStyles";
import type { NumberInputProps } from "./numberInputTypes";
import { useNumberInputRootState } from "./useNumberInputRootState";

export const NumberInputRoot = forwardRef(function NumberInputRoot({
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
  size = "base",
  disabled,
  readOnly,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  variant,
  min,
  max,
  step,
  formatOptions,
  locale,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  autoFocus,
  tabIndex,
  ...rest
}: NumberInputProps, ref: ForwardedRef<HTMLDivElement>) {
  const focusRef = useRef<HTMLDivElement>(null);
  useFieldControlFocus(focusRef, autoFocus, tabIndex);
  const resolvedVariant = useSkinVariant(variant);
  const state = useNumberInputRootState({
    children,
    label,
    hint,
    error,
    invalid,
    id,
    name,
    required,
    size,
    disabled,
    readOnly,
    placeholder,
    value,
    defaultValue,
    onValueChange,
    variant: resolvedVariant,
    min,
    max,
    step,
    formatOptions,
    locale,
  });

  const motionDefaults = useMemo(
    () =>
      resolveNumberInputMotionDefaults({
        variant: resolvedVariant,
        disabled: state.contextValue.disabled,
      }),
    [resolvedVariant, state.contextValue.disabled],
  );
  const motionParams = useMemo(
    () =>
      resolveNumberInputMotionParams({
        variant: resolvedVariant,
        disabled: state.contextValue.disabled,
        pointerInside: state.contextValue.pointerInsideRef,
      }),
    [resolvedVariant, state.contextValue.disabled, state.contextValue.pointerInsideRef],
  );

  return (
    <NumberInputProvider value={state.contextValue}>
      <NumberInputClassNamesProvider classNames={classNames}>
        <NumberInputMotionProvider
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
              className={cn(NUMBER_INPUT_ROOT_CLASS, classNames?.root, className)}
              {...rest}
              ref={mergeRefs(ref, focusRef)}
              {...dataVariantProps({
                size,
                variant: resolvedVariant,
              })}
              data-invalid={dataInvalidValue(state.contextValue.isInvalid)}
              data-disabled={dataFlag(state.contextValue.disabled)}
              data-readonly={dataFlag(state.contextValue.readOnly)}
              data-required={dataFlag(state.contextValue.required)}
            >
              {state.isCompound ? (
                <NumberInputCompoundBody>{children}</NumberInputCompoundBody>
              ) : (
                <NumberInputSimpleBody />
              )}
            </Field>
          </FieldLabelContext.Provider>
        </NumberInputMotionProvider>
      </NumberInputClassNamesProvider>
    </NumberInputProvider>
  );
});

NumberInputRoot.displayName = "NumberInput";
