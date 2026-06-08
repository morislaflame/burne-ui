import {
  Children,
  Fragment,
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { ToggleButton } from "@/components/core/ToggleButton";
import { ButtonGroupSegmentContext } from "@/components/core/utils/buttonGroupContext";
import type { ButtonGroupSegment } from "@/components/core/utils/buttonGroupSegment";
import { cn } from "@/utils/cn";

import {
  ToggleButtonGroupContext,
  type ToggleButtonGroupOrientation,
  type ToggleButtonGroupType,
} from "@/components/core/ToggleButton/toggleButtonGroupContext";
import type { ToggleButtonSize, ToggleButtonVariant } from "@/components/core/ToggleButton/ToggleButton";

function ToggleButtonGroupSegmentProvider({
  segment,
  buttonSize,
  children,
}: {
  segment: ButtonGroupSegment;
  buttonSize: ToggleButtonSize;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ segment, buttonSize }),
    [buttonSize, segment],
  );
  return (
    <ButtonGroupSegmentContext.Provider value={value}>{children}</ButtonGroupSegmentContext.Provider>
  );
}

function flattenFragmentChildren(children: ReactNode): ReactElement[] {
  const out: ReactElement[] = [];
  Children.forEach(children, (node) => {
    if (!isValidElement(node)) return;
    if (node.type === Fragment) {
      const { children: fragKids } = node.props as { children?: ReactNode };
      out.push(...flattenFragmentChildren(fragKids));
      return;
    }
    out.push(node);
  });
  return out;
}

function isToggleButtonChild(child: ReactElement): boolean {
  return child.type === ToggleButton;
}

function collectToggleButtons(root: HTMLElement): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll('[data-toggle-button-value]:not([disabled])')).filter(
    (el): el is HTMLButtonElement => el instanceof HTMLButtonElement,
  );
}

export type ToggleButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  children?: ReactNode;
  /** `multiple` — независимые toggle; `single` — только один выбран (radio). По умолчанию `multiple`. */
  type?: ToggleButtonGroupType;
  orientation?: ToggleButtonGroupOrientation;
  /** Разделить кнопки зазором вместо склейки. */
  separated?: boolean;
  disabled?: boolean;
  size?: ToggleButtonSize;
  variant?: ToggleButtonVariant;
  /** Контролируемое значение: `string` при `type="single"`, `string[]` при `type="multiple"`. */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
};

function normalizeMultipleDefault(value: string | string[] | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeSingleDefault(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  function ToggleButtonGroup(
    {
      children,
      className = "",
      type = "multiple",
      orientation = "horizontal",
      separated = false,
      disabled = false,
      size = "base",
      variant = "outline",
      value: valueProp,
      defaultValue,
      onValueChange,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const isSingle = type === "single";
    const isControlled = valueProp !== undefined;

    const [internalSingle, setInternalSingle] = useState<string | undefined>(() =>
      normalizeSingleDefault(defaultValue),
    );
    const [internalMultiple, setInternalMultiple] = useState<string[]>(() =>
      normalizeMultipleDefault(defaultValue),
    );

    const singleValue = isSingle
      ? isControlled
        ? normalizeSingleDefault(valueProp)
        : internalSingle
      : undefined;

    const multipleValues = useMemo(
      () =>
        !isSingle
          ? isControlled
            ? normalizeMultipleDefault(valueProp)
            : internalMultiple
          : [],
      [internalMultiple, isControlled, isSingle, valueProp],
    );

    const isSelected = useCallback(
      (itemValue: string) => {
        if (isSingle) return singleValue === itemValue;
        return multipleValues.includes(itemValue);
      },
      [isSingle, multipleValues, singleValue],
    );

    const select = useCallback(
      (itemValue: string) => {
        if (disabled) return;

        if (isSingle) {
          if (singleValue === itemValue) return;
          if (!isControlled) setInternalSingle(itemValue);
          onValueChange?.(itemValue);
          return;
        }

        const next = multipleValues.includes(itemValue)
          ? multipleValues.filter((v) => v !== itemValue)
          : [...multipleValues, itemValue];

        if (!isControlled) setInternalMultiple(next);
        onValueChange?.(next);
      },
      [disabled, isControlled, isSingle, multipleValues, onValueChange, singleValue],
    );

    const flat = flattenFragmentChildren(children);
    const segmentCount = flat.reduce((n, el) => n + (isToggleButtonChild(el) ? 1 : 0), 0);
    let segmentIndex = -1;

    const toggleItemValues = flat.reduce<string[]>((acc, el) => {
      if (!isToggleButtonChild(el)) return acc;
      const value = (el.props as { value?: string }).value;
      if (typeof value === "string") acc.push(value);
      return acc;
    }, []);

    const firstToggleValue = toggleItemValues[0];

    const tabIndexFor = useCallback(
      (itemValue: string): 0 | -1 | undefined => {
        if (!isSingle) return undefined;
        if (singleValue != null) return singleValue === itemValue ? 0 : -1;
        return itemValue === firstToggleValue ? 0 : -1;
      },
      [firstToggleValue, isSingle, singleValue],
    );

    const ctx = useMemo(
      () => ({
        type,
        disabled,
        size,
        variant,
        isSelected,
        select,
        tabIndexFor,
      }),
      [disabled, isSelected, select, size, tabIndexFor, type, variant],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || disabled || !isSingle) return;

        const root = e.currentTarget;
        const items = collectToggleButtons(root);
        if (items.length === 0) return;

        const currentIndex = items.findIndex((el) => el === document.activeElement);
        const horizontal = orientation === "horizontal";

        let nextIndex: number | null = null;

        switch (e.key) {
          case "ArrowRight":
            if (horizontal) nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
            break;
          case "ArrowLeft":
            if (horizontal) {
              nextIndex =
                currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
            }
            break;
          case "ArrowDown":
            if (!horizontal) nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
            break;
          case "ArrowUp":
            if (!horizontal) {
              nextIndex =
                currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
            }
            break;
          default:
            return;
        }

        if (nextIndex == null) return;
        e.preventDefault();
        const next = items[nextIndex]!;
        next.focus();
        const nextValue = next.dataset.toggleButtonValue;
        if (nextValue) select(nextValue);
      },
      [disabled, isSingle, onKeyDown, orientation, select],
    );

    return (
      <ToggleButtonGroupContext.Provider value={ctx}>
        <div
          ref={ref}
          role="toolbar"
          tabIndex={disabled ? -1 : 0}
          aria-orientation={orientation}
          aria-disabled={disabled || undefined}
          className={cn(
            "inline-flex text-left",
            orientation === "horizontal"
              ? cn("flex-row flex-nowrap items-stretch", separated && "gap-xsmall")
              : cn("flex-col flex-nowrap items-stretch", separated && "gap-xsmall"),
            className,
          )}
          {...(isSingle ? { onKeyDown: handleKeyDown } : {})}
          {...rest}
        >
          {flat.map((child, i) => {
            if (!isToggleButtonChild(child)) {
              return <Fragment key={child.key ?? `tbg-wrap-${i}`}>{child}</Fragment>;
            }

            if (separated) {
              return <Fragment key={child.key ?? `tbg-item-${i}`}>{child}</Fragment>;
            }

            segmentIndex += 1;
            const position =
              segmentCount <= 1
                ? ("only" as const)
                : segmentIndex === 0
                  ? ("first" as const)
                  : segmentIndex === segmentCount - 1
                    ? ("last" as const)
                    : ("middle" as const);

            const seg: ButtonGroupSegment = { orientation, position };

            return (
              <ToggleButtonGroupSegmentProvider
                key={child.key ?? `tbg-seg-${i}`}
                segment={seg}
                buttonSize={size}
              >
                {child}
              </ToggleButtonGroupSegmentProvider>
            );
          })}
        </div>
      </ToggleButtonGroupContext.Provider>
    );
  },
);

ToggleButtonGroup.displayName = "ToggleButtonGroup";
