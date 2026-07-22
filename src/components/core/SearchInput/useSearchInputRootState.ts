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
  type PointerEvent,
} from "react";

import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { fieldShellVariantFromButtonGroup } from "@/components/core/utils/fieldShellVariant";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useControllableState } from "@/components/core/utils/useControllableState";

import { useSearchInputAnimations } from "./searchInputAnimations";
import {
  searchInputCollapseA11yLabel,
  searchInputControlAriaLabel,
} from "./searchInputA11y";
import { resolveSearchLayout, searchInputRootClass } from "./searchInputStyles";
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
  placeholder = "Search…",
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
  forwardedRef,
}: UseSearchInputRootStateProps) {
  const layoutCtx = useOptionalButtonGroupLayout();
  const groupCtx = useOptionalButtonGroupSegment();
  const groupSegment = layoutCtx?.segmented
    ? undefined
    : (groupSegmentProp ?? groupCtx?.segment);
  const variant: SearchInputVariant =
    variantProp ??
    (groupCtx?.variant != null
      ? fieldShellVariantFromButtonGroup(groupCtx.variant)
      : "default");

  const genId = useId();
  const inputId = idProp ?? genId;

  const [expanded, setExpanded] = useControllableState({
    value: expandedProp,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isValueControlled = valueProp !== undefined;
  const [hasQuery, setHasQuery] = useState(
    () =>
      (defaultValue != null && String(defaultValue).trim().length > 0) ||
      (valueProp != null && String(valueProp).trim().length > 0),
  );

  useEffect(() => {
    if (isValueControlled) {
      setHasQuery(String(valueProp ?? "").trim().length > 0);
    }
  }, [isValueControlled, valueProp]);

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const blocked = Boolean(disabled || readOnly);
  const layout = resolveSearchLayout(sizeProp);
  const targetW = expandedWidth ?? layout.defaultExpandedW;
  const isGloss = variant === "gloss";

  const {
    rootRef,
    bindRootRef,
    bindIconRef,
    beginPressSqueeze,
    awaitPressSqueeze,
    handlePointerEnter,
    handlePointerLeave,
    onShellFocusIn,
    onShellFocusOut,
    shellHoverMotionClass,
    standardMotionClass,
  } = useSearchInputAnimations({
    size: sizeProp,
    expanded,
    blocked,
    isGloss,
    groupSegment,
    layout,
    targetW,
  });

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      if (!isValueControlled) {
        setHasQuery(e.target.value.trim().length > 0);
      }
    },
    [isValueControlled, onChange],
  );

  const handleClearClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (blocked) return;
      const el = inputRef.current;
      if (!el) return;
      if (!isValueControlled) {
        setHasQuery(false);
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
      requestAnimationFrame(() => el.focus());
    },
    [blocked, isValueControlled, onChange],
  );

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const openFromInteraction = useCallback(async () => {
    if (blocked || expanded) return;
    await awaitPressSqueeze();
    setExpanded(true);
    focusInput();
  }, [awaitPressSqueeze, blocked, expanded, focusInput, setExpanded]);

  const handleRootPointerDown = useCallback(
    (_e: PointerEvent<HTMLDivElement>) => {
      beginPressSqueeze();
    },
    [beginPressSqueeze],
  );

  const handleRootClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (blocked) return;
      if (!expanded) {
        e.preventDefault();
        void openFromInteraction();
      }
    },
    [blocked, expanded, openFromInteraction],
  );

  const handleInputBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      if (!collapseOnBlur || blocked) return;
      window.setTimeout(() => {
        const root = rootRef.current;
        if (!root?.contains(document.activeElement)) {
          const el = inputRef.current;
          const empty = (el?.value ?? "").trim().length === 0;
          if (empty) setExpanded(false);
        }
      }, 0);
    },
    [blocked, collapseOnBlur, onBlur, rootRef, setExpanded],
  );

  const handleRootKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (expanded || blocked) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        void openFromInteraction();
      }
    },
    [blocked, expanded, openFromInteraction],
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
        rootRef.current?.focus();
      }
    },
    [collapseOnBlur, onKeyDown, rootRef, setExpanded],
  );

  const paddingInputLeft = layout.padX + layout.iconBox + 6;
  const showClear = expanded && hasQuery && !blocked;
  const paddingInputRight =
    layout.padX + (showClear ? layout.clearTap + layout.textGapClear : 0);

  const rootClass = searchInputRootClass({
    size: sizeProp,
    variant,
    expanded,
    blocked,
    isGloss,
    groupSegment,
    shellHoverMotionClass,
    standardMotionClass,
    className,
    slotRoot: classNames?.root,
  });

  return {
    size: sizeProp,
    variant,
    expanded,
    blocked,
    isGloss,
    groupSegment,
    layout,
    ripple,
    inputId,
    placeholder,
    valueProp,
    defaultValue,
    disabled,
    readOnly,
    classNames,
    showClear,
    rootClass,
    collapseA11yLabel: searchInputCollapseA11yLabel(ariaLabelProp),
    inputAriaLabel: searchInputControlAriaLabel(ariaLabelProp, placeholder),
    inputPaddingStyle: expanded
      ? {
          paddingLeft: paddingInputLeft,
          paddingRight: paddingInputRight,
        }
      : undefined,
    setInputRef,
    handleInputChange,
    handleClearClick,
    handleRootPointerDown,
    handleRootClick,
    handleInputBlur,
    handleRootKeyDown,
    handleInputKeyDown,
    bindRootRef,
    bindIconRef,
    handlePointerEnter,
    handlePointerLeave,
    onShellFocusIn,
    onShellFocusOut,
  };
}
