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
 
import { ComboBoxClassNamesProvider, ComboBoxFieldProvider, ComboBoxMotionProvider, ComboBoxProvider } from "./comboBoxContext";
import { ComboBoxError, ComboBoxHint, ComboBoxLabel, ComboBoxInput, ComboBoxInputGroup, ComboBoxPopover, ComboBoxSimpleBody, ComboBoxTrigger } from "./comboBoxParts";
import type { ComboBoxProps } from "./comboBoxTypes";
import { useComboBoxRootState } from "./useComboBoxRootState";
 
 
import { cn } from "@/utils/cn";
 
export type {
  ComboBoxProps,
  ComboBoxSimpleProps,
  ComboBoxHintProps,
  ComboBoxLabelProps,
  ComboBoxErrorProps,
  ComboBoxInputGroupProps,
  ComboBoxInputProps,
  ComboBoxTriggerProps,
  ComboBoxPopoverProps,
  ComboBoxOption,
  ComboBoxClassNames,
  ComboBoxMotion,
  ComboBoxPartMotion,
} from "./comboBoxTypes";
 
 
export function ComboBoxRoot({
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
  value,
  defaultValue,
  onValueChange,
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
}: ComboBoxProps) {
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
    status,
    size: resolvedSize,
    options,
    value,
    defaultValue,
    onValueChange,
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
            </Field>
          </FieldLabelContext.Provider>
          </ComboBoxMotionProvider>
        </ComboBoxClassNamesProvider>
      </ComboBoxProvider>
    </ComboBoxFieldProvider>
  );
}
 
ComboBoxRoot.displayName = "ComboBox";
 
export {
  ComboBoxInput,
  ComboBoxInputGroup,
  ComboBoxTrigger,
  ComboBoxPopover,
  ComboBoxLabel,
  ComboBoxHint,
  ComboBoxError,
};
 
