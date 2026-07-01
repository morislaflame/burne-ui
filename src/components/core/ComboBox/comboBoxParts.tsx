import type {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
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

import { comboBoxActiveOptionId, comboBoxTriggerAriaLabel } from "./comboBoxA11y";
import {
  runComboBoxOpenAfterSqueeze,
  useComboBoxOpeningRef,
} from "./comboBoxAnimations";
import {
  comboBoxBumpActiveValue,
  comboBoxFilteredValues,
  comboBoxFirstEnabledValue,
  comboBoxLastEnabledValue,
  comboBoxOptionDisplayString,
  comboBoxOptionsByValue,
  comboBoxResolveHintStatus,
  mergeComboBoxSlotClass,
  mergeRefs,
} from "./comboBoxAPI";
import {
  useComboBoxClassNames,
  useComboBoxContext,
  useComboBoxFieldContext,
} from "./comboBoxContext";
import {
  COMBOBOX_CHEVRON_ICON,
  COMBOBOX_LISTBOX_CLASS,
  COMBOBOX_POPOVER_BODY_CLASS,
  COMBOBOX_POPOVER_CLASS,
  comboBoxInputClass,
  comboBoxInputGroupClass,
  comboBoxTriggerClass,
} from "./comboBoxStyles";
import type {
  ComboBoxErrorProps,
  ComboBoxHintProps,
  ComboBoxInputGroupProps,
  ComboBoxInputProps,
  ComboBoxPopoverProps,
  ComboBoxTriggerProps,
} from "./comboBoxTypes";

export const ComboBoxInputGroup = forwardRef<HTMLDivElement, ComboBoxInputGroupProps>(
  function ComboBoxInputGroup(
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
    const slotClassNames = useComboBoxClassNames();
    const ctx = useComboBoxContext();
    const {
      open,
      setOpen,
      disabled,
      variant,
      status,
      size,
      anchorRef,
      listId,
    } = ctx;

    const openingRef = useComboBoxOpeningRef();
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

    const openAfterSqueeze = useCallback(() => {
      runComboBoxOpenAfterSqueeze({
        anchorRef,
        disabled,
        isGloss,
        groupSegment,
        setOpen,
        openingRef,
      });
    }, [anchorRef, disabled, groupSegment, isGloss, setOpen, openingRef]);

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
        className={comboBoxInputGroupClass({
          size,
          variant,
          status,
          disabled,
          groupSegment,
          shellHoverMotionClass: isGloss
            ? glossShellMotion.shellHoverMotionClass
            : shellHoverLift.shellHoverMotionClass,
          className,
          slotClass: slotClassNames.inputGroup,
        })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ComboBoxInputGroup.displayName = "ComboBoxInputGroup";

export const ComboBoxInput = forwardRef<HTMLInputElement, ComboBoxInputProps>(
  function ComboBoxInput({ className, onKeyDown, onChange, onBlur, ...rest }, ref) {
    const slotClassNames = useComboBoxClassNames();
    const ctx = useComboBoxContext();
    const {
      comboBoxId,
      open,
      setOpen,
      value,
      setValue,
      filterQuery,
      setFilterQuery,
      listId,
      activeValue,
      setActiveValue,
      inputRef,
      anchorRef,
      options,
      filteredValues,
      disabled,
      placeholder,
      size,
      status,
      isRequired,
      hintConnected,
      errorConnected,
      hintId,
      errorId,
      variant,
      formInputRef,
      formOnBlur,
    } = ctx;

    const openingRef = useComboBoxOpeningRef();
    const queuedFilterCharRef = useRef<string | null>(null);
    const isGloss = variant === "gloss";

    const optionsByValue = useMemo(
      () => comboBoxOptionsByValue(options),
      [options],
    );

    const selectedOption = useMemo(
      () => optionsByValue.get(value),
      [optionsByValue, value],
    );

    const selectedDisplayString = useMemo(
      () => comboBoxOptionDisplayString(selectedOption),
      [selectedOption],
    );

    const activeOptionId = comboBoxActiveOptionId(listId, open, activeValue);

    const ariaDescribedBy = joinFieldDescribedBy(
      hintConnected ? hintId : undefined,
      errorConnected ? errorId : undefined,
    );

    const finishOpen = useCallback(() => {
      const append = queuedFilterCharRef.current;
      queuedFilterCharRef.current = null;
      const nextQ = append ?? "";
      setFilterQuery(nextQ);

      const fi = comboBoxFilteredValues(options, nextQ);
      const selectedIdx = fi.indexOf(value);
      setActiveValue(selectedIdx >= 0 ? value : fi[0] ?? null);

      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;
        el.focus();
        const len = nextQ.length;
        el.setSelectionRange(len, len);
      });
    }, [inputRef, options, setActiveValue, setFilterQuery, value]);

    const openAfterSqueeze = useCallback(() => {
      runComboBoxOpenAfterSqueeze({
        anchorRef,
        disabled,
        isGloss,
        setOpen,
        onOpened: finishOpen,
        openingRef,
        preferStandardSqueeze: true,
      });
    }, [anchorRef, disabled, finishOpen, isGloss, setOpen, openingRef]);

    const bumpActive = useCallback(
      (delta: number) => {
        const next = comboBoxBumpActiveValue({
          filteredValues,
          activeValue,
          optionsByValue,
          delta,
        });
        if (next) setActiveValue(next);
      },
      [activeValue, filteredValues, optionsByValue, setActiveValue],
    );

    const selectValue = useCallback(
      (next: string) => {
        const opt = optionsByValue.get(next);
        if (!opt || opt.disabled) return;
        setValue(next);
        setOpen(false);
        setFilterQuery("");
        inputRef.current?.focus();
      },
      [inputRef, optionsByValue, setFilterQuery, setOpen, setValue],
    );

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        if (!open) return;
        setFilterQuery(e.target.value);
      },
      [onChange, open, setFilterQuery],
    );

    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || disabled) return;
        if (e.nativeEvent.isComposing) return;

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
          if (
            e.key.length === 1 &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.altKey &&
            e.key !== "Tab"
          ) {
            e.preventDefault();
            queuedFilterCharRef.current = e.key;
            openAfterSqueeze();
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
        if (e.key === "Enter") {
          e.preventDefault();
          if (activeValue) selectValue(activeValue);
          return;
        }
        if (e.key === "Home") {
          e.preventDefault();
          const first = comboBoxFirstEnabledValue(filteredValues, optionsByValue);
          if (first) setActiveValue(first);
          return;
        }
        if (e.key === "End") {
          e.preventDefault();
          const last = comboBoxLastEnabledValue(filteredValues, optionsByValue);
          if (last) setActiveValue(last);
        }
      },
      [
        activeValue,
        bumpActive,
        disabled,
        filteredValues,
        onKeyDown,
        open,
        openAfterSqueeze,
        optionsByValue,
        selectValue,
        setActiveValue,
      ],
    );

    useEffect(() => {
      if (open) return;
      setFilterQuery("");
    }, [open, setFilterQuery]);

    const inputValue = open ? filterQuery : selectedDisplayString;

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        onBlur?.(e);
        formOnBlur?.();
      },
      [formOnBlur, onBlur],
    );

    return (
      <input
        ref={mergeRefs(ref, inputRef, formInputRef)}
        id={comboBoxId}
        type="text"
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        aria-required={isRequired || undefined}
        aria-invalid={status === "danger" ? true : undefined}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        readOnly={!open}
        autoComplete="off"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={comboBoxInputClass({
          size,
          muted: !open && !selectedOption,
          className,
          slotClass: slotClassNames.input,
        })}
        {...rest}
      />
    );
  },
);

ComboBoxInput.displayName = "ComboBoxInput";

export const ComboBoxTrigger = forwardRef<HTMLButtonElement, ComboBoxTriggerProps>(
  function ComboBoxTrigger({ className, onPointerDown, ...rest }, ref) {
    const slotClassNames = useComboBoxClassNames();
    const { open, setOpen, setFilterQuery, disabled, size, inputRef } = useComboBoxContext();
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
          setFilterQuery("");
          return;
        }
        if (e.button !== 0) return;
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      },
      [disabled, inputRef, onPointerDown, open, setFilterQuery, setOpen],
    );

    return (
      <button
        type="button"
        ref={setTriggerRef}
        tabIndex={-1}
        disabled={disabled}
        aria-label={comboBoxTriggerAriaLabel(open)}
        className={comboBoxTriggerClass({
          disabled,
          className,
          slotClass: slotClassNames.trigger,
        })}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        <IoChevronDown
          className={mergeComboBoxSlotClass(
            COMBOBOX_CHEVRON_ICON[size],
            slotClassNames.triggerIcon,
          )}
          aria-hidden
        />
      </button>
    );
  },
);

ComboBoxTrigger.displayName = "ComboBoxTrigger";

export function ComboBoxPopover({
  children,
  className,
  offset = POPOVER_DEFAULT_OFFSET,
  ...rest
}: ComboBoxPopoverProps) {
  const slotClassNames = useComboBoxClassNames();
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
    filteredValues,
    value,
    setValue,
    activeValue,
    setActiveValue,
    setFilterQuery,
    variant,
  } = useComboBoxContext();

  const handleValueChange = useCallback(
    (next: string | string[]) => {
      const v = Array.isArray(next) ? (next[0] ?? "") : next;
      setValue(v);
      setFilterQuery("");
      setOpen(false);
    },
    [setFilterQuery, setOpen, setValue],
  );

  const listContent =
    children ??
    (filteredValues.length === 0 ? (
      <ListBox.Empty />
    ) : (
      filteredValues.map((v) => {
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
        className={mergeComboBoxSlotClass(COMBOBOX_POPOVER_CLASS, slotClassNames.popover, className)}
        {...rest}
      >
        <Popover.Body
          className={mergeComboBoxSlotClass(
            COMBOBOX_POPOVER_BODY_CLASS,
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
            className={mergeComboBoxSlotClass(
              COMBOBOX_LISTBOX_CLASS,
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

ComboBoxPopover.displayName = "ComboBoxPopover";

export function ComboBoxHint({
  children,
  status,
  className,
  id: idProp,
  ...rest
}: ComboBoxHintProps) {
  const field = useComboBoxFieldContext();
  const slotClassNames = useComboBoxClassNames();
  const hintStatus = comboBoxResolveHintStatus(status, field.status);

  return (
    <FieldHint
      id={idProp ?? field.hintId}
      status={hintStatus}
      className={mergeComboBoxSlotClass(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

ComboBoxHint.displayName = "ComboBoxHint";

export function ComboBoxError({
  children,
  className,
  id: idProp,
  ...rest
}: ComboBoxErrorProps) {
  const field = useComboBoxFieldContext();
  const slotClassNames = useComboBoxClassNames();

  return (
    <FieldError
      id={idProp ?? field.errorId}
      className={mergeComboBoxSlotClass(slotClassNames.error, className)}
      {...rest}
    >
      {children ?? field.errorMessage}
    </FieldError>
  );
}

ComboBoxError.displayName = "ComboBox.Error";

export function ComboBoxSimpleBody({
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
      <ComboBoxInputGroup>
        <ComboBoxInput />
        <ComboBoxTrigger />
      </ComboBoxInputGroup>
      <ComboBoxPopover />
      {hint != null ? <ComboBoxHint>{hint}</ComboBoxHint> : null}
      {error != null ? <ComboBoxError>{error}</ComboBoxError> : null}
    </>
  );
}
