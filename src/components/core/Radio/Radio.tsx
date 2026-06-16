import {
  forwardRef,
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
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";

import { useOptionalRadioGroupContext } from "@/components/composite/RadioGroup/radioGroupContext";
import { FieldError, FieldHint, type FieldErrorProps, type FieldHintProps } from "@/components/core/Field";
import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { useOptionalFieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import { type LabelProps } from "@/components/core/Label";
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
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { cn } from "@/utils/cn";

import { RadioFieldContext, useRadioFieldContext } from "./radioFieldContext";

export type RadioSize = "small" | "base" | "mid" | "large";

const SIZE_LAYOUT: Record<
  RadioSize,
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

function compoundUsesInlineMotion(className: string | undefined): boolean {
  return !/\bflex-col\b/.test(className ?? "");
}

export type RadioRootProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange"
> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children" | "className"> & {
    children?: ReactNode;
    label?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    size?: RadioSize;
    danger?: boolean;
    className?: string;
  };

export type RadioProps = RadioRootProps;

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

export type RadioControlProps = HTMLAttributes<HTMLSpanElement>;

export const RadioControl = forwardRef<HTMLSpanElement, RadioControlProps>(function RadioControl(
  { className, children, ...rest },
  ref,
) {
  const ctx = useRadioFieldContext();
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
      <input
        id={ctx.inputId}
        type="radio"
        className={INPUT_VISUALLY_HIDDEN}
        checked={ctx.mergedChecked}
        disabled={ctx.isDisabled}
        name={ctx.inputName}
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
        aria-label={ctx.inputProps.value != null ? String(ctx.inputProps.value) : "Вариант"}
        onChange={ctx.onChange}
        onClick={ctx.onActivate}
      />
      <span
        ref={trackRef}
        className={cn("relative inline-flex items-center justify-center")}
      >
        {children ?? <RadioIndicator />}
      </span>
    </span>
  );
});

RadioControl.displayName = "RadioControl";

export type RadioIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export function RadioIndicator({ children, className, ...rest }: RadioIndicatorProps) {
  const ctx = useRadioFieldContext();

  return (
    <SelectionIndicator
      size={ctx.size}
      selected={ctx.mergedChecked}
      icon={children ?? undefined}
      className={className}
      {...rest}
    />
  );
}

RadioIndicator.displayName = "RadioIndicator";

export type RadioContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const RadioContent = forwardRef<HTMLDivElement, RadioContentProps>(function RadioContent(
  { className, children, ...rest },
  ref,
) {
  const ctx = useRadioFieldContext();
  return (
    <div
      ref={ref}
      className={cn("contents", ctx.isCompound && "min-w-0", className)}
      {...rest}
    >
      {children}
    </div>
  );
});

RadioContent.displayName = "RadioContent";

export type RadioLabelProps = Omit<LabelProps, "htmlFor">;

/** Текст опции внутри `<Radio>` — span, без вложенного `<label>`. */
export function RadioLabel({
  children,
  className,
  isRequired: isRequiredProp,
  ...rest
}: RadioLabelProps) {
  const field = useRadioFieldContext();
  const labelCtx = useOptionalFieldLabelContext();
  const isRequired = isRequiredProp ?? labelCtx?.isRequired ?? false;
  const sz = SIZE_LAYOUT[field.size];

  return (
    <span
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

RadioLabel.displayName = "RadioLabel";

export type RadioHintProps = Omit<FieldHintProps, "id" | "as">;

export function RadioHint({ children, className, variant, ...rest }: RadioHintProps) {
  const ctx = useRadioFieldContext();
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

RadioHint.displayName = "RadioHint";

export type RadioErrorProps = Omit<FieldErrorProps, "id" | "as">;

export function RadioError({ children, className, ...rest }: RadioErrorProps) {
  const ctx = useRadioFieldContext();
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

RadioError.displayName = "RadioError";

export const RadioRoot = forwardRef<HTMLLabelElement, RadioRootProps>(function RadioRoot(
  {
    children,
    label,
    hint,
    error,
    size = "base",
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
    onClick,
    ...labelRest
  },
  ref,
) {
  const group = useOptionalRadioGroupContext();
  const optionValueStr = value !== undefined && value !== null ? String(value) : undefined;
  const inGroup = group != null && optionValueStr != null;

  const autoId = useId();
  const inputId = idProp ?? `radio-${autoId}`;
  const hintId = fieldHintId(inputId);
  const errorId = fieldErrorId(inputId);

  const isExplicitlyControlled = checked !== undefined;
  const groupChecked = inGroup ? group.selectedValue === optionValueStr : undefined;
  const resolvedChecked = isExplicitlyControlled
    ? checked
    : groupChecked !== undefined
      ? groupChecked
      : undefined;

  const [mergedChecked, setMergedChecked, isControlled] = useMergedChecked(
    resolvedChecked,
    inGroup || isExplicitlyControlled ? undefined : defaultChecked,
  );

  const inputName = name ?? group?.name;
  const isDisabled = Boolean(disabled ?? group?.disabled);
  const isCompound = hasCompoundChildren(children);
  const hasCompoundHint = isCompound ? hasCompoundChild(children, RadioHint) : false;
  const hasCompoundError = isCompound ? hasCompoundChild(children, RadioError) : false;
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
      if (!isExplicitlyControlled && !inGroup) setMergedChecked(e.target.checked);
      onChange?.(e);
      if (e.defaultPrevented) return;
      if (inGroup && e.target.checked && optionValueStr != null) group.selectValue(optionValueStr);
    },
    [group, inGroup, isExplicitlyControlled, onChange, optionValueStr, setMergedChecked],
  );

  const canClearSelection = !isDisabled && !readOnly && !required && !(inGroup && group.isRequired);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLInputElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || !canClearSelection || !mergedChecked) return;

      e.preventDefault();

      if (inGroup) {
        group.selectValue(undefined);
        return;
      }

      if (!isExplicitlyControlled) {
        setMergedChecked(false);
      }
    },
    [
      canClearSelection,
      group,
      inGroup,
      isExplicitlyControlled,
      mergedChecked,
      onClick,
      setMergedChecked,
    ],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLLabelElement>) => {
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
      size,
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
      inputName,
      onChange: handleChange,
      onActivate: handleClick,
      inputProps: {
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
      danger,
      defaultChecked,
      form,
      autoFocus,
      errorId,
      handleChange,
      handleClick,
      hasCompoundError,
      hasCompoundHint,
      hasError,
      hasHint,
      hintId,
      inputId,
      inputName,
      isCompound,
      useInlineCompoundMotion,
      isControlled,
      isDisabled,
      mergedChecked,
      onBlur,
      onFocus,
      readOnly,
      required,
      size,
      tabIndex,
      value,
    ],
  );

  const simpleBody = (
    <>
      <RadioControl />
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

  return (
    <RadioFieldContext.Provider value={contextValue}>
      <label
        ref={ref}
        data-selected={mergedChecked ? true : undefined}
        className={cn(
          "relative cursor-pointer select-none rounded-small text-left",
          optionControlGridClass(secondaryLines, sz.gridGap),
          isDisabled && "cursor-not-allowed",
          "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
          className,
        )}
        {...labelRest}
        onPointerDown={handlePointerDown}
      >
        {isCompound ? children : simpleBody}
      </label>
    </RadioFieldContext.Provider>
  );
});

RadioRoot.displayName = "RadioRoot";
