import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react";
import { remove } from "animejs";

import { FieldError, FieldHint, type FieldErrorProps, type FieldHintProps } from "@/components/core/Field";
import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { type LabelProps } from "@/components/core/Label";
import { Text } from "@/components/core/Text";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import {
  optionControlCellClass,
  optionControlGridClass,
  optionErrorRow,
  optionLabelCellClass,
  optionSecondaryCellClass,
} from "@/components/core/utils/optionControlGridLayout";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { cn } from "@/utils/cn";

import { SWITCH_LAYOUT, SwitchControl, type SwitchControlProps } from "./Switch";
import type { SwitchLabelPosition, SwitchSize } from "./Switch";
import { SwitchFieldContext, useSwitchFieldContext } from "./switchFieldContext";

export type SwitchRootProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange"
> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  labelPosition?: SwitchLabelPosition;
  size?: SwitchSize;
  disabled?: boolean;
};

export type SwitchSimpleProps = SwitchRootProps & SwitchControlProps;

function compoundHasLabel(children: ReactNode): boolean {
  let found = false;

  const walk = (node: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(node)) {
      if (!isValidElement(child)) continue;
      const name = (child.type as { displayName?: string }).displayName;
      if (name === "SwitchLabel" || name === "SwitchContent") {
        found = true;
        return;
      }
      walk((child.props as { children?: ReactNode }).children);
    }
  };

  walk(children);
  return found;
}

function compoundUsesInlineMotion(className: string | undefined): boolean {
  return !/\bflex-col\b/.test(className ?? "");
}

function countSecondaryLines(
  isCompound: boolean,
  hasHint: boolean,
  hasError: boolean,
  hasCompoundHint: boolean,
  hasCompoundError: boolean,
) {
  if (isCompound) {
    return (hasCompoundHint ? 1 : 0) + (hasCompoundError ? 1 : 0);
  }
  return (hasHint ? 1 : 0) + (hasError ? 1 : 0);
}

export type SwitchContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const SwitchContent = forwardRef<HTMLDivElement, SwitchContentProps>(function SwitchContent(
  { className, children, ...rest },
  ref,
) {
  const ctx = useSwitchFieldContext();
  return (
    <div ref={ref} className={cn("contents", ctx.isCompound && "min-w-0", className)} {...rest}>
      {children}
    </div>
  );
});

SwitchContent.displayName = "SwitchContent";

export type SwitchLabelProps = Omit<LabelProps, "htmlFor">;

/** Текст опции внутри `<Switch>` — span, без вложенного `<label>`. */
export function SwitchLabel({ children, className, ...rest }: SwitchLabelProps) {
  const field = useSwitchFieldContext();
  const sz = SWITCH_LAYOUT[field.size];
  const labelSide = field.labelPosition === "left" ? "left" : "right";

  return (
    <span
      ref={(node) => {
        if (field.isCompound && field.useInlineCompoundMotion) {
          field.textMotionRef.current = node;
        }
      }}
      className={cn(
        "inline-flex flex-wrap items-center gap-x-xsmall gap-y-0",
        field.isCompound && optionLabelCellClass(labelSide),
        field.isCompound && (field.hasCompoundHint || field.hasCompoundError) && "min-w-0",
        field.isCompound && field.useInlineCompoundMotion && "origin-center will-change-transform",
        className,
      )}
      {...(rest as HTMLAttributes<HTMLSpanElement>)}
    >
      <Text
        as="span"
        variant={sz.title}
        inheritColor
        className={cn("font-medium", field.disabled && "text-muted")}
      >
        {children}
      </Text>
    </span>
  );
}

SwitchLabel.displayName = "SwitchLabel";

export type SwitchHintProps = Omit<FieldHintProps, "id" | "as">;

export function SwitchHint({ children, className, variant, ...rest }: SwitchHintProps) {
  const ctx = useSwitchFieldContext();
  const labelSide = ctx.labelPosition === "left" ? "left" : "right";

  return (
    <FieldHint
      as="span"
      id={ctx.hintId}
      variant={variant ?? SWITCH_LAYOUT[ctx.size].desc}
      className={cn(
        ctx.isCompound && optionSecondaryCellClass(2, labelSide),
        ctx.disabled && "text-muted",
        className,
      )}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

SwitchHint.displayName = "SwitchHint";

export type SwitchErrorProps = Omit<FieldErrorProps, "id" | "as">;

export function SwitchError({ children, className, ...rest }: SwitchErrorProps) {
  const ctx = useSwitchFieldContext();
  const labelSide = ctx.labelPosition === "left" ? "left" : "right";

  return (
    <FieldError
      as="span"
      id={ctx.errorId}
      variant={SWITCH_LAYOUT[ctx.size].desc}
      className={cn(
        ctx.isCompound && optionSecondaryCellClass(optionErrorRow(ctx.hasCompoundHint), labelSide),
        ctx.disabled && "text-muted",
        className,
      )}
      {...rest}
    >
      {children}
    </FieldError>
  );
}

SwitchError.displayName = "SwitchError";

export const SwitchRoot = forwardRef<HTMLLabelElement, SwitchRootProps & Partial<SwitchControlProps>>(
  function SwitchRoot(
    {
      children,
      label,
      hint,
      error,
      labelPosition = "right",
      size = "base",
      disabled: disabledRoot,
      className,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const switchId = `switch-${autoId}`;
    const hintId = fieldHintId(switchId);
    const errorId = fieldErrorId(switchId);
    const [, setSqueezeToken] = useState(0);
    const isCompound = hasCompoundChildren(children);
    const hasCompoundHint = isCompound ? hasCompoundChild(children, SwitchHint) : false;
    const hasCompoundError = isCompound ? hasCompoundChild(children, SwitchError) : false;
    const hasCompoundLabel = isCompound ? compoundHasLabel(children) : false;
    const useInlineCompoundMotion = isCompound && compoundUsesInlineMotion(className);
    const hasHint = hint != null;
    const hasError = error != null;
    const secondaryLines = countSecondaryLines(
      isCompound,
      hasHint,
      hasError,
      hasCompoundHint,
      hasCompoundError,
    );
    const hasTextColumn = isCompound ? hasCompoundLabel : label != null;
    const labelOnLeft = labelPosition === "left";
    const labelSide = labelOnLeft ? "left" : "right";
    const disabled = disabledRoot;
    const enableTextMotion =
      !disabled && hasTextColumn && (!isCompound || useInlineCompoundMotion);

    const textColRef = useRef<HTMLElement>(null);
    const reduceMotion = prefersReducedInteractiveHoverLift();
    const sz = SWITCH_LAYOUT[size];

    useEffect(() => {
      const el = textColRef.current;
      return () => {
        if (el) remove(el);
      };
    }, []);

    useEffect(() => {
      const el = textColRef.current;
      if (!el || !disabled) return;
      remove(el);
      el.style.transform = "";
    }, [disabled]);

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLLabelElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled || !enableTextMotion) return;
        if (reduceMotion) return;
        const t = textColRef.current;
        if (!t) return;
        void animateInteractivePressSqueeze(t);
      },
      [disabled, enableTextMotion, onPointerDown, reduceMotion],
    );

    const contextValue = useMemo(
      () => ({
        switchId,
        hintId,
        errorId,
        size,
        labelPosition,
        disabled,
        isCompound,
        hasCompoundHint,
        hasCompoundError,
        hasTextColumn,
        hintConnected: isCompound ? hasCompoundHint : hasHint,
        errorConnected: isCompound ? hasCompoundError : hasError,
        useInlineCompoundMotion,
        textMotionRef: textColRef,
        setSqueezeToken,
      }),
      [
        disabled,
        hasCompoundHint,
        hasCompoundError,
        hasHint,
        hasError,
        hasTextColumn,
        hintId,
        errorId,
        isCompound,
        labelPosition,
        size,
        switchId,
        useInlineCompoundMotion,
      ],
    );

    const simpleBody = (
      <>
        <SwitchControl
          size={size}
          disabled={disabled}
          className={optionControlCellClass(labelSide)}
          {...(rest as SwitchControlProps)}
        />
        {hasTextColumn ? (
          <>
            <span
              ref={textColRef}
              className={cn(
                optionLabelCellClass(labelSide),
                !secondaryLines && "origin-center will-change-transform",
              )}
            >
              <Text
                as="span"
                variant={sz.title}
                inheritColor
                className={cn("min-w-0 font-medium", disabled && "text-muted")}
              >
                {label}
              </Text>
            </span>
            {hasHint ? (
              <FieldHint
                as="span"
                id={hintId}
                variant={sz.desc}
                className={cn(optionSecondaryCellClass(2, labelSide), disabled && "text-muted")}
              >
                {hint}
              </FieldHint>
            ) : null}
            {hasError ? (
              <FieldError
                as="span"
                id={errorId}
                variant={sz.desc}
                className={cn(
                  optionSecondaryCellClass(optionErrorRow(hasHint), labelSide),
                  disabled && "text-muted",
                )}
              >
                {error}
              </FieldError>
            ) : null}
          </>
        ) : null}
      </>
    );

    return (
      <SwitchFieldContext.Provider value={contextValue}>
        <label
          ref={ref}
          className={cn(
            "relative cursor-pointer select-none rounded-small text-left",
            hasTextColumn
              ? optionControlGridClass(secondaryLines, sz.gapX, labelSide, "inline-grid")
              : "inline-grid grid-cols-[auto] grid-rows-[auto]",
            disabled && "cursor-not-allowed",
            "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
            className,
          )}
          onPointerDown={handlePointerDown}
          {...(isCompound ? (rest as LabelHTMLAttributes<HTMLLabelElement>) : {})}
        >
          {isCompound ? children : simpleBody}
        </label>
      </SwitchFieldContext.Provider>
    );
  },
);

SwitchRoot.displayName = "SwitchRoot";
