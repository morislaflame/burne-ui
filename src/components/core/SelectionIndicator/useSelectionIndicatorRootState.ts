import { useMemo, useRef } from "react";

import { dataCheckedState } from "@/components/core/utils/dataContract";
import { useSkinVariant } from "@/skins/skinContext";
 
import { cn } from "@/utils/cn";
 
import { partitionSelectionIndicatorChildren, resolveSelectionIndicatorClassNames, resolveSelectionIndicatorMarkContent, usesCompoundSelectionIndicatorChildren } from "./selectionIndicatorAPI";
import { SELECTION_INDICATOR_MARK_CLASS, selectionIndicatorFillClass, selectionIndicatorMarkCheckIconClass, selectionIndicatorMarkCustomIconClass, selectionIndicatorMarkColorClass, selectionIndicatorShellClass, selectionIndicatorShowsFill, selectionIndicatorVariantClass } from "./selectionIndicatorStyles";
import type {
  SelectionIndicatorContextValue,
  SelectionIndicatorProps,
} from "./selectionIndicatorTypes";
 
export function useSelectionIndicatorRootState({
  size = "base",
  variant: variantProp,
  selected,
  indeterminate = false,
  check = false,
  dot = false,
  icon: iconProp,
  children,
  className,
  classNames,
}: SelectionIndicatorProps) {
  const variant = useSkinVariant(variantProp);
  const fillRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
 
  const { fillSlot, markSlot, legacyIcon, usesCompound } = useMemo(() => {
    const parts = partitionSelectionIndicatorChildren(children);
    return {
      ...parts,
      usesCompound: usesCompoundSelectionIndicatorChildren(children),
    };
  }, [children]);
  const hasMarkSlot = markSlot != null;
  const resolvedIcon = iconProp ?? (hasMarkSlot ? markSlot.props.children : legacyIcon);
  const hasCustomIcon = resolvedIcon != null;
 
  const showDash = indeterminate && !hasCustomIcon;
  const showCheck = check && !hasCustomIcon && !showDash;
  const showDot = dot && !hasCustomIcon && !showCheck && !showDash;
 
  const markContent = resolveSelectionIndicatorMarkContent({
    resolvedIcon,
    showCheck,
    showDash,
    showDot,
    size,
    variant,
  });
 
  const hasMark = hasMarkSlot || markContent != null;
  const showsFill = selectionIndicatorShowsFill(variant);
 
  const state = dataCheckedState(selected, indeterminate);

  const resolvedClassNames = resolveSelectionIndicatorClassNames({
    root: selectionIndicatorVariantClass(variant, selected),
    fill: selectionIndicatorFillClass(variant),
    mark: cn(
      SELECTION_INDICATOR_MARK_CLASS,
      (showCheck || showDash) && selectionIndicatorMarkCheckIconClass(size),
      hasCustomIcon && selectionIndicatorMarkCustomIconClass(size),
      selectionIndicatorMarkColorClass(variant),
    ),
    classNames,
    className,
  });
 
  const contextValue = useMemo<SelectionIndicatorContextValue>(
    () => ({
      fillRef,
      markRef,
      fillClassName: resolvedClassNames.fill,
      markClassName: resolvedClassNames.mark,
      markContent,
      selected,
    }),
    [resolvedClassNames.fill, resolvedClassNames.mark, markContent, selected],
  );
 
  const shellClassName = selectionIndicatorShellClass(size, resolvedClassNames.root);
 
  return {
    shellClassName,
    contextValue,
    usesCompound,
    fillSlot,
    markSlot,
    hasMark,
    markContent,
    showsFill,
    state,
  };
}
 