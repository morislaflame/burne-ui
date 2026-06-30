import { forwardRef, type HTMLAttributes, type Ref } from "react";

import { FieldLabelContext } from "@/components/core/Label";

import { mergeCheckboxSlotClass } from "./checkboxAPI";
import { useCheckboxTextMotion } from "./checkboxAnimations";
import {
  CheckboxClassNamesProvider,
  CheckboxFieldProvider,
} from "./checkboxContext";
import {
  CheckboxContent,
  CheckboxControl,
  CheckboxError,
  CheckboxHint,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxSimpleBody,
} from "./checkboxParts";
import {
  CHECKBOX_COMPOUND_FIELDSET_CLASS,
  CHECKBOX_ROOT_DISABLED_CLASS,
  checkboxGridClass,
} from "./checkboxStyles";
import type { CheckboxRootProps } from "./checkboxTypes";
import { useCheckboxRootState } from "./useCheckboxRootState";

export type {
  CheckboxProps,
  CheckboxRootProps,
  CheckboxControlProps,
  CheckboxIndicatorProps,
  CheckboxContentProps,
  CheckboxLabelProps,
  CheckboxHintProps,
  CheckboxErrorProps,
  CheckboxSize,
  CheckboxVariant,
  CheckboxClassNames,
} from "./checkboxTypes";

export const CheckboxRoot = forwardRef<HTMLLabelElement, CheckboxRootProps>(
  function CheckboxRoot(
    {
      children,
      label,
      hint,
      error,
      size,
      variant,
      checkIcon,
      danger,
      disabled,
      checked,
      defaultChecked,
      onChange,
      id,
      name,
      value,
      required,
      form,
      autoFocus,
      tabIndex,
      readOnly,
      onBlur,
      onFocus,
      className,
      classNames,
      onPointerDown,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const state = useCheckboxRootState(
      {
        size,
        variant,
        checkIcon,
        danger,
        disabled,
        checked,
        defaultChecked,
        onChange,
        id,
        name,
        value,
        required,
        form,
        autoFocus,
        tabIndex,
        readOnly,
        onBlur,
        onFocus,
        "aria-label": ariaLabel,
        label,
        hint,
        error,
      },
      children,
      className,
    );

    const { handlePointerDown } = useCheckboxTextMotion({
      isDisabled: state.isDisabled,
      enableTextMotion: state.enableTextMotion,
      textMotionRef: state.textColRef,
      onPointerDown,
    });

    const gridClass = mergeCheckboxSlotClass(
      checkboxGridClass(state.secondaryLines, state.sz.gridGap, className),
      state.isDisabled && CHECKBOX_ROOT_DISABLED_CLASS,
      classNames?.root,
    );

    if (state.isCompound) {
      return (
        <CheckboxFieldProvider value={state.contextValue}>
          <CheckboxClassNamesProvider classNames={classNames}>
            <FieldLabelContext.Provider value={state.fieldLabelContext}>
              <fieldset
                ref={ref as Ref<HTMLFieldSetElement>}
                aria-labelledby={
                  state.contextValue.labelConnected ? state.contextValue.labelId : undefined
                }
                data-checked={state.mergedChecked ? true : undefined}
                className={mergeCheckboxSlotClass(
                  gridClass,
                  CHECKBOX_COMPOUND_FIELDSET_CLASS,
                )}
                onPointerDown={handlePointerDown}
                {...(rest as HTMLAttributes<HTMLFieldSetElement>)}
              >
                {children}
              </fieldset>
            </FieldLabelContext.Provider>
          </CheckboxClassNamesProvider>
        </CheckboxFieldProvider>
      );
    }

    return (
      <CheckboxFieldProvider value={state.contextValue}>
        <CheckboxClassNamesProvider classNames={classNames}>
          <label
            ref={ref}
            data-checked={state.mergedChecked ? true : undefined}
            className={gridClass}
            {...rest}
            onPointerDown={handlePointerDown}
          >
            <CheckboxSimpleBody
              label={state.label}
              hint={state.hint}
              error={state.error}
              hasHint={state.hasHint}
              hasError={state.hasError}
              secondaryLines={state.secondaryLines}
              textColRef={state.textColRef}
              size={state.contextValue.size}
              isDisabled={state.isDisabled}
              danger={state.danger}
              hintId={state.hintId}
              errorId={state.errorId}
            />
          </label>
        </CheckboxClassNamesProvider>
      </CheckboxFieldProvider>
    );
  },
);

CheckboxRoot.displayName = "CheckboxRoot";

export {
  CheckboxControl,
  CheckboxIndicator,
  CheckboxContent,
  CheckboxLabel,
  CheckboxHint,
  CheckboxError,
};
