import { FieldRoot } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";

import { ComboBoxClassNamesProvider, ComboBoxFieldProvider, ComboBoxProvider } from "./comboBoxContext";
import { ComboBoxError, ComboBoxHint, ComboBoxLabel, ComboBoxInput, ComboBoxInputGroup, ComboBoxPopover, ComboBoxSimpleBody, ComboBoxTrigger } from "./comboBoxParts";
import type { ComboBoxRootProps } from "./comboBoxTypes";
import { useComboBoxRootState } from "./useComboBoxRootState";

import "../utils/glossInteractive.css";

import { cn } from "@/utils/cn";

export type {
  ComboBoxRootProps,
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

export type ComboBoxProps = ComboBoxRootProps;

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
}: ComboBoxRootProps) {
  const formCtx = useOptionalFormBindingContext();
  const fieldName = typeof name === "string" ? name : undefined;
  const formError = fieldName ? formCtx?.getError(fieldName) : undefined;
  const resolvedError = error ?? formError;
  const resolvedStatus = status === "default" && formError ? "danger" : status;
  const resolvedSize = size ?? formCtx?.size ?? "base";

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
            <FieldRoot
              className={cn(className, classNames?.root)}
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
            </FieldRoot>
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
