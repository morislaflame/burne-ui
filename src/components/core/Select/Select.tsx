import { dataVariantProps } from "@/components/core/utils/dataContract";
import { useResolvedFieldInvalid, visualStatusForInvalid } from "@/components/core/utils/fieldInvalid";
import { useSkinVariant } from "@/skins/skinContext";
import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import {
  BUTTON_GROUP_RADIUS_BRIDGE_CLASS,
} from "@/components/composite/ButtonGroup/buttonGroupStyles";
import { useInJoinedButtonGroup } from "@/components/composite/ButtonGroup/buttonGroupContext";
 
import { SelectClassNamesProvider, SelectFieldProvider, SelectMotionProvider, SelectProvider } from "./selectContext";
import { SelectError, SelectHint, SelectLabel, SelectPopover, SelectSimpleBody, SelectTrigger, SelectTriggerGroup, SelectValue } from "./selectParts";
import type { SelectProps } from "./selectTypes";
import { useSelectRootState } from "./useSelectRootState";
 
 
import { cn } from "@/utils/cn";
 
export type {
  SelectProps,
  SelectSimpleProps,
  SelectHintProps,
  SelectLabelProps,
  SelectErrorProps,
  SelectTriggerGroupProps,
  SelectValueProps,
  SelectTriggerProps,
  SelectPopoverProps,
  SelectOption,
  SelectClassNames,
  SelectMotion,
  SelectPartMotion,
} from "./selectTypes";
 
 
export function SelectRoot({
  children,
  label,
  hint,
  error,
  invalid,
  className,
  classNames,
  id,
  required,
  status,
  size,
  options,
  multiple,
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
  placeholder,
  menuMaxHeight,
  virtualized,
  virtualItemSize,
  name,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}: SelectProps) {
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
    status,
    size: resolvedSize,
    options,
    multiple,
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
    placeholder,
    menuMaxHeight,
    virtualized,
    virtualItemSize,
  });
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: resolvedError != null,
    formInvalid: state.fieldCtx.formInvalid,
  });
  const paintedStatus = visualStatusForInvalid(status, isInvalid, "default");
 
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
                className,
                classNames?.root,
              )}
              {...rest}
              {...dataVariantProps({
                size: resolvedSize,
                variant: resolvedVariant,
                status: paintedStatus,
              })}
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
            </Field>
          </FieldLabelContext.Provider>
          </SelectMotionProvider>
        </SelectClassNamesProvider>
      </SelectProvider>
    </SelectFieldProvider>
  );
}
 
SelectRoot.displayName = "Select";
 
export {
  SelectTriggerGroup,
  SelectValue,
  SelectTrigger,
  SelectPopover,
  SelectLabel,
  SelectHint,
  SelectError,
};
 
