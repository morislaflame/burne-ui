import type {
  PointerEvent as ReactPointerEvent,
} from "react";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import { IoChevronDown } from "react-icons/io5";

import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { Field } from "@/components/core/Field";
import { ListBox } from "@/components/core/ListBox";
import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { mergeMotionSlotMaps, useMotionPart } from "@/components/core/utils/slotMotion";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import { focusElement } from "@/components/core/utils/focusElement";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";

import {
  resolveComboBoxMotionDefaults,
  resolveComboBoxMotionParams,
  useComboBoxShellAnimations,
} from "./comboBoxAnimations";
import { comboBoxTriggerAriaLabel } from "./comboBoxA11y";
import {
  ComboBoxMotionProvider,
  useComboBoxClassNames,
  useComboBoxContext,
  useOptionalComboBoxMotionScope,
} from "./comboBoxContext";
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
      motion,
      ...rest
    },
    ref,
  ) {
    const layoutCtx = useOptionalButtonGroupLayout();
    const groupCtx = useOptionalButtonGroupSegment();
    const ctx = useComboBoxContext();
    const { disabled, variant } = ctx;
    const groupSegment = layoutCtx?.segmented
      ? undefined
      : (groupSegmentProp ?? groupCtx?.segment);
    const isGloss = variant === "gloss";
    const pointerInsideRef = useRef(false);
    const parentScope = useOptionalComboBoxMotionScope();
    const motionDefaults = useMemo(
      () => resolveComboBoxMotionDefaults({ isGloss, disabled, groupSegment }),
      [disabled, groupSegment, isGloss],
    );
    const motionParams = useMemo(
      () =>
        resolveComboBoxMotionParams({
          disabled,
          isGloss,
          groupSegment,
          pointerInside: pointerInsideRef,
        }),
      [disabled, groupSegment, isGloss],
    );
    const mergedMotion = mergeMotionSlotMaps(
      parentScope?.getRootMotion(),
      motion ? { inputGroup: motion } : undefined,
    );

    return (
      <ComboBoxMotionProvider motion={mergedMotion} defaults={motionDefaults} params={motionParams}>
        <ComboBoxInputGroupSurface
          forwardedRef={ref}
          className={className}
          groupSegment={groupSegment}
          pointerInsideRef={pointerInsideRef}
          shellPartMotion={motion}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          rest={rest}
        >
          {children}
        </ComboBoxInputGroupSurface>
      </ComboBoxMotionProvider>
    );
  },
);

ComboBoxInputGroup.displayName = "ComboBoxInputGroup";

function ComboBoxInputGroupSurface({
  forwardedRef,
  className,
  children,
  groupSegment,
  pointerInsideRef,
  shellPartMotion,
  onPointerEnter,
  onPointerLeave,
  rest,
}: {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  className?: string;
  children?: React.ReactNode;
  groupSegment: ComboBoxInputGroupProps["groupSegment"];
  pointerInsideRef: React.MutableRefObject<boolean>;
  shellPartMotion?: ComboBoxInputGroupProps["motion"];
  onPointerEnter?: ComboBoxInputGroupProps["onPointerEnter"];
  onPointerLeave?: ComboBoxInputGroupProps["onPointerLeave"];
  rest: Omit<
    ComboBoxInputGroupProps,
    | "className"
    | "children"
    | "groupSegment"
    | "onPointerEnter"
    | "onPointerLeave"
    | "motion"
  >;
}) {
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

  const {
    bindShellRef,
    squeezeThenOpen,
    shellPointerUp,
    shellPointerEnter,
    shellPointerLeave,
    shellFocusCapture,
    shellBlurCapture,
    shellHoverMotionClass,
    glossDisabledAttr,
  } = useComboBoxShellAnimations({
    shellRef: anchorRef,
    disabled,
    variant,
    groupSegment,
    motion: shellPartMotion,
    pointerInsideRef,
  });

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (open) return;
      if (e.button !== 0) return;
      squeezeThenOpen({ setOpen });
    },
    [disabled, open, setOpen, squeezeThenOpen],
  );

  return (
    <div
      ref={(node) => {
        mergeForwardedRef(forwardedRef, node);
        bindShellRef(node);
      }}
      role="combobox"
      aria-expanded={open}
      aria-controls={open ? listId : undefined}
      aria-haspopup="listbox"
      aria-disabled={disabled || undefined}
      onPointerDown={handlePointerDown}
      onPointerUp={shellPointerUp}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (e.defaultPrevented) return;
        shellPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        if (e.defaultPrevented) return;
        shellPointerLeave?.(e);
      }}
      onFocusCapture={shellFocusCapture}
      onBlurCapture={shellBlurCapture}
      {...glossDisabledAttr}
      className={comboBoxInputGroupClass({
        size,
        variant,
        status,
        disabled,
        groupSegment,
        shellHoverMotionClass,
        className,
        slotClass: slotClassNames.inputGroup,
      })}
      {...rest}
    >
      {children}
    </div>
  );
}

export const ComboBoxInput = forwardRef<HTMLInputElement, ComboBoxInputProps>(
  function ComboBoxInput({ className, onKeyDown, onChange, onBlur, motion, ...rest }, ref) {
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

    const { setRef, pointerHandlers } = useMotionPart<HTMLInputElement>({
      scope: useOptionalComboBoxMotionScope(),
      slot: "input",
      motion,
      forwardedRef: setRefs,
      pointerPhases: true,
    });

    return (
      <input
        ref={setRef}
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
        {...pointerHandlers}
      />
    );
  },
);

ComboBoxInput.displayName = "ComboBoxInput";

function ComboBoxTriggerIcon({ size }: { size: "small" | "base" | "mid" | "large" }) {
  const slotClassNames = useComboBoxClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalComboBoxMotionScope(),
    slot: "triggerIcon",
    pointerPhases: true,
  });

  return (
    <span ref={setRef} {...pointerHandlers}>
      <IoChevronDown
        className={cn(
          COMBOBOX_CHEVRON_ICON[size],
          slotClassNames.triggerIcon,
        )}
        aria-hidden
      />
    </span>
  );
}

export const ComboBoxTrigger = forwardRef<HTMLButtonElement, ComboBoxTriggerProps>(
  function ComboBoxTrigger({ className, onPointerDown, children, motion, ...rest }, ref) {
    const labels = useBurneLabels();
    const slotClassNames = useComboBoxClassNames();
    const { open, setOpen, setFilterQuery, disabled, size, inputRef } = useComboBoxContext();
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const bindChevronRef = useChevronRotation(open, triggerRef);
    const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
      scope: useOptionalComboBoxMotionScope(),
      slot: "trigger",
      motion,
      pointerPhases: true,
      pressPhases: true,
      onPointerDown: (e) => {
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
        requestAnimationFrame(() => focusElement(inputRef.current));
      },
    });

    const setTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        bindChevronRef(node);
        triggerRef.current = node;
        setRef(node);
        mergeForwardedRef(ref, node);
      },
      [bindChevronRef, ref, setRef],
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
        {...rest}
        {...pointerHandlers}
      >
        {children ?? <ComboBoxTriggerIcon size={size} />}
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
      size,
    } = useComboBoxContext();

    const {
      className: listBoxClassName,
      classNames: listBoxSlotClassNames,
      style: listBoxStyle,
      size: listBoxSize,
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
              indicator
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
              size={listBoxSize ?? size}
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
        <Field.Label id={labelId} classNames={{ root: slotClassNames.label }}>
          {label}
        </Field.Label>
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
