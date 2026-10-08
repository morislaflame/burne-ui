import type {
  FocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import { KitChevronDown } from "@/components/core/utils/kitIcons";
import { dataGroupSegment, dataOpenState, dataVariantProps } from "@/components/core/utils/dataContract";
import { ariaInvalidValue, useResolvedFieldInvalid, visualStatusForInvalid } from "@/components/core/utils/fieldInvalid";
 
import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { useSkinRegistryRevision } from "@/skins/skinContext";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { mergeMotionSlotMaps, mergeMotionRootSiblings, useMotionPart } from "@/components/core/utils/slotMotion";
import {
  createTypeaheadBufferState,
  isTypeaheadPrintableKey,
  typeaheadMatchIndex,
  typeaheadPush,
} from "@/components/core/utils/typeahead";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
 
import { focusElement } from "@/components/core/utils/focusElement";
import { toggleOptionListSelection } from "@/components/core/utils/optionListSelection";
 
import {
  resolveSelectMotionDefaults,
  resolveSelectMotionParams,
  useSelectOpenAfterSqueeze,
  useSelectShellAnimations,
} from "./selectAnimations";
import { selectActiveOptionId, selectTriggerAriaLabel } from "./selectA11y";
import { selectActiveOnOpen, selectBumpActiveValue, selectFirstEnabledValue, selectLastEnabledValue, selectOptionsByValue, selectSelectionLabels, selectShownValue, selectTypeaheadLabels } from "./selectAPI";
import {
  SelectMotionProvider,
  useOptionalSelectMotionScope,
  useSelectClassNames,
  useSelectContext,
} from "./selectContext";
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
    const ctx = useSelectContext();
    const { disabled, variant } = ctx;
    const groupSegment = layoutCtx?.segmented
      ? undefined
      : (groupSegmentProp ?? groupCtx?.segment);
    const pointerInsideRef = useRef(false);
    const parentScope = useOptionalSelectMotionScope();
    const skinRevision = useSkinRegistryRevision();
    const motionDefaults = useMemo(() => {
      void skinRevision;
      return resolveSelectMotionDefaults({ variant, disabled, groupSegment });
    }, [disabled, groupSegment, skinRevision, variant]);
    const motionParams = useMemo(
      () =>
        resolveSelectMotionParams({
          variant,
          disabled,
          groupSegment,
          pointerInside: pointerInsideRef,
        }),
      [disabled, groupSegment, variant],
    );
    const mergedSlots = mergeMotionSlotMaps(
      parentScope?.getRootMotion(),
      motion ? { triggerGroup: motion } : undefined,
    );
    const siblings = mergeMotionRootSiblings({
      events: parentScope?.getEvents(),
      states: parentScope?.getStates(),
    });
    const mergedMotion = { ...mergedSlots, ...siblings };
 
    return (
      <SelectMotionProvider
        motion={mergedMotion}
        defaults={motionDefaults}
        params={motionParams}
        controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
        <SelectTriggerGroupSurface
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
        </SelectTriggerGroupSurface>
      </SelectMotionProvider>
    );
  },
);
 
SelectTriggerGroup.displayName = "SelectTriggerGroup";
 
function SelectTriggerGroupSurface({
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
  groupSegment: SelectTriggerGroupProps["groupSegment"];
  pointerInsideRef: React.MutableRefObject<boolean>;
  shellPartMotion?: SelectTriggerGroupProps["motion"];
  onPointerEnter?: SelectTriggerGroupProps["onPointerEnter"];
  onPointerLeave?: SelectTriggerGroupProps["onPointerLeave"];
  rest: Omit<
    SelectTriggerGroupProps,
    | "className"
    | "children"
    | "groupSegment"
    | "onPointerEnter"
    | "onPointerLeave"
    | "motion"
    | "motionController"
  >;
}) {
  const slotClassNames = useSelectClassNames();
  const ctx = useSelectContext();
  const {
    open,
    setOpen,
    disabled,
    variant,
    status,
    size,
    invalid,
    errorConnected,
    formInvalid,
    anchorRef,
    valueRef,
    value,
    optionValues,
    setActiveValue,
  } = ctx;
  const isInvalid = useResolvedFieldInvalid({ invalid, errorConnected, formInvalid });
  const visualStatus = visualStatusForInvalid(status, isInvalid, "default");

  const {
    bindShellRef,
    squeezeThenOpen,
    shellPointerUp,
    shellPointerEnter,
    shellPointerLeave,
    shellHoverMotionClass,
  } = useSelectShellAnimations({
    shellRef: anchorRef,
    disabled,
    variant,
    groupSegment,
    motion: shellPartMotion,
    pointerInsideRef,
  });
 
  const finishOpen = useCallback(() => {
    const selectedIdx = optionValues.indexOf(value);
    setActiveValue(selectedIdx >= 0 ? value : optionValues[0] ?? null);
    requestAnimationFrame(() => focusElement(valueRef.current));
  }, [optionValues, setActiveValue, value, valueRef]);
 
  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (open) return;
      if (e.button !== 0) return;
      squeezeThenOpen({ setOpen, onOpened: finishOpen });
    },
    [disabled, finishOpen, open, setOpen, squeezeThenOpen],
  );
 
  return (
    <div
      ref={mergeRefs(forwardedRef, bindShellRef)}
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
      className={selectTriggerGroupClass({
        variant,
        status: visualStatus,
        disabled,
        groupSegment,
        shellHoverMotionClass,
        className,
        slotClass: slotClassNames.triggerGroup,
      })}
      {...rest}
      {...dataVariantProps({ size, variant, status: visualStatus })}
      data-group-segment={dataGroupSegment(groupSegment != null)}
    >
      {children}
    </div>
  );
}
 
function commitSelectOption(
  next: string,
  {
    multiple,
    values,
    setValues,
    setValue,
    setOpen,
    valueRef,
  }: {
    multiple: boolean;
    values: string[];
    setValues: (values: string[]) => void;
    setValue: (value: string) => void;
    setOpen: (open: boolean) => void;
    valueRef: RefObject<HTMLButtonElement | null>;
  },
) {
  if (multiple) {
    setValues(toggleOptionListSelection(values, next, true));
    return;
  }
  setValue(next);
  setOpen(false);
  focusElement(valueRef.current);
}

export const SelectValue = forwardRef<HTMLButtonElement, SelectValueProps>(
  function SelectValue({ className, onKeyDown, onBlur, children, placeholder: placeholderProp, motion, ...rest }, ref) {
    const slotClassNames = useSelectClassNames();
    const ctx = useSelectContext();
    const {
      selectId,
      open,
      setOpen,
      multiple,
      value,
      setValue,
      values,
      setValues,
      activeValue,
      setActiveValue,
      valueRef,
      anchorRef,
      options,
      optionValues,
      disabled,
      placeholder: contextPlaceholder,
      size,
      required,
      listId,
      labelId,
      labelConnected,
      hintConnected,
      errorConnected,
      invalid,
      formInvalid,
      hintId,
      errorId,
      formValueRef,
      formOnBlur,
    } = ctx;
 
    const placeholder = placeholderProp ?? contextPlaceholder;
    const isInvalid = useResolvedFieldInvalid({ invalid, errorConnected, formInvalid });
    const typeaheadRef = useRef(createTypeaheadBufferState());
    const partMotionRef = useRef(motion);
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
    partMotionRef.current = motion;
 
    const squeezeThenOpen = useSelectOpenAfterSqueeze({
      triggerRef: anchorRef,
      disabled,
      partMotionRef,
    });
 
    const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
      scope: useOptionalSelectMotionScope(),
      slot: "value",
      motion,
      forwardedRef: mergeRefs(ref, valueRef, formValueRef),
      pointerPhases: true,
      pressPhases: true,
    });
 
    const optionsByValue = useMemo(
      () => selectOptionsByValue(options),
      [options],
    );
 
    const selectedOption = useMemo(
      () => optionsByValue.get(value),
      [optionsByValue, value],
    );
    const selectionLabels = useMemo(
      () => selectSelectionLabels(optionValues, values, optionsByValue),
      [optionValues, optionsByValue, values],
    );
    const shown = selectShownValue(multiple, selectionLabels, selectedOption?.label, placeholder);
    const activeOptionId = selectActiveOptionId(listId, open, activeValue);
    const ariaDescribedBy = joinFieldDescribedBy(
      hintConnected ? hintId : undefined,
      errorConnected ? errorId : undefined,
    );
 
    const finishOpen = useCallback(() => {
      setActiveValue(selectActiveOnOpen({ optionValues, multiple, values, value }));
      requestAnimationFrame(() => focusElement(valueRef.current));
    }, [multiple, optionValues, setActiveValue, value, valueRef, values]);
 
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
        commitSelectOption(next, { multiple, values, setValues, setValue, setOpen, valueRef });
      },
      [multiple, optionsByValue, setOpen, setValue, setValues, valueRef, values],
    );
 
    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || disabled) return;
 
        if (!open) {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            squeezeThenOpen({ setOpen, onOpened: finishOpen });
            return;
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            squeezeThenOpen({ setOpen, onOpened: finishOpen });
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
          return;
        }
 
        if (isTypeaheadPrintableKey(e.key, e)) {
          e.preventDefault();
          const labels = selectTypeaheadLabels(optionValues, optionsByValue);
          const currentIdx = activeValue ? optionValues.indexOf(activeValue) : -1;
          const nextIdx = typeaheadMatchIndex(
            labels,
            typeaheadPush(typeaheadRef.current, e.key),
            currentIdx,
          );
          if (nextIdx < 0) return;
          const nextValue = optionValues[nextIdx];
          const opt = nextValue ? optionsByValue.get(nextValue) : undefined;
          if (nextValue && opt && !opt.disabled) setActiveValue(nextValue);
        }
      },
      [
        activeValue,
        bumpActive,
        disabled,
        finishOpen,
        onKeyDown,
        open,
        optionValues,
        optionsByValue,
        selectOption,
        setActiveValue,
        setOpen,
        squeezeThenOpen,
      ],
    );
 
    const handleBlur = useCallback(
      (e: FocusEvent<HTMLButtonElement>) => {
        onBlur?.(e);
        formOnBlur?.();
      },
      [formOnBlur, onBlur],
    );
 
    const display = children ?? shown.text;
 
    return (
      <button
        ref={setRef}
        id={selectId}
        type="button"
        disabled={disabled}
        className={selectValueClass({
          size,
          muted: shown.muted,
          className,
          slotClass: slotClassNames.value,
        })}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        {...rest}
        {...pointerHandlers}
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-haspopup="listbox"
        aria-activedescendant={open ? activeOptionId : undefined}
        aria-labelledby={labelConnected ? labelId : undefined}
        aria-label={labelConnected ? undefined : placeholder || undefined}
        aria-required={required || undefined}
        aria-invalid={ariaInvalidValue(isInvalid)}
        aria-describedby={ariaDescribedBy}
        data-state={dataOpenState(open)}
        data-invalid={isInvalid ? "" : undefined}
        data-required={required ? "" : undefined}
      >
        {display}
      </button>
    );
  },
);
 
SelectValue.displayName = "SelectValue";
 
function SelectTriggerIcon({ size }: { size: "small" | "base" | "mid" | "large" }) {
  const slotClassNames = useSelectClassNames();
  const { open } = useSelectContext();
  const scope = useOptionalSelectMotionScope();
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const bindChevronRef = useChevronRotation(open, iconRef, undefined, undefined, scope, "triggerIcon");
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "triggerIcon",
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
    <span ref={setIconRef} className={slotClassNames.triggerIconWrap} {...pointerHandlers}>
      <KitChevronDown
        className={cn(
          SELECT_CHEVRON_ICON[size],
          slotClassNames.triggerIcon,
        )}
        aria-hidden
      />
    </span>
  );
}
 
export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ className, onPointerDown, children, motion, ...rest }, ref) {
    const labels = useBurneLabels();
    const slotClassNames = useSelectClassNames();
    const { open, setOpen, disabled, size, valueRef } = useSelectContext();
    const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
      scope: useOptionalSelectMotionScope(),
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
          return;
        }
        if (e.button !== 0) return;
        setOpen(true);
        requestAnimationFrame(() => focusElement(valueRef.current));
      },
    });
 
    const setTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        setRef(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref, setRef],
    );
 
    return (
      <button
        type="button"
        ref={setTriggerRef}
        tabIndex={-1}
        disabled={disabled}
        aria-label={selectTriggerAriaLabel(open, labels)}
        className={selectTriggerClass({
          disabled,
          className,
          slotClass: slotClassNames.trigger,
        })}
        {...rest}
        {...pointerHandlers}
        data-state={dataOpenState(open)}
      >
        {children ?? <SelectTriggerIcon size={size} />}
      </button>
    );
  },
);
 
SelectTrigger.displayName = "SelectTrigger";
 