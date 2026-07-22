import { FieldRoot } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";

import { SelectClassNamesProvider, SelectFieldProvider, SelectProvider } from "./selectContext";
import { SelectError, SelectHint, SelectLabel, SelectPopover, SelectSimpleBody, SelectTrigger, SelectTriggerGroup, SelectValue } from "./selectParts";
import type { SelectProps } from "./selectTypes";
import { useSelectRootState } from "./useSelectRootState";

import "../utils/glossInteractive.css";

import { cn } from "@/utils/cn";

export type {
  SelectProps,
  SelectSimpleProps,
  SelectHintProps,
  SelectErrorProps,
  SelectTriggerGroupProps,
  SelectValueProps,
  SelectTriggerProps,
  SelectPopoverProps,
  SelectOption,
  SelectClassNames,
} from "./selectTypes";


export function SelectRoot({
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
}: SelectProps) {
  const formCtx = useOptionalFormBindingContext();
  const fieldName = typeof name === "string" ? name : undefined;
  const formError = fieldName ? formCtx?.getError(fieldName) : undefined;
  const resolvedError = error ?? formError;
  const resolvedStatus = status === "default" && formError ? "danger" : status;
  const resolvedSize = size ?? formCtx?.size ?? "base";

  const state = useSelectRootState({
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
    <SelectFieldProvider value={state.fieldCtx}>
      <SelectProvider value={state.selectCtx}>
        <SelectClassNamesProvider classNames={classNames}>
          <FieldLabelContext.Provider value={state.fieldLabelCtx}>
            <FieldRoot
              className={cn(className, classNames?.root)}
              {...rest}
            >
              {state.isCompound ? (
                children
              ) : (
                <SelectSimpleBody
                  label={state.label}
                  hint={state.hint}
                  error={state.error}
                  labelId={state.fieldCtx.labelId}
                />
              )}
            </FieldRoot>
          </FieldLabelContext.Provider>
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
