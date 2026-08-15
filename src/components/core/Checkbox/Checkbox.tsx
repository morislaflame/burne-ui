import { forwardRef, type HTMLAttributes, type KeyboardEvent, type Ref } from "react";

import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import { FieldLabelContext } from "@/components/core/Label";

import { useCheckboxTextMotion } from "./checkboxAnimations";
import { CheckboxClassNamesProvider, CheckboxFieldProvider, CheckboxMotionProvider } from "./checkboxContext";
import { CheckboxContent, CheckboxControl, CheckboxError, CheckboxHint, CheckboxIndicator, CheckboxLabel, CheckboxSimpleBody } from "./checkboxParts";
import { CHECKBOX_COMPOUND_FIELDSET_CLASS, CHECKBOX_ROOT_DISABLED_CLASS, checkboxGridClass } from "./checkboxStyles";
import type { CheckboxProps } from "./checkboxTypes";
import { useCheckboxRootState } from "./useCheckboxRootState";

import { cn } from "@/utils/cn";

export type {
  CheckboxProps,
  CheckboxControlProps,
  CheckboxIndicatorProps,
  CheckboxContentProps,
  CheckboxLabelProps,
  CheckboxHintProps,
  CheckboxErrorProps,
  CheckboxSize,
  CheckboxVariant,
  CheckboxClassNames,
  CheckboxMotion,
  CheckboxCheckMotion,
} from "./checkboxTypes";

export const CheckboxRoot = forwardRef<HTMLLabelElement, CheckboxProps>(
  function CheckboxRoot(
    {
      children,
      label,
      hint,
      error,
      size,
      variant,
      status,
      icon,
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
      motion,
      onPointerDown,
      onKeyDown,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const formCtx = useOptionalFormBindingContext();
    const fieldName = typeof name === "string" ? name : undefined;
    const formError = fieldName ? formCtx?.getError(fieldName) : undefined;
    const resolvedError = error ?? formError;
    const resolvedStatus = formError ? "danger" : (status ?? "default");

    const state = useCheckboxRootState(
      {
        size,
        variant,
        status: resolvedStatus,
        icon,
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
        error: resolvedError,
      },
      children,
      className,
    );

    const { handlePointerDown, handleKeyDown } = useCheckboxTextMotion({
      isDisabled: state.isDisabled,
      enableTextMotion: state.enableTextMotion,
      textMotionRef: state.textColRef,
      onPointerDown,
      onKeyDown: onKeyDown as ((e: KeyboardEvent<HTMLElement>) => void) | undefined,
    });

    const gridClass = cn(
      checkboxGridClass(state.secondaryLines, state.sz.gridGap, className),
      state.isDisabled && CHECKBOX_ROOT_DISABLED_CLASS,
      classNames?.root,
    );

    if (state.isCompound) {
      return (
        <CheckboxFieldProvider value={state.contextValue}>
          <CheckboxClassNamesProvider classNames={classNames}>
            <CheckboxMotionProvider motion={motion}>
            <FieldLabelContext.Provider value={state.fieldLabelContext}>
              <fieldset
                ref={ref as Ref<HTMLFieldSetElement>}
                aria-labelledby={
                  state.contextValue.labelConnected ? state.contextValue.labelId : undefined
                }
                data-checked={state.mergedChecked ? true : undefined}
                className={cn(
                  gridClass,
                  CHECKBOX_COMPOUND_FIELDSET_CLASS,
                )}
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
                {...(rest as HTMLAttributes<HTMLFieldSetElement>)}
              >
                {children}
              </fieldset>
            </FieldLabelContext.Provider>
            </CheckboxMotionProvider>
          </CheckboxClassNamesProvider>
        </CheckboxFieldProvider>
      );
    }

    return (
      <CheckboxFieldProvider value={state.contextValue}>
        <CheckboxClassNamesProvider classNames={classNames}>
          <CheckboxMotionProvider motion={motion}>
          <label
            ref={ref}
            htmlFor={state.contextValue.inputId}
            data-checked={state.mergedChecked ? true : undefined}
            className={gridClass}
            {...rest}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
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
              status={state.isDanger}
              hintId={state.hintId}
              errorId={state.errorId}
            />
          </label>
          </CheckboxMotionProvider>
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
