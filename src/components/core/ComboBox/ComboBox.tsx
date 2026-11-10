import { forwardRef, useRef, type ForwardedRef } from "react";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { FieldHiddenValues, readOnlyData, useFieldControlFocus } from "@/components/core/utils/fieldFormDom";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { useSkinVariant } from "@/skins/skinContext";
import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import {
  BUTTON_GROUP_RADIUS_BRIDGE_CLASS,
} from "@/components/composite/ButtonGroup/buttonGroupStyles";
import { useInJoinedButtonGroup } from "@/components/composite/ButtonGroup/buttonGroupContext";
 
import { ComboBoxClassNamesProvider, ComboBoxFieldProvider, ComboBoxMotionProvider, ComboBoxProvider } from "./comboBoxContext";
import { ComboBoxError, ComboBoxHint, ComboBoxLabel, ComboBoxInput, ComboBoxShell, ComboBoxPopover, ComboBoxSimpleBody, ComboBoxTrigger } from "./comboBoxParts";
import type { ComboBoxProps } from "./comboBoxTypes";
import { useComboBoxRootState } from "./useComboBoxRootState";
 
 
import { cn } from "@/utils/cn";
 
export type {
  ComboBoxProps,
  ComboBoxSimpleProps,
  ComboBoxHintProps,
  ComboBoxLabelProps,
  ComboBoxErrorProps,
  ComboBoxShellProps,
  ComboBoxInputProps,
  ComboBoxTriggerProps,
  ComboBoxPopoverProps,
  ComboBoxItem,
  ComboBoxClassNames,
  ComboBoxMotion,
  ComboBoxPartMotion,
} from "./comboBoxTypes";
 
 
export const ComboBoxRoot = forwardRef(function ComboBoxRoot({
  children,
  label,
  hint,
  error,
  invalid,
  className,
  classNames,
  id,
  required,
  size,
  items,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  variant,
  disabled,
  readOnly,
  autoFocus,
  tabIndex,
  placeholder,
  inputValue,
  defaultInputValue,
  onInputValueChange,
  menuMaxHeight,
  portalContainer,
  virtualized,
  virtualItemSize,
  filter,
  allowsCustomValue,
  loading,
  name,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}: ComboBoxProps, ref: ForwardedRef<HTMLDivElement>) {
  const formCtx = useOptionalFormBindingContext();
  const fieldName = typeof name === "string" ? name : undefined;
  const formError = fieldName ? formCtx?.getError(fieldName) : undefined;
  const resolvedError = error ?? formError;
  const resolvedSize = size ?? "base";
  const resolvedVariant = useSkinVariant(variant);
  const inJoinedButtonGroup = useInJoinedButtonGroup();
 
  const state = useComboBoxRootState({
    children,
    label,
    hint,
    error: resolvedError,
    invalid,
    id,
    name,
    required,
    size: resolvedSize,
    items,
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    variant,
    disabled,
    readOnly,
    placeholder,
    inputValue,
    defaultInputValue,
    onInputValueChange,
    menuMaxHeight,
    portalContainer,
    virtualized,
    virtualItemSize,
    filter,
    allowsCustomValue,
    loading,
  });
  const focusRef = useRef<HTMLDivElement>(null);
  useFieldControlFocus(focusRef, autoFocus, tabIndex);
  return (
    <ComboBoxFieldProvider value={state.fieldCtx}>
      <ComboBoxProvider value={state.comboCtx}>
        <ComboBoxClassNamesProvider classNames={classNames}>
          <ComboBoxMotionProvider
            motion={motion}
            controller={state.isCompound ? motionController : undefined}
          motionState={motionState}
          motionPayload={motionPayload}
          playInitialState={playInitialState}
          >
          <FieldLabelContext.Provider value={state.fieldLabelCtx}>
            <Field
              size={resolvedSize}
              className={cn(
                inJoinedButtonGroup && BUTTON_GROUP_RADIUS_BRIDGE_CLASS,
                classNames?.root,
                className,
              )}
              {...rest}
              ref={mergeRefs(ref, focusRef)}
              {...dataVariantProps({
                size: resolvedSize,
                variant: resolvedVariant,
              })}
              data-readonly={readOnlyData(state.readOnly)}
            >
              {state.isCompound ? (
                children
              ) : (
                <ComboBoxSimpleBody
                  label={state.label}
                  hint={state.hint}
                  error={state.error}
                  labelId={state.fieldCtx.labelId}
                  motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState}
                />
              )}
              <FieldHiddenValues name={name} value={state.comboCtx.value} />
            </Field>
          </FieldLabelContext.Provider>
          </ComboBoxMotionProvider>
        </ComboBoxClassNamesProvider>
      </ComboBoxProvider>
    </ComboBoxFieldProvider>
  );
});
 
ComboBoxRoot.displayName = "ComboBox";
 
export {
  ComboBoxInput,
  ComboBoxShell,
  ComboBoxTrigger,
  ComboBoxPopover,
  ComboBoxLabel,
  ComboBoxHint,
  ComboBoxError,
};
 
