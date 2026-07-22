import type {
  FocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import { IoChevronDown } from "react-icons/io5";

import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { useGlossFieldShellMotion } from "@/components/core/utils/glossInteractiveMotion";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import { useFieldShellHoverLift } from "@/components/core/utils/useFieldShellHoverLift";

import { selectActiveOptionId, selectTriggerAriaLabel } from "./selectA11y";
import { runSelectOpenAfterSqueeze, useSelectOpeningRef } from "./selectAnimations";
import { selectBumpActiveValue, selectFirstEnabledValue, selectLastEnabledValue, selectOptionsByValue } from "./selectAPI";
import { useSelectClassNames, useSelectContext } from "./selectContext";
import { SELECT_CHEVRON_ICON, selectTriggerClass, selectTriggerGroupClass, selectValueClass } from "./selectStyles";
import type {
  SelectTriggerGroupProps,
  SelectTriggerProps,
  SelectValueProps,
} from "./selectTypes";

import { cn } from "@/utils/cn";

export const SelectTriggerGroup = forwardRef<HTMLDivElement, SelectTriggerGroupProps>(
  function SelectTriggerGroup(
    {
      className,
      children,
      groupSegment: groupSegmentProp,
      onPointerEnter,
      onPointerLeave,
      ...rest
    },
    ref,
  ) {
    const layoutCtx = useOptionalButtonGroupLayout();
    const groupCtx = useOptionalButtonGroupSegment();
    const slotClassNames = useSelectClassNames();
    const ctx = useSelectContext();
    const {
      open,
      setOpen,
      disabled,
      variant,
      status,
      anchorRef,
      listId,
      valueRef,
      value,
      optionValues,
      setActiveValue,
      activeValue,
      required,
      hintConnected,
      errorConnected,
      hintId,
      errorId,
    } = ctx;

    const activeOptionId = selectActiveOptionId(listId, open, activeValue);
    const ariaDescribedBy = joinFieldDescribedBy(
      hintConnected ? hintId : undefined,
      errorConnected ? errorId : undefined,
    );

    const openingRef = useSelectOpeningRef();
    const isGloss = variant === "gloss";
    const groupSegment = layoutCtx?.segmented
      ? undefined
      : (groupSegmentProp ?? groupCtx?.segment);

    const shellHoverLift = useFieldShellHoverLift(
      anchorRef,
      !disabled && !isGloss && groupSegment == null,
    );
    const glossShellMotion = useGlossFieldShellMotion(
      anchorRef,
      !disabled && isGloss && groupSegment == null,
    );

    const setAnchorRef = useCallback(
      (node: HTMLDivElement | null) => {
        anchorRef.current = node;
        if (!disabled && isGloss) glossShellMotion.bindShellRef(node);
      },
      [anchorRef, disabled, glossShellMotion, isGloss],
    );

    const finishOpen = useCallback(() => {
      const selectedIdx = optionValues.indexOf(value);
      setActiveValue(selectedIdx >= 0 ? value : optionValues[0] ?? null);
      requestAnimationFrame(() => valueRef.current?.focus());
    }, [optionValues, setActiveValue, value, valueRef]);

    const openAfterSqueeze = useCallback(() => {
      runSelectOpenAfterSqueeze({
        anchorRef,
        disabled,
        isGloss,
        groupSegment,
        setOpen,
        onOpened: finishOpen,
        openingRef,
      });
    }, [anchorRef, disabled, finishOpen, groupSegment, isGloss, setOpen, openingRef]);

    const handlePointerDown = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (open) return;
        if (e.button !== 0) return;
        openAfterSqueeze();
      },
      [disabled, open, openAfterSqueeze],
    );

    return (
      <div
        ref={mergeRefs(ref, setAnchorRef)}
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-haspopup="listbox"
        aria-activedescendant={open ? activeOptionId : undefined}
        aria-required={required || undefined}
        aria-invalid={status === "danger" ? true : undefined}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={handlePointerDown}
        onPointerEnter={(e) => {
          onPointerEnter?.(e);
          if (e.defaultPrevented) return;
          if (isGloss && groupSegment == null) glossShellMotion.onShellPointerEnter(e);
          else shellHoverLift.onShellPointerEnter(e);
        }}
        onPointerLeave={(e) => {
          onPointerLeave?.(e);
          if (isGloss && groupSegment == null) glossShellMotion.onShellPointerLeave(e);
          else shellHoverLift.onShellPointerLeave(e);
        }}
        onFocusCapture={
          isGloss && !disabled && groupSegment == null
            ? glossShellMotion.onShellFocusIn
            : undefined
        }
        onBlurCapture={
          isGloss && !disabled && groupSegment == null
            ? glossShellMotion.onShellFocusOut
            : undefined
        }
        {...(disabled && isGloss ? { "data-gloss-disabled": "" } : {})}
        className={selectTriggerGroupClass({
          variant,
          status,
          disabled,
          groupSegment,
          shellHoverMotionClass: isGloss
            ? glossShellMotion.shellHoverMotionClass
            : shellHoverLift.shellHoverMotionClass,
          className,
          slotClass: slotClassNames.triggerGroup,
        })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

SelectTriggerGroup.displayName = "SelectTriggerGroup";

export const SelectValue = forwardRef<HTMLButtonElement, SelectValueProps>(
  function SelectValue({ className, onKeyDown, onBlur, children, placeholder: placeholderProp, ...rest }, ref) {
    const slotClassNames = useSelectClassNames();
    const ctx = useSelectContext();
    const {
      selectId,
      open,
      setOpen,
      value,
      setValue,
      activeValue,
      setActiveValue,
      valueRef,
      anchorRef,
      options,
      optionValues,
      disabled,
      placeholder: contextPlaceholder,
      size,
      variant,
      formValueRef,
      formOnBlur,
    } = ctx;

    const placeholder = placeholderProp ?? contextPlaceholder;

    const openingRef = useSelectOpeningRef();
    const isGloss = variant === "gloss";

    const optionsByValue = useMemo(
      () => selectOptionsByValue(options),
      [options],
    );

    const selectedOption = useMemo(
      () => optionsByValue.get(value),
      [optionsByValue, value],
    );

    const finishOpen = useCallback(() => {
      const selectedIdx = optionValues.indexOf(value);
      setActiveValue(selectedIdx >= 0 ? value : optionValues[0] ?? null);
      requestAnimationFrame(() => valueRef.current?.focus());
    }, [optionValues, setActiveValue, value, valueRef]);

    const openAfterSqueeze = useCallback(() => {
      runSelectOpenAfterSqueeze({
        anchorRef,
        disabled,
        isGloss,
        setOpen,
        onOpened: finishOpen,
        openingRef,
      });
    }, [anchorRef, disabled, finishOpen, isGloss, setOpen, openingRef]);

    const bumpActive = useCallback(
      (delta: number) => {
        const next = selectBumpActiveValue({
          optionValues,
          activeValue,
          optionsByValue,
          delta,
        });
        if (next) setActiveValue(next);
      },
      [activeValue, optionValues, optionsByValue, setActiveValue],
    );

    const selectOption = useCallback(
      (next: string) => {
        const opt = optionsByValue.get(next);
        if (!opt || opt.disabled) return;
        setValue(next);
        setOpen(false);
        valueRef.current?.focus();
      },
      [optionsByValue, setOpen, setValue, valueRef],
    );

    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || disabled) return;

        if (!open) {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openAfterSqueeze();
            return;
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openAfterSqueeze();
            return;
          }
          return;
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          bumpActive(1);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          bumpActive(-1);
          return;
        }
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (activeValue) selectOption(activeValue);
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setOpen(false);
          return;
        }
        if (e.key === "Home") {
          e.preventDefault();
          const first = selectFirstEnabledValue(optionValues, optionsByValue);
          if (first) setActiveValue(first);
          return;
        }
        if (e.key === "End") {
          e.preventDefault();
          const last = selectLastEnabledValue(optionValues, optionsByValue);
          if (last) setActiveValue(last);
        }
      },
      [
        activeValue,
        bumpActive,
        disabled,
        onKeyDown,
        open,
        openAfterSqueeze,
        optionValues,
        optionsByValue,
        selectOption,
        setActiveValue,
        setOpen,
      ],
    );

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLButtonElement>) => {
        onBlur?.(e);
        formOnBlur?.();
      },
      [formOnBlur, onBlur],
    );

    const display =
      children ??
      (selectedOption ? selectedOption.label : placeholder);

    return (
      <button
        ref={mergeRefs(ref, valueRef, formValueRef)}
        id={selectId}
        type="button"
        disabled={disabled}
        className={selectValueClass({
          size,
          muted: !selectedOption,
          className,
          slotClass: slotClassNames.value,
        })}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        {...rest}
      >
        {display}
      </button>
    );
  },
);

SelectValue.displayName = "SelectValue";

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ className, onPointerDown, children, ...rest }, ref) {
    const slotClassNames = useSelectClassNames();
    const { open, setOpen, disabled, size, valueRef } = useSelectContext();
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const bindChevronRef = useChevronRotation(open, triggerRef);

    const setTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        bindChevronRef(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [bindChevronRef, ref],
    );

    const handlePointerDown = useCallback(
      (e: ReactPointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(e);
        e.stopPropagation();
        if (disabled) return;
        if (open) {
          setOpen(false);
          return;
        }
        if (e.button !== 0) return;
        setOpen(true);
        requestAnimationFrame(() => valueRef.current?.focus());
      },
      [disabled, onPointerDown, open, setOpen, valueRef],
    );

    return (
      <button
        type="button"
        ref={setTriggerRef}
        tabIndex={-1}
        disabled={disabled}
        aria-label={selectTriggerAriaLabel(open)}
        className={selectTriggerClass({
          disabled,
          className,
          slotClass: slotClassNames.trigger,
        })}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {children ?? (
          <IoChevronDown
            className={cn(
              SELECT_CHEVRON_ICON[size],
              slotClassNames.triggerIcon,
            )}
            aria-hidden
          />
        )}
      </button>
    );
  },
);

SelectTrigger.displayName = "SelectTrigger";

