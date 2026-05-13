import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type FieldsetHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import { Checkbox, type CheckboxProps } from "@/components/core/Checkbox";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

/** Режим выбора в группе: несколько галочек или только один вариант (остальные снимаются). */
export type CheckboxGroupSelection = "multiple" | "single";

export type CheckboxGroupProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children" | "onChange"
> & {
  /** Заголовок над списком чекбоксов (`<legend>`). */
  title: ReactNode;
  /** Подзаголовок под заголовком. */
  description?: ReactNode;
  /** Красная звездочка справа от заголовка. */
  isRequired?: boolean;
  /**
   * `single` — только один отмеченный пункт; при выборе другого предыдущий снимается.
   * У каждого дочернего `Checkbox` должен быть уникальный строковый `value` (или задаётся индекс).
   */
  selection?: CheckboxGroupSelection;
  /**
   * Выбранное значение при `selection="single"` (контролируемый режим).
   * `null` — ни один пункт не выбран. Если проп не передан, группа неконтролируемая (`defaultValue`).
   */
  value?: string | null;
  /** Начальное значение при `selection="single"` без `value`. */
  defaultValue?: string;
  /** Смена выбранного значения в режиме `single`. */
  onValueChange?: (value: string | undefined) => void;
  children?: ReactNode;
};

function mapSingleSelectionChildren(
  children: ReactNode,
  selectedValue: string | undefined,
  onOptionChange: (optionValue: string, e: ChangeEvent<HTMLInputElement>) => void,
): ReactNode {
  const array = Children.toArray(children);
  return array.map((child, index) => {
    if (!isValidElement(child)) return child;
    if (child.type !== Checkbox) return child;

    const props = child.props as CheckboxProps;
    const optionValue =
      props.value !== undefined && props.value !== null
        ? String(props.value)
        : `__checkbox_group_${index}`;
    const checked = selectedValue !== undefined && selectedValue === optionValue;

    return cloneElement(child as ReactElement<CheckboxProps>, {
      checked,
      defaultChecked: undefined,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        props.onChange?.(e);
        if (e.defaultPrevented) return;
        onOptionChange(optionValue, e);
      },
    });
  });
}

export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  function CheckboxGroup(
    {
      title,
      description,
      isRequired = false,
      selection = "multiple",
      value: valueProp,
      defaultValue,
      onValueChange,
      children,
      className,
      disabled,
      ...fieldsetProps
    },
    ref,
  ) {
    const descriptionId = `${useId()}-desc`;
    const hasDescription = description != null;

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

    const setSelectedValue = useCallback(
      (next: string | undefined) => {
        if (selection !== "single") return;
        if (!controlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [controlled, onValueChange, selection],
    );

    const handleOptionChange = useCallback(
      (optionValue: string, e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
          setSelectedValue(optionValue);
        } else {
          setSelectedValue(undefined);
        }
      },
      [setSelectedValue],
    );

    const body = useMemo(() => {
      if (selection !== "single") return children;
      return mapSingleSelectionChildren(children, selectedValue, handleOptionChange);
    }, [children, handleOptionChange, selectedValue, selection]);

    return (
      <fieldset
        ref={ref}
        disabled={disabled}
        aria-required={isRequired || undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className={cn(
          "m-0 min-w-0 border-0 p-0 text-left disabled:pointer-events-none disabled:opacity-55",
          className,
        )}
        {...fieldsetProps}
      >
        <legend className="m-0 block w-full max-w-full border-0 p-0 pb-plus">
          <span className="flex flex-col">
            <span className="inline-flex flex-wrap items-baseline gap-x-xsmall gap-y-0">
              <Text as="span" variant="base" className="font-medium leading-snug">
                {title}
              </Text>
              {isRequired ? (
                <span className="text-danger leading-none" aria-hidden>
                  *
                </span>
              ) : null}
            </span>
            {hasDescription ? (
              <Text
                as="span"
                id={descriptionId}
                variant="small"
                className="leading-snug text-muted"
              >
                {description}
              </Text>
            ) : null}
          </span>
        </legend>
        <div className="flex flex-col gap-mid text-left">{body}</div>
      </fieldset>
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";
