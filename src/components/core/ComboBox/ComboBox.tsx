import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import {
  BUTTON_GROUP_RADIUS_BRIDGE_CLASS,
} from "@/components/composite/ButtonGroup/buttonGroupStyles";
import { useInJoinedButtonGroup } from "@/components/composite/ButtonGroup/buttonGroupContext";

import { ComboBoxClassNamesProvider, ComboBoxFieldProvider, ComboBoxProvider } from "./comboBoxContext";
import { ComboBoxError, ComboBoxHint, ComboBoxLabel, ComboBoxInput, ComboBoxInputGroup, ComboBoxPopover, ComboBoxSimpleBody, ComboBoxTrigger } from "./comboBoxParts";
import type { ComboBoxProps } from "./comboBoxTypes";
import { useComboBoxRootState } from "./useComboBoxRootState";

import "../utils/glossInteractive.css";

import { cn } from "@/utils/cn";

export type {
  ComboBoxProps,
  ComboBoxSimpleProps,
  ComboBoxHintProps,
  ComboBoxErrorProps,
  ComboBoxInputGroupProps,
  ComboBoxInputProps,
  ComboBoxTriggerProps,
  ComboBoxPopoverProps,
  ComboBoxOption,
  ComboBoxClassNames,
} from "./comboBoxTypes";


export function ComboBoxRoot({
  children,
  label,
  hint,
  error,
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
  name,
  ...rest
}: ComboBoxProps) {
  const formCtx = useOptionalFormBindingContext();
  const fieldName = typeof name === "string" ? name : undefined;
  const formError = fieldName ? formCtx?.getError(fieldName) : undefined;
  const resolvedError = error ?? formError;
  const resolvedStatus = status === "default" && formError ? "danger" : status;
  const resolvedSize = size ?? "base";
  const inJoinedButtonGroup = useInJoinedButtonGroup();

  const state = useComboBoxRootState({
    children,
    label,
    hint,
    error: resolvedError,
    id,
    name,
    required,
    status: resolvedStatus,
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
  });

  return (
    <ComboBoxFieldProvider value={state.fieldCtx}>
      <ComboBoxProvider value={state.comboCtx}>
        <ComboBoxClassNamesProvider classNames={classNames}>
          <FieldLabelContext.Provider value={state.fieldLabelCtx}>
            <Field
              className={cn(
                inJoinedButtonGroup && BUTTON_GROUP_RADIUS_BRIDGE_CLASS,
                className,
                classNames?.root,
              )}
              {...rest}
            >
              {state.isCompound ? (
                children
              ) : (
                <ComboBoxSimpleBody
                  label={state.label}
                  hint={state.hint}
                  error={state.error}
                  labelId={state.fieldCtx.labelId}
                />
              )}
            </Field>
          </FieldLabelContext.Provider>
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
