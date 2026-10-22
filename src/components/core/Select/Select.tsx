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
 
import { SelectClassNamesProvider, SelectFieldProvider, SelectMotionProvider, SelectProvider } from "./selectContext";
import { SelectError, SelectHint, SelectLabel, SelectPopover, SelectSimpleBody, SelectTrigger, SelectShell, SelectValue } from "./selectParts";
import type { SelectProps } from "./selectTypes";
import { useSelectRootState } from "./useSelectRootState";
 
 
import { cn } from "@/utils/cn";
 
export type {
  SelectProps,
  SelectSimpleProps,
  SelectHintProps,
  SelectLabelProps,
  SelectErrorProps,
  SelectShellProps,
  SelectValueProps,
  SelectTriggerProps,
  SelectPopoverProps,
  SelectItem,
  SelectClassNames,
  SelectMotion,
  SelectPartMotion,
} from "./selectTypes";
 
 
export const SelectRoot = forwardRef(function SelectRoot({
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
  icon,
  selectionMode,
  value,
  defaultValue,
  onValueChange,
  values,
  defaultValues,
  onValuesChange,
  open,
  defaultOpen,
  onOpenChange,
  variant,
  disabled,
  readOnly,
  autoFocus,
  tabIndex,
  placeholder,
  menuMaxHeight,
  virtualized,
  virtualItemSize,
  clearable,
  portalContainer,
  name,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}: SelectProps, ref: ForwardedRef<HTMLDivElement>) {
  const formCtx = useOptionalFormBindingContext();
  const fieldName = typeof name === "string" ? name : undefined;
  const formError = fieldName ? formCtx?.getError(fieldName) : undefined;
  const resolvedError = error ?? formError;
  const resolvedSize = size ?? "base";
  const resolvedVariant = useSkinVariant(variant);
  const inJoinedButtonGroup = useInJoinedButtonGroup();
 
  const state = useSelectRootState({
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
    icon,
    selectionMode,
    value,
    defaultValue,
    onValueChange,
    values,
    defaultValues,
    onValuesChange,
    open,
    defaultOpen,
    onOpenChange,
    variant,
    disabled,
    readOnly,
    placeholder,
    menuMaxHeight,
    virtualized,
    virtualItemSize,
    clearable,
    portalContainer,
  });
  const focusRef = useRef<HTMLDivElement>(null);
  useFieldControlFocus(focusRef, autoFocus, tabIndex);
  return (
    <SelectFieldProvider value={state.fieldCtx}>
      <SelectProvider value={state.selectCtx}>
        <SelectClassNamesProvider classNames={classNames}>
          <SelectMotionProvider
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
                <SelectSimpleBody
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
              <FieldHiddenValues
                name={name}
                value={state.selectCtx.multiple ? state.selectCtx.values : state.selectCtx.value}
              />
            </Field>
          </FieldLabelContext.Provider>
          </SelectMotionProvider>
        </SelectClassNamesProvider>
      </SelectProvider>
    </SelectFieldProvider>
  );
});
 
SelectRoot.displayName = "Select";
 
export {
  SelectShell,
  SelectValue,
  SelectTrigger,
  SelectPopover,
  SelectLabel,
  SelectHint,
  SelectError,
};
 
