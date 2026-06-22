import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import { useOptionalCheckboxGroupContext } from "@/components/composite/CheckboxGroup/checkboxGroupContext";
import { FieldError, FieldHint, type FieldErrorProps, type FieldHintProps } from "@/components/core/Field";
import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { FieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import { type LabelProps } from "@/components/core/Label";
import { useOptionalFieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import { Text, type TextVariant } from "@/components/core/Text";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
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
  SelectionIndicator,
  type SelectionIndicatorVariant,
} from "@/components/core/SelectionIndicator";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { cn } from "@/utils/cn";

import { CheckboxFieldContext, useCheckboxFieldContext } from "./checkboxFieldContext";
import type { CheckboxSize, CheckboxVariant } from "./checkboxFieldContext";

export type { CheckboxSize, CheckboxVariant };

function checkboxVariantToIndicator(variant: CheckboxVariant): SelectionIndicatorVariant {
  if (variant === "default") return "base";
  return variant;
}

const SIZE_LAYOUT: Record<
  CheckboxSize,
  {
    title: TextVariant;
    desc: TextVariant;
    gridGap: string;
  }
> = {
  small: {
    title: "small",
    desc: "tools",
    gridGap: "gap-x-small gap-y-xsmall",
  },
  base: {
    title: "base",
    desc: "small",
    gridGap: "gap-x-base gap-y-xsmall",
  },
  mid: {
    title: "mid",
    desc: "small",
    gridGap: "gap-x-plus gap-y-xsmall",
  },
  large: {
    title: "large",
    desc: "base",
    gridGap: "gap-x-plus gap-y-xsmall",
  },
};

const INPUT_VISUALLY_HIDDEN =
  "absolute m-[-1px] h-px w-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]";

const INPUT_TRACK_OVERLAY =
  "absolute inset-0 z-[2] m-0 h-full w-full cursor-pointer opacity-0";

/** Свой `<Label htmlFor>` / `<label htmlFor>` — не оборачиваем Content во второй label. */
function compoundContentHasExternalLabel(children: ReactNode): boolean {
  let found = false;

  const walk = (node: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(node)) {
      if (!isValidElement(child)) continue;
      const props = child.props as { htmlFor?: string; children?: ReactNode };
      if (props.htmlFor != null) {
        found = true;
        return;
      }
      walk(props.children);
    }
  };

  walk(children);
  return found;
}

function compoundUsesInlineMotion(className: string | undefined): boolean {
  return !/\bflex-col\b/.test(className ?? "");
}

function useMergedChecked(
  checked: boolean | undefined,
  defaultChecked: boolean | undefined,
): [boolean, (next: boolean) => void, boolean] {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(Boolean(defaultChecked));
  const value = isControlled ? Boolean(checked) : internal;
  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [value, setValue, isControlled];
}

export type CheckboxRootProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange" | "onPointerDown"
> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children" | "className"> & {
    children?: ReactNode;
    /** Simple API: подпись справа от индикатора. В compound игнорируется. */
    label?: ReactNode;
    /** Simple API: подсказка под заголовком. В compound — `<Checkbox.Hint>`. */
    hint?: ReactNode;
    error?: ReactNode;
    size?: CheckboxSize;
    variant?: CheckboxVariant;
    /** Иконка внутри залитого кружка. По умолчанию `IoCheckmark`. */
    checkIcon?: ReactNode;
    danger?: boolean;
    className?: string;
    onPointerDown?: (e: PointerEvent<HTMLElement>) => void;
  };

export type CheckboxProps = CheckboxRootProps;

export type CheckboxControlProps = HTMLAttributes<HTMLSpanElement>;

export const CheckboxControl = forwardRef<HTMLSpanElement, CheckboxControlProps>(
  function CheckboxControl({ className, children, ...rest }, ref) {
    const ctx = useCheckboxFieldContext();
    const trackRef = useRef<HTMLSpanElement>(null);
    const trackFirstLayoutRef = useRef(true);
    const reduceMotion = prefersReducedInteractiveHoverLift();

    useLayoutEffect(() => {
      const track = trackRef.current;
      if (!track) return;
      if (reduceMotion) {
        killMotion(track);
        track.style.opacity = ctx.isDisabled ? "0.48" : "1";
        return;
      }

      if (trackFirstLayoutRef.current) {
        trackFirstLayoutRef.current = false;
        track.style.opacity = ctx.isDisabled ? "0.48" : "1";
        return;
      }

      killMotion(track);
      const from = Number.parseFloat(getComputedStyle(track).opacity);
      const start = Number.isFinite(from) ? from : 1;
      void gsap.fromTo(
        track,
        { autoAlpha: start },
        {
          autoAlpha: ctx.isDisabled ? 0.48 : 1,
          ...motionInteractive(),
          overwrite: "auto",
        },
      );
    }, [ctx.isDisabled, reduceMotion]);

    return (
      <span
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center",
          optionControlCellClass(),
          className,
        )}
        {...rest}
      >
        <span ref={trackRef} className="relative inline-flex items-center justify-center">
          <input
            id={ctx.inputId}
            type="checkbox"
            className={ctx.isCompound ? INPUT_TRACK_OVERLAY : INPUT_VISUALLY_HIDDEN}
            disabled={ctx.isDisabled}
            name={ctx.inputProps.name}
            value={ctx.inputProps.value}
            required={ctx.inputProps.required}
            form={ctx.inputProps.form}
            autoFocus={ctx.inputProps.autoFocus}
            tabIndex={ctx.inputProps.tabIndex}
            readOnly={ctx.inputProps.readOnly}
            onBlur={ctx.inputProps.onBlur}
            onFocus={ctx.inputProps.onFocus}
            aria-describedby={joinFieldDescribedBy(
              ctx.hintConnected ? ctx.hintId : undefined,
              ctx.errorConnected ? ctx.errorId : undefined,
            )}
            aria-labelledby={ctx.isCompound ? ctx.labelId : undefined}
            {...(ctx.isControlled
              ? { checked: ctx.mergedChecked, onChange: ctx.onChange }
              : {
                  defaultChecked: ctx.inputProps.defaultChecked,
                  onChange: ctx.onChange,
                })}
          />
          {children ?? <CheckboxIndicator />}
        </span>
      </span>
    );
  },
);

CheckboxControl.displayName = "CheckboxControl";

export type CheckboxIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export function CheckboxIndicator({ children, className, ...rest }: CheckboxIndicatorProps) {
  const ctx = useCheckboxFieldContext();
  const hasCustomIcon = children != null || ctx.checkIcon != null;

  return (
    <SelectionIndicator
      variant={checkboxVariantToIndicator(ctx.variant)}
      size={ctx.size}
      selected={ctx.mergedChecked}
      icon={children ?? ctx.checkIcon ?? undefined}
      check={!hasCustomIcon}
      className={className}
      {...rest}
    />
  );
}

CheckboxIndicator.displayName = "CheckboxIndicator";

export type CheckboxContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const CheckboxContent = forwardRef<HTMLDivElement, CheckboxContentProps>(
  function CheckboxContent({ className, children, ...rest }, ref) {
    const ctx = useCheckboxFieldContext();
    const contentClass = cn("contents", ctx.isCompound && "min-w-0", className);

    const useNativeLabel =
      ctx.isCompound && !compoundContentHasExternalLabel(children);

    if (useNativeLabel) {
      return (
        <label
          ref={ref as Ref<HTMLLabelElement>}
          htmlFor={ctx.inputId}
          id={ctx.labelId}
          className={cn(contentClass, !ctx.isDisabled && "cursor-pointer")}
          {...(rest as LabelHTMLAttributes<HTMLLabelElement>)}
        >
          {children}
        </label>
      );
    }

    return (
      <div ref={ref} className={contentClass} {...rest}>
        {children}
      </div>
    );
  },
);

CheckboxContent.displayName = "CheckboxContent";

export type CheckboxLabelProps = Omit<LabelProps, "htmlFor">;

/** Подпись в compound; `id` для a11y на `<Checkbox.Content>` (label). Для `<Label htmlFor>` — без обёртки Content в label. */
export function CheckboxLabel({
  children,
  className,
  isRequired: isRequiredProp,
  id: idProp,
  ...rest
}: CheckboxLabelProps) {
  const field = useCheckboxFieldContext();
  const labelCtx = useOptionalFieldLabelContext();
  const isRequired = isRequiredProp ?? labelCtx?.isRequired ?? false;
  const sz = SIZE_LAYOUT[field.size];

  return (
    <span
      id={idProp}
      ref={(node) => {
        if (field.isCompound && field.useInlineCompoundMotion) {
          field.textMotionRef.current = node;
        }
      }}
      className={cn(
        "inline-flex flex-wrap items-center gap-x-xsmall gap-y-0",
        field.isCompound && optionLabelCellClass(),
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
        className={cn(
          field.isDisabled && "text-muted",
          !field.isDisabled && field.danger && "text-danger",
        )}
      >
        {children}
      </Text>
      {isRequired ? (
        <span className="text-danger" aria-hidden>
          *
        </span>
      ) : null}
    </span>
  );
}

CheckboxLabel.displayName = "CheckboxLabel";

export type CheckboxHintProps = Omit<FieldHintProps, "id" | "as">;

export function CheckboxHint({ children, className, variant, ...rest }: CheckboxHintProps) {
  const ctx = useCheckboxFieldContext();
  return (
    <FieldHint
      as="span"
      id={ctx.hintId}
      variant={variant ?? SIZE_LAYOUT[ctx.size].desc}
      className={cn(
        ctx.isCompound && optionSecondaryCellClass(2),
        ctx.isDisabled && "text-muted",
        className,
      )}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

CheckboxHint.displayName = "CheckboxHint";

export type CheckboxErrorProps = Omit<FieldErrorProps, "id" | "as">;

export function CheckboxError({ children, className, ...rest }: CheckboxErrorProps) {
  const ctx = useCheckboxFieldContext();
  return (
    <FieldError
      as="span"
      id={ctx.errorId}
      variant={SIZE_LAYOUT[ctx.size].desc}
      className={cn(
        ctx.isCompound && optionSecondaryCellClass(optionErrorRow(ctx.hasCompoundHint)),
        ctx.isDisabled && "text-muted",
        className,
      )}
      {...rest}
    >
      {children}
    </FieldError>
  );
}

CheckboxError.displayName = "CheckboxError";

export const CheckboxRoot = forwardRef<HTMLLabelElement, CheckboxRootProps>(function CheckboxRoot(
  {
    children,
    label,
    hint,
    error,
    size = "base",
    variant = "default",
    checkIcon,
    danger = false,
    className,
    disabled,
    checked,
    defaultChecked,
    onChange,
    id: idProp,
    name,
    value,
    required,
    form,
    autoFocus,
    tabIndex,
    readOnly,
    onBlur,
    onFocus,
    onPointerDown,
    ...labelRest
  },
  ref,
) {
  const group = useOptionalCheckboxGroupContext();
  const optionValueStr = value !== undefined && value !== null ? String(value) : undefined;
  const inSingleGroup =
    group?.selection === "single" && group != null && optionValueStr != null;

  const autoId = useId();
  const inputId = idProp ?? `checkbox-${autoId}`;
  const hintId = fieldHintId(inputId);
  const errorId = fieldErrorId(inputId);
  const labelId = `${inputId}-label`;

  const isExplicitlyControlled = checked !== undefined;
  const groupChecked = inSingleGroup ? group.selectedValue === optionValueStr : undefined;
  const resolvedChecked = isExplicitlyControlled
    ? checked
    : groupChecked !== undefined
      ? groupChecked
      : undefined;

  const [mergedChecked, setMergedChecked, isControlled] = useMergedChecked(
    resolvedChecked,
    inSingleGroup || isExplicitlyControlled ? undefined : defaultChecked,
  );

  const isDisabled = Boolean(disabled ?? group?.disabled);
  const isCompound = hasCompoundChildren(children);
  const hasCompoundHint = isCompound ? hasCompoundChild(children, CheckboxHint) : false;
  const hasCompoundError = isCompound ? hasCompoundChild(children, CheckboxError) : false;
  const useInlineCompoundMotion = isCompound && compoundUsesInlineMotion(className);
  const enableTextMotion = !isDisabled && (!isCompound || useInlineCompoundMotion);
  const sz = SIZE_LAYOUT[size];
  const hasHint = hint != null;
  const hasError = error != null;
  const secondaryLines = isCompound
    ? (hasCompoundHint ? 1 : 0) + (hasCompoundError ? 1 : 0)
    : (hasHint ? 1 : 0) + (hasError ? 1 : 0);

  const textColRef = useRef<HTMLElement>(null);
  const reduceMotion = prefersReducedInteractiveHoverLift();

  useEffect(() => {
    const el = textColRef.current;
    return () => {
      if (el) killMotion(el);
    };
  }, []);

  useEffect(() => {
    const el = textColRef.current;
    if (!el || !isDisabled) return;
    killMotion(el);
    el.style.transform = "";
  }, [isDisabled]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked;
      if (!isControlled && !inSingleGroup) setMergedChecked(next);
      onChange?.(e);
      if (e.defaultPrevented) return;
      if (inSingleGroup) group.selectSingleValue(optionValueStr, next);
    },
    [group, inSingleGroup, isControlled, onChange, optionValueStr, setMergedChecked],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || isDisabled || !enableTextMotion) return;
      if (reduceMotion) return;
      const t = textColRef.current;
      if (!t) return;
      void animateInteractivePressSqueeze(t);
    },
    [enableTextMotion, isDisabled, onPointerDown, reduceMotion],
  );

  const contextValue = useMemo(
    () => ({
      inputId,
      hintId,
      errorId,
      labelId,
      size,
      variant,
      mergedChecked,
      isDisabled,
      isControlled,
      isCompound,
      hasCompoundHint,
      hasCompoundError,
      hintConnected: isCompound ? hasCompoundHint : hasHint,
      errorConnected: isCompound ? hasCompoundError : hasError,
      useInlineCompoundMotion,
      textMotionRef: textColRef,
      danger,
      checkIcon,
      onChange: handleChange,
      inputProps: {
        name,
        value,
        defaultChecked: !isControlled ? defaultChecked : undefined,
        required,
        form,
        autoFocus,
        tabIndex,
        readOnly,
        onBlur,
        onFocus,
      },
    }),
    [
      checkIcon,
      danger,
      defaultChecked,
      form,
      autoFocus,
      errorId,
      handleChange,
      hintId,
      hasCompoundError,
      hasCompoundHint,
      hasError,
      hasHint,
      inputId,
      isCompound,
      isControlled,
      isDisabled,
      labelId,
      mergedChecked,
      name,
      onBlur,
      onFocus,
      readOnly,
      required,
      size,
      tabIndex,
      useInlineCompoundMotion,
      value,
      variant,
    ],
  );

  const gridClass = cn(
    "relative cursor-pointer select-none rounded-small text-left",
    optionControlGridClass(secondaryLines, sz.gridGap),
    isDisabled && "cursor-not-allowed",
    "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
    className,
  );

  const simpleBody = (
    <>
      <CheckboxControl />
      <span
        ref={textColRef}
        className={cn(
          optionLabelCellClass(),
          !secondaryLines && "origin-center will-change-transform",
        )}
      >
        <Text
          as="span"
          variant={sz.title}
          inheritColor
          className={cn(
            "min-w-0",
            isDisabled && "text-muted",
            !isDisabled && danger && "text-danger",
          )}
        >
          {label}
        </Text>
      </span>
      {hasHint ? (
        <FieldHint
          as="span"
          id={hintId}
          variant={sz.desc}
          className={cn(optionSecondaryCellClass(2), isDisabled && "text-muted")}
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
            optionSecondaryCellClass(optionErrorRow(hasHint)),
            isDisabled && "text-muted",
          )}
        >
          {error}
        </FieldError>
      ) : null}
    </>
  );

  const fieldLabelContext = useMemo(
    () => ({
      controlId: inputId,
      labelId,
      isRequired: Boolean(required),
    }),
    [inputId, labelId, required],
  );

  if (isCompound) {
    return (
      <CheckboxFieldContext.Provider value={contextValue}>
        <FieldLabelContext.Provider value={fieldLabelContext}>
          <fieldset
            ref={ref as Ref<HTMLFieldSetElement>}
            aria-labelledby={labelId}
            data-checked={mergedChecked ? true : undefined}
            className={cn(gridClass, "m-0 min-w-0 border-0 p-0")}
            onPointerDown={handlePointerDown}
            {...(labelRest as HTMLAttributes<HTMLFieldSetElement>)}
          >
            {children}
          </fieldset>
        </FieldLabelContext.Provider>
      </CheckboxFieldContext.Provider>
    );
  }

  return (
    <CheckboxFieldContext.Provider value={contextValue}>
      <label
        ref={ref}
        data-checked={mergedChecked ? true : undefined}
        className={gridClass}
        {...labelRest}
        onPointerDown={handlePointerDown}
      >
        {simpleBody}
      </label>
    </CheckboxFieldContext.Provider>
  );
});

CheckboxRoot.displayName = "CheckboxRoot";
