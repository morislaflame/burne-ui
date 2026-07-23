import type {
  PointerEvent as ReactPointerEvent,
} from "react";
import { forwardRef, useCallback, useRef } from "react";
import { IoChevronDown } from "react-icons/io5";

import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { Label } from "@/components/core/Label";
import { ListBox } from "@/components/core/ListBox";
import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import { useGlossFieldShellMotion } from "@/components/core/utils/glossInteractiveMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import { useFieldShellHoverLift } from "@/components/core/utils/useFieldShellHoverLift";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";

import { comboBoxTriggerAriaLabel } from "./comboBoxA11y";
import { runComboBoxOpenAfterSqueeze, useComboBoxOpeningRef } from "./comboBoxAnimations";
import { useComboBoxClassNames, useComboBoxContext } from "./comboBoxContext";
import { ComboBoxError, ComboBoxHint } from "./comboBoxFieldParts";
import { COMBOBOX_CHEVRON_ICON, COMBOBOX_LISTBOX_CLASS, COMBOBOX_POPOVER_BODY_CLASS, COMBOBOX_POPOVER_CLASS, comboBoxInputClass, comboBoxInputGroupClass, comboBoxTriggerClass } from "./comboBoxStyles";
import type {
  ComboBoxInputGroupProps,
  ComboBoxInputProps,
  ComboBoxPopoverProps,
  ComboBoxTriggerProps,
} from "./comboBoxTypes";
import { useComboBoxInputState } from "./useComboBoxInputState";

import { cn } from "@/utils/cn";

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
        ref={(node) => {
          mergeForwardedRef(ref, node);
          setAnchorRef(node);
        }}
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
    const {
      comboBoxId,
      open,
      disabled,
      placeholder,
      size,
      status,
      required,
      activeOptionId,
      ariaDescribedBy,
      inputValue,
      isMuted,
      setRefs,
      handleChange,
      handleKeyDown,
      handleBlur,
    } = useComboBoxInputState({ onKeyDown, onChange, onBlur }, ref);

    return (
      <input
        ref={setRefs}
        id={comboBoxId}
        type="text"
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        aria-required={required || undefined}
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
          muted: isMuted,
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
  function ComboBoxTrigger({ className, onPointerDown, children, ...rest }, ref) {
    const labels = useBurneLabels();
    const slotClassNames = useComboBoxClassNames();
    const { open, setOpen, setFilterQuery, disabled, size, inputRef } = useComboBoxContext();
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const bindChevronRef = useChevronRotation(open, triggerRef);

    const setTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        bindChevronRef(node);
        mergeForwardedRef(ref, node);
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
        aria-label={comboBoxTriggerAriaLabel(open, labels)}
        className={comboBoxTriggerClass({
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
              COMBOBOX_CHEVRON_ICON[size],
              slotClassNames.triggerIcon,
            )}
            aria-hidden
          />
        )}
      </button>
    );
  },
);

ComboBoxTrigger.displayName = "ComboBoxTrigger";

export const ComboBoxPopover = forwardRef<HTMLDivElement, ComboBoxPopoverProps>(
  function ComboBoxPopover(
    {
      children,
      className,
      side = "bottom",
      align,
      offset = POPOVER_DEFAULT_OFFSET,
      listBoxProps,
      ...rest
    },
    ref,
  ) {
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

    const {
      className: listBoxClassName,
      classNames: listBoxSlotClassNames,
      style: listBoxStyle,
      ...listBoxRest
    } = listBoxProps ?? {};

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
        side={side}
        anchorRef={anchorRef}
        variant={variant === "gloss" ? "gloss" : "default"}
      >
        <Popover.Content
          ref={ref}
          matchAnchorWidth
          unstyled
          contentRole={undefined}
          align={align}
          offset={offset}
          className={cn(COMBOBOX_POPOVER_CLASS, slotClassNames.popover, className)}
          {...rest}
        >
          <Popover.Body
            className={cn(
              COMBOBOX_POPOVER_BODY_CLASS,
              slotClassNames.popoverBody,
            )}
          >
            <ListBox
              selectionIndicator
              {...listBoxRest}
              listId={listId}
              aria-labelledby={labelConnected ? labelId : undefined}
              aria-label={labelConnected ? undefined : placeholder}
              value={value}
              onValueChange={handleValueChange}
              activeValue={activeValue}
              onActiveValueChange={setActiveValue}
              classNames={{
                item: slotClassNames.listBoxItem,
                label: slotClassNames.listBoxLabel,
                hint: slotClassNames.listBoxHint,
                icon: slotClassNames.listBoxIcon,
                empty: slotClassNames.listBoxEmpty,
                header: slotClassNames.listBoxHeader,
                headerText: slotClassNames.listBoxHeaderText,
                ...listBoxSlotClassNames,
              }}
              className={cn(
                COMBOBOX_LISTBOX_CLASS,
                slotClassNames.listBox,
                listBoxClassName,
              )}
              style={{ maxHeight: menuMaxHeight, ...listBoxStyle }}
            >
              {listContent}
            </ListBox>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    );
  },
);

ComboBoxPopover.displayName = "ComboBoxPopover";


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
  const slotClassNames = useComboBoxClassNames();

  return (
    <>
      {label != null ? (
        <Label id={labelId} classNames={{ root: slotClassNames.label }}>
          {label}
        </Label>
      ) : null}
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

export { ComboBoxError, ComboBoxHint, ComboBoxLabel } from "./comboBoxFieldParts";
