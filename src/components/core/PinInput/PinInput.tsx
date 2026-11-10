import { forwardRef, useMemo, useRef, type ForwardedRef } from "react";

import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label/labelContext";
import { dataFlag, dataVariantProps } from "@/components/core/utils/dataContract";
import { dataInvalidValue } from "@/components/core/utils/fieldInvalid";
import { useFieldControlFocus } from "@/components/core/utils/fieldFormDom";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { useSkinVariant } from "@/skins/skinContext";
import { cn } from "@/utils/cn";

import {
  resolvePinInputMotionDefaults,
  resolvePinInputMotionParams,
} from "./pinInputAnimations";
import {
  PinInputClassNamesProvider,
  PinInputMotionProvider,
  PinInputProvider,
} from "./pinInputContext";
import { PinInputCompoundBody, PinInputSimpleBody } from "./pinInputParts";
import { PIN_INPUT_ROOT_CLASS } from "./pinInputStyles";
import type { PinInputProps } from "./pinInputTypes";
import { usePinInputRootState } from "./usePinInputRootState";

export const PinInputRoot = forwardRef(function PinInputRoot({
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
  onComplete,
  variant,
  length,
  charset,
  mask,
  separator,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  autoFocus,
  tabIndex,
  ...rest
}: PinInputProps, ref: ForwardedRef<HTMLDivElement>) {
  const focusRef = useRef<HTMLDivElement>(null);
  useFieldControlFocus(focusRef, autoFocus, tabIndex);
  const resolvedVariant = useSkinVariant(variant);
  const state = usePinInputRootState({
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
    onComplete,
    variant: resolvedVariant,
    length,
    type: charset,
    mask,
    separator,
  });

  const motionDefaults = useMemo(
    () =>
      resolvePinInputMotionDefaults({
        variant: resolvedVariant,
        disabled: state.contextValue.disabled,
      }),
    [resolvedVariant, state.contextValue.disabled],
  );
  const motionParams = useMemo(
    () =>
      resolvePinInputMotionParams({
        variant: resolvedVariant,
        disabled: state.contextValue.disabled,
      }),
    [resolvedVariant, state.contextValue.disabled],
  );

  return (
    <PinInputProvider value={state.contextValue}>
      <PinInputClassNamesProvider classNames={classNames}>
        <PinInputMotionProvider
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
              className={cn(PIN_INPUT_ROOT_CLASS, classNames?.root, className)}
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
                <PinInputCompoundBody>{children}</PinInputCompoundBody>
              ) : (
                <PinInputSimpleBody />
              )}
            </Field>
          </FieldLabelContext.Provider>
        </PinInputMotionProvider>
      </PinInputClassNamesProvider>
    </PinInputProvider>
  );
});

PinInputRoot.displayName = "PinInput";
