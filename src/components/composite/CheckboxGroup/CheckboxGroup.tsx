import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type FieldsetHTMLAttributes,
  type ReactNode,
} from "react";

import { FieldError, type FieldErrorProps } from "@/components/core/Field";
import { useFieldSetErrorId, useFieldSetHintId } from "@/components/core/Field/FieldSet";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import {
  OptionGroupFieldset,
  OptionGroupHeader,
  OptionGroupHint,
  OptionGroupLegend,
  OptionGroupList,
  type OptionGroupHintProps,
  type OptionGroupLegendProps,
  type OptionGroupListProps,
  type OptionGroupOrientation,
} from "@/components/composite/utils/optionGroupFieldset";
import { FieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import {
  CheckboxGroupContext,
  useCheckboxGroupContext,
  type CheckboxGroupContextValue,
  type CheckboxGroupSelection,
} from "./checkboxGroupContext";

export type { CheckboxGroupSelection };

export type CheckboxGroupProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "onChange"
> & {
  isRequired?: boolean;
  selection?: CheckboxGroupSelection;
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  /** id for `aria-describedby`; generated automatically by default. */
  hintId?: string;
  /** id for error in `aria-describedby`; generated automatically by default. */
  errorId?: string;
  /** Fieldset padding scale. By default `small`. */
  size?: ComponentSize;
  children?: ReactNode;
};

export const CheckboxGroupRoot = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  function CheckboxGroupRoot(
    {
      isRequired = false,
      selection = "multiple",
      value: valueProp,
      defaultValue,
      onValueChange,
      children,
      className,
      disabled = false,
      hintId: hintIdProp,
      errorId: errorIdProp,
      size,
      ...fieldsetProps
    },
    ref,
  ) {
    const hintId = useFieldSetHintId(hintIdProp);
    const errorId = useFieldSetErrorId(errorIdProp);

    const controlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);

    const selectedValue =
      selection === "single"
        ? controlled
          ? valueProp == null
            ? undefined
            : String(valueProp)
          : internalValue
        : undefined;

    const selectSingleValue = useCallback(
      (optionValue: string, checked: boolean) => {
        if (selection !== "single") return;
        const next = checked ? optionValue : undefined;
        if (!controlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [controlled, onValueChange, selection],
    );

    const contextValue = useMemo<CheckboxGroupContextValue>(
      () => ({
        selection,
        disabled,
        isRequired,
        hintId,
        errorId,
        selectedValue,
        selectSingleValue,
      }),
      [disabled, errorId, hintId, isRequired, selectSingleValue, selectedValue, selection],
    );

    const fieldLabelCtx = useMemo(() => ({ isRequired }), [isRequired]);

    return (
      <CheckboxGroupContext.Provider value={contextValue}>
        <FieldLabelContext.Provider value={fieldLabelCtx}>
          <OptionGroupFieldset
            ref={ref}
            disabled={disabled}
            isRequired={isRequired}
            hintId={hintId}
            errorId={errorId}
            size={size}
            className={className}
            {...fieldsetProps}
          >
            {children}
          </OptionGroupFieldset>
        </FieldLabelContext.Provider>
      </CheckboxGroupContext.Provider>
    );
  },
);

export function CheckboxGroupLegend({ children, ...rest }: OptionGroupLegendProps) {
  return (
    <OptionGroupLegend {...rest}>
      <OptionGroupHeader>{children}</OptionGroupHeader>
    </OptionGroupLegend>
  );
}

export function CheckboxGroupHint({ id, ...rest }: OptionGroupHintProps) {
  const { hintId } = useCheckboxGroupContext();
  return <OptionGroupHint id={id ?? hintId} {...rest} />;
}

export function CheckboxGroupError({ id, ...rest }: FieldErrorProps) {
  const { errorId } = useCheckboxGroupContext();
  return <FieldError id={id ?? errorId} {...rest} />;
}

export const CheckboxGroupList = forwardRef<HTMLDivElement, OptionGroupListProps>(
  function CheckboxGroupList(props, ref) {
    return <OptionGroupList ref={ref} {...props} />;
  },
);

CheckboxGroupRoot.displayName = "CheckboxGroup";
CheckboxGroupLegend.displayName = "CheckboxGroup.Legend";
CheckboxGroupHint.displayName = "CheckboxGroup.Hint";
CheckboxGroupError.displayName = "CheckboxGroup.Error";
CheckboxGroupList.displayName = "CheckboxGroup.List";

export type {
  OptionGroupHintProps as CheckboxGroupHintProps,
  OptionGroupLegendProps as CheckboxGroupLegendProps,
  OptionGroupListProps as CheckboxGroupListProps,
  OptionGroupOrientation as CheckboxGroupOrientation,
};
export type { FieldErrorProps as CheckboxGroupErrorProps } from "@/components/core/Field";
export type { LabelProps as CheckboxGroupLabelProps } from "@/components/core/Label";
