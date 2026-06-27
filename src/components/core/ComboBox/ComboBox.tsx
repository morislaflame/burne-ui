import type {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MutableRefObject,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  Ref,
} from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
} from "react";
import { IoChevronDown } from "react-icons/io5";

import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import { Popover } from "@/components/core/Popover";
import { ListBox } from "@/components/core/ListBox";
import {
  animateGlossInteractivePressSqueeze,
  useGlossFieldShellMotion,
} from "@/components/core/utils/glossInteractiveMotion";
import "../utils/glossInteractive.css";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import { useFieldShellHoverLift, FIELD_SHELL_FOCUS_CLASS, FIELD_SHELL_TRANSITION_CLASS, fieldShellHoverClass } from "@/components/core/utils/useFieldShellHoverLift";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupSegment";
import {
  buttonGroupRoundingClasses,
  buttonGroupSegmentSurfaceClasses,
} from "@/components/composite/ButtonGroup/buttonGroupSegment";
import {
  useOptionalButtonGroupLayout,
  useOptionalButtonGroupSegment,
} from "@/components/composite/ButtonGroup/buttonGroupContext";
import { cn } from "@/utils/cn";

import {
  type ComboBoxOption,
  useComboBoxContext,
} from "./comboBoxContext";
import { comboBoxFilteredValues } from "./comboBoxOptionFilter";

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const r of refs) {
      if (r == null) continue;
      if (typeof r === "function") r(node);
      else (r as MutableRefObject<T | null>).current = node;
    }
  };
}

const VARIANT_SHELL: Record<Exclude<InputVariant, "gloss">, string> = {
  default: "bg-surface",
  outline: "bg-transparent",
};

const STATUS_TINT_SHELL: Record<Exclude<InputStatus, "default">, string> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  warning: "bg-surface-tint-warning",
};

const INPUT_SHELL_H: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.h,
  base: CONTROL_SIZE_LAYOUT.base.h,
  mid: CONTROL_SIZE_LAYOUT.mid.h,
  large: CONTROL_SIZE_LAYOUT.large.h,
};

const INPUT_CONTROL: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.controlPad,
  base: CONTROL_SIZE_LAYOUT.base.controlPad,
  mid: CONTROL_SIZE_LAYOUT.mid.controlPad,
  large: CONTROL_SIZE_LAYOUT.large.controlPad,
};

const CHEVRON_ICON: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.chevronIcon,
  base: CONTROL_SIZE_LAYOUT.base.chevronIcon,
  mid: CONTROL_SIZE_LAYOUT.mid.chevronIcon,
  large: CONTROL_SIZE_LAYOUT.large.chevronIcon,
};

export type ComboBoxInputGroupProps = HTMLAttributes<HTMLDivElement> & {
  groupSegment?: ButtonGroupSegment;
};

export const ComboBoxInputGroup = forwardRef<HTMLDivElement, ComboBoxInputGroupProps>(
  function ComboBoxInputGroup({
    className,
    children,
    groupSegment: groupSegmentProp,
    onPointerEnter,
    onPointerLeave,
    ...rest
  }, ref) {
    const layoutCtx = useOptionalButtonGroupLayout();
    const groupCtx = useOptionalButtonGroupSegment();
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

    const openingRef = useRef(false);

    const statusTinted =
      status === "danger" || status === "success" || status === "warning";

    const isGloss = variant === "gloss";
    const groupSegment = layoutCtx?.segmented
      ? undefined
      : (groupSegmentProp ?? groupCtx?.segment);

    const shellSurface = isGloss
      ? "gloss-control"
      : statusTinted
        ? cn(STATUS_TINT_SHELL[status], "border-token")
        : cn(
            variant === "outline"
              ? "bg-transparent border-token"
              : cn(VARIANT_SHELL[variant], "border-token"),
          );

    const shellHoverLift = useFieldShellHoverLift(anchorRef, !disabled && !isGloss && groupSegment == null);
    const glossShellMotion = useGlossFieldShellMotion(anchorRef, !disabled && isGloss && groupSegment == null);

    const setAnchorRef = useCallback(
      (node: HTMLDivElement | null) => {
        anchorRef.current = node;
        if (!disabled && isGloss) glossShellMotion.bindShellRef(node);
      },
      [anchorRef, disabled, glossShellMotion, isGloss],
    );

    const openAfterSqueeze = useCallback(() => {
      if (disabled || openingRef.current) return;
      openingRef.current = true;
      const el = anchorRef.current;
      if (!el) {
        openingRef.current = false;
        return;
      }
      if (prefersReducedInteractiveHoverLift()) {
        openingRef.current = false;
        setOpen(true);
        return;
      }
      const squeeze = isGloss && groupSegment == null
        ? animateGlossInteractivePressSqueeze(el, true)
        : animateInteractivePressSqueeze(el);
      void squeeze.then(() => {
        openingRef.current = false;
        if (disabled) return;
        setOpen(true);
      });
    }, [anchorRef, disabled, groupSegment, isGloss, setOpen]);

    const groupShellClass = groupSegment
      ? cn(
          buttonGroupRoundingClasses(groupSegment),
          buttonGroupSegmentSurfaceClasses(groupSegment),
        )
      : "rounded-base";

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
        aria-controls={listId}
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
          isGloss && !disabled && groupSegment == null ? glossShellMotion.onShellFocusIn : undefined
        }
        onBlurCapture={
          isGloss && !disabled && groupSegment == null ? glossShellMotion.onShellFocusOut : undefined
        }
        {...(disabled && isGloss ? { "data-gloss-disabled": "" } : {})}
        className={cn(
          "relative z-0 flex min-w-0 items-stretch border-1 text-left",
          groupSegment?.orientation === "horizontal" ? "flex-1" : "w-full",
          "overflow-hidden motion-reduce:transition-none",
          INPUT_SHELL_H[size],
          groupShellClass,
          shellSurface,
          FIELD_SHELL_TRANSITION_CLASS,
          FIELD_SHELL_FOCUS_CLASS,
          isGloss ? "" : fieldShellHoverClass(!disabled, status),
          isGloss
            ? glossShellMotion.shellHoverMotionClass
            : shellHoverLift.shellHoverMotionClass,
          disabled ? "cursor-not-allowed opacity-55 shadow-token-sm" : "cursor-pointer",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ComboBoxInputGroup.displayName = "ComboBoxInputGroup";

export type ComboBoxInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "size"
>;

export const ComboBoxInput = forwardRef<HTMLInputElement, ComboBoxInputProps>(
  function ComboBoxInput({ className, onKeyDown, onChange, ...rest }, ref) {
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
    } = ctx;

    const openingRef = useRef(false);
    const queuedFilterCharRef = useRef<string | null>(null);

    const optionsByValue = useMemo(
      () => new Map(options.map((o) => [o.value, o])),
      [options],
    );

    const selectedOption = useMemo(
      () => optionsByValue.get(value),
      [optionsByValue, value],
    );

    const selectedDisplayString = useMemo(() => {
      if (!selectedOption) return "";
      if (typeof selectedOption.label === "string") return selectedOption.label;
      if (selectedOption.filterText) return selectedOption.filterText;
      return selectedOption.value;
    }, [selectedOption]);

    const activeOptionId =
      open && activeValue ? `${listId}-opt-${activeValue}` : undefined;

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
      if (disabled || openingRef.current) return;
      openingRef.current = true;
      const el = ctx.anchorRef.current;
      if (!el) {
        openingRef.current = false;
        return;
      }
      if (prefersReducedInteractiveHoverLift()) {
        openingRef.current = false;
        setOpen(true);
        finishOpen();
        return;
      }
      void animateInteractivePressSqueeze(el).then(() => {
        openingRef.current = false;
        if (disabled) return;
        setOpen(true);
        finishOpen();
      });
    }, [ctx.anchorRef, disabled, finishOpen, setOpen]);

    const bumpActive = useCallback(
      (delta: number) => {
        if (filteredValues.length === 0) return;
        const idx = activeValue ? filteredValues.indexOf(activeValue) : -1;
        let j = idx < 0 ? 0 : idx;
        for (let step = 0; step < filteredValues.length; step += 1) {
          j = (j + delta + filteredValues.length) % filteredValues.length;
          const v = filteredValues[j];
          const opt = optionsByValue.get(v);
          if (v && opt && !opt.disabled) {
            setActiveValue(v);
            return;
          }
        }
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
          for (const v of filteredValues) {
            const opt = optionsByValue.get(v);
            if (opt && !opt.disabled) {
              setActiveValue(v);
              break;
            }
          }
          return;
        }
        if (e.key === "End") {
          e.preventDefault();
          for (let i = filteredValues.length - 1; i >= 0; i -= 1) {
            const v = filteredValues[i]!;
            const opt = optionsByValue.get(v);
            if (opt && !opt.disabled) {
              setActiveValue(v);
              break;
            }
          }
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

    return (
      <input
        ref={mergeRefs(ref, inputRef)}
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
        className={cn(
          "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted",
          INPUT_CONTROL[size],
          !open && !selectedOption && "text-muted",
          className,
        )}
        {...rest}
      />
    );
  },
);

ComboBoxInput.displayName = "ComboBoxInput";

export type ComboBoxTriggerProps = HTMLAttributes<HTMLButtonElement>;

export const ComboBoxTrigger = forwardRef<HTMLButtonElement, ComboBoxTriggerProps>(
  function ComboBoxTrigger({ className, onPointerDown, ...rest }, ref) {
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
        aria-label={open ? "Закрыть список" : "Открыть список"}
        className={cn(
          "flex shrink-0 origin-center items-center justify-center self-stretch px-small outline-none",
          "text-muted hover:text-foreground focus-ring",
          disabled && "pointer-events-none",
          className,
        )}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        <IoChevronDown className={CHEVRON_ICON[size]} aria-hidden />
      </button>
    );
  },
);

ComboBoxTrigger.displayName = "ComboBoxTrigger";

export type ComboBoxPopoverProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  offset?: number;
};

export function ComboBoxPopover({ children, className, offset = 6, ...rest }: ComboBoxPopoverProps) {
  const {
    open,
    setOpen,
    anchorRef,
    listId,
    menuMaxHeight,
    options,
    filteredValues,
    value,
    setValue,
    activeValue,
    setActiveValue,
    setFilterQuery,
    setOpen: closeOnSelect,
    variant,
  } = useComboBoxContext();

  const handleValueChange = useCallback(
    (next: string | string[]) => {
      const v = Array.isArray(next) ? next[0] ?? "" : next;
      setValue(v);
      setFilterQuery("");
      closeOnSelect(false);
    },
    [closeOnSelect, setFilterQuery, setValue],
  );

  const listContent =
    children ??
    (filteredValues.length === 0 ? (
      <ListBox.Empty />
    ) : (
      filteredValues.map((v) => {
        const opt = options.find((o) => o.value === v)!;
        return (
          <ListBox.Item key={v} value={v} disabled={opt.disabled} label={opt.label} hint={opt.hint} icon={opt.icon} />
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
        className={cn("z-[100]", className)}
        {...rest}
      >
        <Popover.Body className="gap-0 p-base">
          <ListBox
            listId={listId}
            value={value}
            onValueChange={handleValueChange}
            activeValue={activeValue}
            onActiveValueChange={setActiveValue}
            selectionIndicator
            className="overflow-y-auto overflow-x-hidden"
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

export type ComboBoxOptionsProps = {
  options: ComboBoxOption[];
};
