import type {
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import { dataGroupSegment, dataOpenState, dataVariantProps } from "@/components/core/utils/dataContract";
import { ariaInvalidValue, fieldPaintStatus, useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";
import { KitChevronDown } from "@/components/core/utils/kitIcons";
 
import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { useSkinRegistryRevision } from "@/skins/skinContext";
import { ListBox } from "@/components/core/ListBox";
import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { mergeMotionSlotMaps, mergeMotionRootSiblings, useMotionPart, type MotionController, type MotionStateHostProps } from "@/components/core/utils/slotMotion";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import { focusElement } from "@/components/core/utils/focusElement";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";
 
import {
  resolveComboBoxMotionDefaults,
  resolveComboBoxMotionParams,
  resolveComboBoxPopoverPanelMotion,
  useComboBoxShellAnimations,
} from "./comboBoxAnimations";
import { comboBoxTriggerAriaLabel } from "./comboBoxA11y";
import {
  ComboBoxMotionProvider,
  useComboBoxClassNames,
  useComboBoxContext,
  useOptionalComboBoxMotionScope,
} from "./comboBoxContext";
import { ComboBoxError, ComboBoxHint, ComboBoxLabel } from "./comboBoxFieldParts";
import { COMBOBOX_LISTBOX_CLASS, COMBOBOX_LOADING_CLASS, COMBOBOX_POPOVER_BODY_CLASS, COMBOBOX_POPOVER_CLASS, comboBoxInputClass, comboBoxInputGroupClass, comboBoxTriggerClass, comboBoxTriggerIconClass, comboBoxTriggerIconWrapClass } from "./comboBoxStyles";
import type {
  ComboBoxShellProps,
  ComboBoxInputProps,
  ComboBoxPopoverProps,
  ComboBoxTriggerProps,
} from "./comboBoxTypes";
import { useComboBoxInputState } from "./useComboBoxInputState";
 
import { cn } from "@/utils/cn";
 
export const ComboBoxShell = forwardRef<HTMLDivElement, ComboBoxShellProps>(
  function ComboBoxShell(
    {
      className,
      children,
      groupSegment: groupSegmentProp,
      onPointerEnter,
      onPointerLeave,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
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
    const pointerInsideRef = useRef(false);
    const parentScope = useOptionalComboBoxMotionScope();
    const skinRevision = useSkinRegistryRevision();
    const motionDefaults = useMemo(() => {
      void skinRevision;
      return resolveComboBoxMotionDefaults({ variant, disabled, groupSegment });
    }, [disabled, groupSegment, skinRevision, variant]);
    const motionParams = useMemo(
      () =>
        resolveComboBoxMotionParams({
          variant,
          disabled,
          groupSegment,
          pointerInside: pointerInsideRef,
        }),
      [disabled, groupSegment, variant],
    );
    const mergedSlots = mergeMotionSlotMaps(
      parentScope?.getRootMotion(),
      motion ? { shell: motion } : undefined,
    );
    const siblings = mergeMotionRootSiblings({
      events: parentScope?.getEvents(),
      states: parentScope?.getStates(),
    });
    const mergedMotion = { ...mergedSlots, ...siblings };
 
    return (
      <ComboBoxMotionProvider
        motion={mergedMotion}
        defaults={motionDefaults}
        params={motionParams}
        controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
        <ComboBoxShellSurface
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
        </ComboBoxShellSurface>
      </ComboBoxMotionProvider>
    );
  },
);
 
ComboBoxShell.displayName = "ComboBox.Shell";
 
function ComboBoxShellSurface({
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
  groupSegment: ComboBoxShellProps["groupSegment"];
  pointerInsideRef: React.MutableRefObject<boolean>;
  shellPartMotion?: ComboBoxShellProps["motion"];
  onPointerEnter?: ComboBoxShellProps["onPointerEnter"];
  onPointerLeave?: ComboBoxShellProps["onPointerLeave"];
  rest: Omit<
    ComboBoxShellProps,
    | "className"
    | "children"
    | "groupSegment"
    | "onPointerEnter"
    | "onPointerLeave"
    | "motion"
    | "motionController"
  >;
}) {
  const slotClassNames = useComboBoxClassNames();
  const ctx = useComboBoxContext();
  const {
    open,
    setOpen,
    disabled,
    variant,
    invalid,
    errorConnected,
    formInvalid,
    size,
    anchorRef,
  } = ctx;
  const isInvalid = useResolvedFieldInvalid({ invalid, errorConnected, formInvalid });
  const visualStatus = fieldPaintStatus(isInvalid);
 
  const {
    bindShellRef,
    squeezeThenOpen,
    shellPointerUp,
    shellPointerEnter,
    shellPointerLeave,
    shellHoverMotionClass,
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
      className={comboBoxInputGroupClass({
        size,
        variant,
        status: visualStatus,
        disabled,
        groupSegment,
        shellHoverMotionClass,
        className,
        slotClass: slotClassNames.shell,
      })}
      {...rest}
      {...dataVariantProps({ size, variant })}
      data-group-segment={dataGroupSegment(groupSegment != null)}
    >
      {children}
    </div>
  );
}
 
export const ComboBoxInput = forwardRef<HTMLInputElement, ComboBoxInputProps>(
  function ComboBoxInput({ className, onKeyDown, onChange, onBlur, motion, onPointerOver, onPointerOut, onPointerDown, onPointerUp, ...rest }, ref) {
    const slotClassNames = useComboBoxClassNames();
    const {
      comboBoxId,
      open,
      disabled,
      readOnly,
      placeholder,
      size,
      required,
      listId,
      isInvalid,
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
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <input
        ref={setRef}
        id={comboBoxId}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-haspopup="listbox"
        aria-activedescendant={activeOptionId}
        aria-required={required || undefined}
        aria-invalid={ariaInvalidValue(isInvalid)}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        readOnly={readOnly}
        aria-readonly={readOnly || undefined}
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
        data-state={dataOpenState(open)}
        data-invalid={isInvalid ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
      />
    );
  },
);
 
ComboBoxInput.displayName = "ComboBoxInput";
 
function ComboBoxTriggerIcon({
  size,
  children,
}: {
  size: "small" | "base" | "mid" | "large";
  children?: ReactNode;
}) {
  const slotClassNames = useComboBoxClassNames();
  const { open } = useComboBoxContext();
  const scope = useOptionalComboBoxMotionScope();
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const bindChevronRef = useChevronRotation(open, iconRef, undefined, undefined, scope, "triggerIconWrap");
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "triggerIconWrap",
    pointerPhases: true,
  });
  const setIconRef = useCallback(
    (node: HTMLSpanElement | null) => {
      bindChevronRef(node);
      iconRef.current = node;
      setRef(node);
    },
    [bindChevronRef, setRef],
  );

  return (
    <span
      ref={setIconRef}
      className={comboBoxTriggerIconWrapClass(size, slotClassNames.triggerIconWrap)}
      {...pointerHandlers}
    >
      {children ?? (
        <KitChevronDown
          className={comboBoxTriggerIconClass(slotClassNames.triggerIcon)}
          aria-hidden
        />
      )}
    </span>
  );
}
 
export const ComboBoxTrigger = forwardRef<HTMLButtonElement, ComboBoxTriggerProps>(
  function ComboBoxTrigger({ className, onPointerOver, onPointerOut, onPointerDown, onPointerUp, children, motion, ...rest }, ref) {
    const labels = useBurneLabels();
    const slotClassNames = useComboBoxClassNames();
    const { open, setOpen, setFilterQuery, disabled, size, inputRef } = useComboBoxContext();
    const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
      scope: useOptionalComboBoxMotionScope(),
      slot: "trigger",
      motion,
      pointerPhases: true,
      pressPhases: true,
      onPointerOver,
      onPointerOut,
      onPointerUp,
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
        setRef(node);
        mergeForwardedRef(ref, node);
      },
      [ref, setRef],
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
        <ComboBoxTriggerIcon size={size}>{children}</ComboBoxTriggerIcon>
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
      portalContainer: portalContainerProp,
      listBoxProps,
      motion,
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
      virtualized,
      virtualItemSize,
      items,
      filteredValues,
      value,
      setValue,
      cancelBlurCommit,
      activeValue,
      setActiveValue,
      setFilterQuery,
      loading,
      variant,
      disabled,
      size,
      portalContainer,
    } = useComboBoxContext();
    const fieldMotion = useOptionalComboBoxMotionScope();
    const panelMotion = resolveComboBoxPopoverPanelMotion(
      variant,
      disabled,
      fieldMotion?.getRootMotion()?.popover,
      motion,
    );
 
    const {
      className: listBoxClassName,
      classNames: listBoxSlotClassNames,
      style: listBoxStyle,
      size: listBoxSize,
      virtualized: listVirtualized,
      virtualItemSize: listItemSize,
      ...listBoxRest
    } = listBoxProps ?? {};
 
    const handleValueChange = useCallback(
      (next: string | null) => {
        cancelBlurCommit();
        setValue(next ?? "");
        setFilterQuery("");
        setOpen(false);
      },
      [cancelBlurCommit, setFilterQuery, setOpen, setValue],
    );
 
    const labels = useBurneLabels();
    const listContent =
      children ??
      (loading ? (
        <div role="status" aria-busy="true" className={COMBOBOX_LOADING_CLASS}>
          {labels.loading}
        </div>
      ) : filteredValues.length === 0 ? (
        <ListBox.Empty />
      ) : (
        filteredValues.map((v) => {
          const opt = items.find((o) => o.value === v)!;
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
        variant={variant}
        portalContainer={portalContainerProp ?? portalContainer}
      >
        <Popover.Content
          ref={ref}
          matchAnchorWidth
          unstyled
          contentRole={undefined}
          align={align}
          offset={offset}
          className={cn(COMBOBOX_POPOVER_CLASS, slotClassNames.popover, className)}
          motion={{ content: panelMotion }}
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
              virtualized={virtualized || listVirtualized}
              virtualItemSize={virtualItemSize ?? listItemSize}
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
  motionController,
  motionState,
  motionPayload,
  playInitialState,
}: {
  label: React.ReactNode;
  hint: React.ReactNode;
  error: React.ReactNode;
  labelId: string;
  motionController?: MotionController;
} & MotionStateHostProps) {
  const slotClassNames = useComboBoxClassNames();
 
  return (
    <>
      {label != null ? (
        <ComboBoxLabel id={labelId} classNames={{ root: slotClassNames.label }}>
          {label}
        </ComboBoxLabel>
      ) : null}
      <ComboBoxShell motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState}>
        <ComboBoxInput />
        <ComboBoxTrigger />
      </ComboBoxShell>
      <ComboBoxPopover />
      {hint != null ? <ComboBoxHint>{hint}</ComboBoxHint> : null}
      {error != null ? <ComboBoxError>{error}</ComboBoxError> : null}
    </>
  );
}
 
export { ComboBoxError, ComboBoxHint, ComboBoxLabel } from "./comboBoxFieldParts";
 