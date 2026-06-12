import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
  type FieldsetHTMLAttributes,
  type ReactNode,
} from "react";

import {
  OptionGroupFieldset,
  OptionGroupHeader,
  OptionGroupHint,
  OptionGroupLegend,
  OptionGroupList,
  useOptionGroupErrorId,
  useOptionGroupHintId,
  type OptionGroupHintProps,
  type OptionGroupLegendProps,
  type OptionGroupListProps,
  type OptionGroupOrientation,
} from "@/components/composite/utils/optionGroupFieldset";
import { FieldError, type FieldErrorProps } from "@/components/core/Field";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { FieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import {
  RadioGroupContext,
  useRadioGroupContext,
  type RadioGroupContextValue,
} from "./radioGroupContext";

export type RadioGroupOrientation = OptionGroupOrientation;

export type RadioGroupProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "onChange"
> & {
  isRequired?: boolean;
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  /** id для `aria-describedby`; по умолчанию генерируется автоматически. */
  hintId?: string;
  /** id ошибки для `aria-describedby`; по умолчанию генерируется автоматически. */
  errorId?: string;
  /** Шкала отступов fieldset. По умолчанию `small`. */
  size?: ComponentSize;
  children?: ReactNode;
};

export const RadioGroupRoot = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroupRoot(
  {
    isRequired = false,
    value: valueProp,
    defaultValue,
    onValueChange,
    children,
    className,
    disabled = false,
    name: nameProp,
    hintId: hintIdProp,
    errorId: errorIdProp,
    size,
    ...fieldsetProps
  },
  ref,
) {
  const autoId = useId();
  const groupName = nameProp ?? `radio-group-${autoId}`;
  const hintId = useOptionGroupHintId(hintIdProp);
  const errorId = useOptionGroupErrorId(errorIdProp);

  const controlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);

  const selectedValue = controlled
    ? valueProp == null
      ? undefined
      : String(valueProp)
    : internalValue;

  const selectValue = useCallback(
    (next: string | undefined) => {
      if (isRequired && next === undefined) return;
      if (!controlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [controlled, isRequired, onValueChange],
  );

  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({
      name: groupName,
      disabled,
      isRequired,
      hintId,
      errorId,
      selectedValue,
      selectValue,
    }),
    [disabled, errorId, hintId, groupName, isRequired, selectValue, selectedValue],
  );

  const fieldLabelCtx = useMemo(() => ({ isRequired }), [isRequired]);

  return (
    <RadioGroupContext.Provider value={contextValue}>
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
    </RadioGroupContext.Provider>
  );
});

export function RadioGroupLegend({ children, ...rest }: OptionGroupLegendProps) {
  return (
    <OptionGroupLegend {...rest}>
      <OptionGroupHeader>{children}</OptionGroupHeader>
    </OptionGroupLegend>
  );
}

export function RadioGroupHint({ id, ...rest }: OptionGroupHintProps) {
  const { hintId } = useRadioGroupContext();
  return <OptionGroupHint id={id ?? hintId} {...rest} />;
}

export function RadioGroupError({ id, ...rest }: FieldErrorProps) {
  const { errorId } = useRadioGroupContext();
  return <FieldError id={id ?? errorId} {...rest} />;
}

export const RadioGroupList = forwardRef<HTMLDivElement, OptionGroupListProps>(function RadioGroupList(
  props,
  ref,
) {
  return <OptionGroupList ref={ref} {...props} />;
});

RadioGroupRoot.displayName = "RadioGroup";
RadioGroupLegend.displayName = "RadioGroup.Legend";
RadioGroupHint.displayName = "RadioGroup.Hint";
RadioGroupError.displayName = "RadioGroup.Error";
RadioGroupList.displayName = "RadioGroup.List";

export type {
  OptionGroupHintProps as RadioGroupHintProps,
  OptionGroupLegendProps as RadioGroupLegendProps,
  OptionGroupListProps as RadioGroupListProps,
};
export type { FieldErrorProps as RadioGroupErrorProps } from "@/components/core/Field";
export type { LabelProps as RadioGroupLabelProps } from "@/components/core/Label";
