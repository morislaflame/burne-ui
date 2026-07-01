import type {
  FocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { IoChevronDown } from "react-icons/io5";

import {
  useOptionalButtonGroupLayout,
  useOptionalButtonGroupSegment,
} from "@/components/composite/ButtonGroup/buttonGroupContext";
import { FieldError, FieldHint } from "@/components/core/Field";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { Label } from "@/components/core/Label";
import { ListBox } from "@/components/core/ListBox";
import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import { useGlossFieldShellMotion } from "@/components/core/utils/glossInteractiveMotion";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import { useFieldShellHoverLift } from "@/components/core/utils/useFieldShellHoverLift";

import { selectActiveOptionId, selectTriggerAriaLabel } from "./selectA11y";
import {
  runSelectOpenAfterSqueeze,
  useSelectOpeningRef,
} from "./selectAnimations";
import {
  mergeRefs,
  mergeSelectSlotClass,
  selectBumpActiveValue,
  selectFirstEnabledValue,
  selectLastEnabledValue,
  selectOptionsByValue,
  selectResolveHintStatus,
} from "./selectAPI";
import {
  useSelectClassNames,
  useSelectContext,
  useSelectFieldContext,
} from "./selectContext";
import {
  SELECT_CHEVRON_ICON,
  SELECT_LISTBOX_CLASS,
  SELECT_POPOVER_BODY_CLASS,
  SELECT_POPOVER_CLASS,
  selectTriggerClass,
  selectTriggerGroupClass,
  selectValueClass,
} from "./selectStyles";
import type {
  SelectErrorProps,
  SelectHintProps,
  SelectPopoverProps,
  SelectTriggerGroupProps,
  SelectTriggerProps,
  SelectValueProps,
} from "./selectTypes";

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
      size,
      anchorRef,
      listId,
      valueRef,
      value,
      optionValues,
      setActiveValue,
    } = ctx;

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
        aria-disabled={disabled || undefined}
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
          size,
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
      listId,
      activeValue,
      setActiveValue,
      valueRef,
      anchorRef,
      options,
      optionValues,
      disabled,
      placeholder: contextPlaceholder,
      size,
      status,
      isRequired,
      hintConnected,
      errorConnected,
      hintId,
      errorId,
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

    const activeOptionId = selectActiveOptionId(listId, open, activeValue);

    const ariaDescribedBy = joinFieldDescribedBy(
      hintConnected ? hintId : undefined,
      errorConnected ? errorId : undefined,
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
        aria-activedescendant={activeOptionId}
        aria-required={isRequired || undefined}
        aria-invalid={status === "danger" ? true : undefined}
        aria-describedby={ariaDescribedBy}
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
  function SelectTrigger({ className, onPointerDown, ...rest }, ref) {
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
        <IoChevronDown
          className={mergeSelectSlotClass(
            SELECT_CHEVRON_ICON[size],
            slotClassNames.triggerIcon,
          )}
          aria-hidden
        />
      </button>
    );
  },
);

SelectTrigger.displayName = "SelectTrigger";

export function SelectPopover({
  children,
  className,
  offset = POPOVER_DEFAULT_OFFSET,
  ...rest
}: SelectPopoverProps) {
  const slotClassNames = useSelectClassNames();
  const {
    open,
    setOpen,
    anchorRef,
    listId,
    labelId,
    labelConnected,
    placeholder,
    menuMaxHeight,
    options,
    optionValues,
    value,
    setValue,
    activeValue,
    setActiveValue,
    variant,
  } = useSelectContext();

  const handleValueChange = useCallback(
    (next: string | string[]) => {
      const v = Array.isArray(next) ? (next[0] ?? "") : next;
      setValue(v);
      setOpen(false);
    },
    [setOpen, setValue],
  );

  const listContent =
    children ??
    (optionValues.length === 0 ? (
      <ListBox.Empty />
    ) : (
      optionValues.map((v) => {
        const opt = options.find((o) => o.value === v)!;
        return (
          <ListBox.Item
            key={v}
            value={v}
            disabled={opt.disabled}
            label={opt.label}
            hint={opt.hint}
            icon={opt.icon}
          />
        );
      })
    ));

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      side="bottom"
      anchorRef={anchorRef}
      variant={variant === "gloss" ? "gloss" : "default"}
    >
      <Popover.Content
        matchAnchorWidth
        unstyled
        contentRole={undefined}
        offset={offset}
        className={mergeSelectSlotClass(SELECT_POPOVER_CLASS, slotClassNames.popover, className)}
        {...rest}
      >
        <Popover.Body
          className={mergeSelectSlotClass(
            SELECT_POPOVER_BODY_CLASS,
            slotClassNames.popoverBody,
          )}
        >
          <ListBox
            listId={listId}
            aria-labelledby={labelConnected ? labelId : undefined}
            aria-label={labelConnected ? undefined : placeholder}
            value={value}
            onValueChange={handleValueChange}
            activeValue={activeValue}
            onActiveValueChange={setActiveValue}
            selectionIndicator
            className={mergeSelectSlotClass(
              SELECT_LISTBOX_CLASS,
              slotClassNames.listBox,
            )}
            style={{ maxHeight: menuMaxHeight }}
          >
            {listContent}
          </ListBox>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}

SelectPopover.displayName = "SelectPopover";

export function SelectHint({
  children,
  status,
  className,
  id: idProp,
  ...rest
}: SelectHintProps) {
  const field = useSelectFieldContext();
  const slotClassNames = useSelectClassNames();
  const hintStatus = selectResolveHintStatus(status, field.status);

  return (
    <FieldHint
      id={idProp ?? field.hintId}
      status={hintStatus}
      className={mergeSelectSlotClass(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

SelectHint.displayName = "SelectHint";

export function SelectError({
  children,
  className,
  id: idProp,
  ...rest
}: SelectErrorProps) {
  const field = useSelectFieldContext();
  const slotClassNames = useSelectClassNames();

  return (
    <FieldError
      id={idProp ?? field.errorId}
      className={mergeSelectSlotClass(slotClassNames.error, className)}
      {...rest}
    >
      {children ?? field.errorMessage}
    </FieldError>
  );
}

SelectError.displayName = "Select.Error";

export function SelectSimpleBody({
  label,
  hint,
  error,
  labelId,
}: {
  label: React.ReactNode;
  hint: React.ReactNode;
  error: React.ReactNode;
  labelId: string;
}) {
  return (
    <>
      {label != null ? <Label id={labelId}>{label}</Label> : null}
      <SelectTriggerGroup>
        <SelectValue />
        <SelectTrigger />
      </SelectTriggerGroup>
      <SelectPopover />
      {hint != null ? <SelectHint>{hint}</SelectHint> : null}
      {error != null ? <SelectError>{error}</SelectError> : null}
    </>
  );
}
