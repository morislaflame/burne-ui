import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
 
import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { useFormControlProps } from "@/components/composite/Form/useFormControlProps";
import { focusElement } from "@/components/core/utils/focusElement";
import { fieldShellVariantFromButtonGroup } from "@/components/core/utils/fieldShellVariant";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useSkinVariant } from "@/skins/skinContext";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";
 
import {
  searchInputCollapseA11yLabel,
  searchInputControlAriaLabel,
} from "./searchInputA11y";
import { resolveSearchLayout } from "./searchInputStyles";
import type {
  SearchInputVariant,
  UseSearchInputRootStateProps,
} from "./searchInputTypes";
 
export function useSearchInputRootState({
  size: sizeProp = "base",
  variant: variantProp,
  expandedWidth,
  defaultExpanded = false,
  expanded: expandedProp,
  onExpandedChange,
  collapseOnBlur = true,
  disabled,
  readOnly,
  name,
  placeholder: placeholderProp,
  value: valueProp,
  defaultValue,
  onChange,
  onBlur,
  onKeyDown,
  id: idProp,
  "aria-label": ariaLabelProp,
  ripple = false,
  groupSegment: groupSegmentProp,
  className = "",
  classNames,
  inputRef: inputRefProp,
}: UseSearchInputRootStateProps) {
  const formBinding = useFormControlProps({
    name: typeof name === "string" ? name : undefined,
    value: valueProp,
    onChange: onChange as ((event: unknown) => void) | undefined,
    onBlur: onBlur as ((event: unknown) => void) | undefined,
    disabled,
    readOnly,
  });
  const resolvedValue = formBinding.bound ? (formBinding.value as typeof valueProp) : valueProp;
  const resolvedDisabled = formBinding.disabled ?? disabled;
  const resolvedReadOnly = Boolean(formBinding.readOnly);
  const labels = useBurneLabels();
  const placeholder = placeholderProp ?? labels.searchPlaceholder;
  const layoutCtx = useOptionalButtonGroupLayout();
  const groupCtx = useOptionalButtonGroupSegment();
  const groupSegment = layoutCtx?.segmented
    ? undefined
    : (groupSegmentProp ?? groupCtx?.segment);
  const variant: SearchInputVariant = useSkinVariant(
    variantProp ??
      (groupCtx?.variant != null
        ? fieldShellVariantFromButtonGroup(groupCtx.variant)
        : undefined),
  );
 
  const genId = useId();
  const inputId = idProp ?? genId;
 
  const [expanded, setExpanded] = useControllableState({
    value: expandedProp,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });
 
  const inputRef = useRef<HTMLInputElement | null>(null);
  const blurTimerRef = useRef<number | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const expandTriggerRef = useRef<HTMLButtonElement>(null);
 
  const isValueControlled = resolvedValue !== undefined;
  const [uncontrolledHasQuery, setUncontrolledHasQuery] = useState(
    () => defaultValue != null && String(defaultValue).trim().length > 0,
  );
  const hasQuery = isValueControlled
    ? String(resolvedValue ?? "").trim().length > 0
    : uncontrolledHasQuery;
 
  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      formBinding.ref(node);
      if (inputRefProp) mergeForwardedRef(inputRefProp, node);
    },
    [formBinding, inputRefProp],
  );
 
  const blocked = Boolean(resolvedDisabled || resolvedReadOnly);
  const layout = resolveSearchLayout(sizeProp);
  const targetW = expandedWidth ?? layout.defaultExpandedW;
 
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      formBinding.onChange(e);
      if (!isValueControlled) {
        setUncontrolledHasQuery(e.target.value.trim().length > 0);
      }
    },
    [formBinding, isValueControlled],
  );
 
  const handleClearClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (blocked) return;
      const el = inputRef.current;
      if (!el) return;
      if (!isValueControlled) {
        setUncontrolledHasQuery(false);
      }
      const nativeSet = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeSet?.call(el, "");
      el.dispatchEvent(new Event("input", { bubbles: true }));
      onChange?.({
        target: el,
        currentTarget: el,
      } as ChangeEvent<HTMLInputElement>);
      requestAnimationFrame(() => focusElement(el));
    },
    [blocked, isValueControlled, onChange],
  );
 
  const focusInput = useCallback(() => {
    requestAnimationFrame(() => focusElement(inputRef.current));
  }, []);
 
  const openFromInteraction = useCallback(async (awaitPressSqueeze: () => Promise<void>) => {
    if (blocked || expanded) return;
    await awaitPressSqueeze();
    setExpanded(true);
    focusInput();
  }, [blocked, expanded, focusInput, setExpanded]);
 
  const handleRootClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>, awaitPressSqueeze: () => Promise<void>) => {
      if (blocked) return;
      e.preventDefault();
      void openFromInteraction(awaitPressSqueeze);
    },
    [blocked, openFromInteraction],
  );
 
  const handleInputBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      formBinding.onBlur(e);
      if (!collapseOnBlur || blocked) return;
      window.clearTimeout(blurTimerRef.current);
      blurTimerRef.current = window.setTimeout(() => {
        const root = rootRef.current;
        if (!root?.contains(document.activeElement)) {
          const el = inputRef.current;
          const empty = (el?.value ?? "").trim().length === 0;
          if (empty) setExpanded(false);
        }
      }, 0);
    },
    [blocked, collapseOnBlur, formBinding, setExpanded],
  );

  useEffect(() => {
    return () => {
      window.clearTimeout(blurTimerRef.current);
    };
  }, []);
 
  const handleRootKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, awaitPressSqueeze: () => Promise<void>) => {
      if (blocked) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        void openFromInteraction(awaitPressSqueeze);
      }
    },
    [blocked, openFromInteraction],
  );
 
  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (
        e.key === "Escape" &&
        collapseOnBlur &&
        (inputRef.current?.value ?? "").length === 0
      ) {
        e.stopPropagation();
        setExpanded(false);
        requestAnimationFrame(() => {
          focusElement(expandTriggerRef.current);
        });
      }
    },
    [collapseOnBlur, expandTriggerRef, onKeyDown, setExpanded],
  );
 
  const paddingInputLeft = layout.padX + layout.iconBox + 6;
  const showClear = expanded && hasQuery && !blocked;
  const paddingInputRight =
    layout.padX + (showClear ? layout.clearTap + layout.textGapClear : 0);
 
  return {
    size: sizeProp,
    variant,
    expanded,
    blocked,
    groupSegment,
    layout,
    targetW,
    ripple,
    inputId,
    placeholder,
    valueProp: resolvedValue,
    defaultValue: formBinding.bound ? undefined : defaultValue,
    disabled: resolvedDisabled,
    readOnly: resolvedReadOnly,
    formInvalid: formBinding["aria-invalid"] === true,
    name: formBinding.name ?? name,
    classNames,
    className,
    showClear,
    collapseA11yLabel: searchInputCollapseA11yLabel(ariaLabelProp, labels.openSearch),
    inputAriaLabel: searchInputControlAriaLabel(ariaLabelProp, placeholder, labels.search),
    inputPaddingStyle: expanded
      ? {
          paddingLeft: paddingInputLeft,
          paddingRight: paddingInputRight,
        }
      : undefined,
    setInputRef,
    handleInputChange,
    handleClearClick,
    handleRootClick,
    handleInputBlur,
    handleRootKeyDown,
    handleInputKeyDown,
    rootRef,
    iconRef,
    expandTriggerRef,
  };
}
 