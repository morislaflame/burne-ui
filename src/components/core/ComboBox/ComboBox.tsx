import { FieldRoot } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";

import { mergeComboBoxSlotClass } from "./comboBoxAPI";
import {
  ComboBoxClassNamesProvider,
  ComboBoxFieldProvider,
  ComboBoxProvider,
} from "./comboBoxContext";
import {
  ComboBoxError,
  ComboBoxHint,
  ComboBoxInput,
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxSimpleBody,
  ComboBoxTrigger,
} from "./comboBoxParts";
import type { ComboBoxRootProps } from "./comboBoxTypes";
import { useComboBoxRootState } from "./useComboBoxRootState";

import "../utils/glossInteractive.css";

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
  isRequired,
  status,
  size,
  options,
  value,
  defaultValue,
  onValueChange,
  variant,
  disabled,
  placeholder,
  menuMaxHeight,
  ...rest
}: ComboBoxRootProps) {
  const state = useComboBoxRootState({
    children,
    label,
    hint,
    error,
    id,
    isRequired,
    status,
    size,
    options,
    value,
    defaultValue,
    onValueChange,
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
              className={mergeComboBoxSlotClass(className, classNames?.root)}
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
  ComboBoxHint,
  ComboBoxError,
};
