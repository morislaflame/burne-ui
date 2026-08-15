import { useMemo, useRef } from "react";

import { cn } from "@/utils/cn";

import { partitionSelectionIndicatorChildren, resolveSelectionIndicatorClassNames, resolveSelectionIndicatorMarkContent, usesCompoundSelectionIndicatorChildren } from "./selectionIndicatorAPI";
import { SELECTION_INDICATOR_MARK_CLASS, selectionIndicatorFillClass, selectionIndicatorMarkCheckIconClass, selectionIndicatorMarkCustomIconClass, selectionIndicatorMarkColorClass, selectionIndicatorShellClass, selectionIndicatorShowsFill, selectionIndicatorVariantClass } from "./selectionIndicatorTokens";
import type {
  SelectionIndicatorContextValue,
  SelectionIndicatorProps,
} from "./selectionIndicatorTypes";

export function useSelectionIndicatorRootState({
  size = "base",
  variant = "default",
  selected,
  check = false,
  dot = false,
  icon: iconProp,
  children,
  className,
  classNames,
}: SelectionIndicatorProps) {
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

  const showCheck = check && !hasCustomIcon;
  const showDot = dot && !hasCustomIcon && !showCheck;

  const markContent = resolveSelectionIndicatorMarkContent({
    resolvedIcon,
    showCheck,
    showDot,
    size,
    variant,
  });

  const hasMark = hasMarkSlot || markContent != null;
  const showsFill = selectionIndicatorShowsFill(variant);

  const resolvedClassNames = resolveSelectionIndicatorClassNames({
    root: selectionIndicatorVariantClass(variant, selected),
    fill: selectionIndicatorFillClass(variant),
    mark: cn(
      SELECTION_INDICATOR_MARK_CLASS,
      showCheck && selectionIndicatorMarkCheckIconClass(size),
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
    }),
    [resolvedClassNames.fill, resolvedClassNames.mark, markContent],
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
  };
}
