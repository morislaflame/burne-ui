import "../utils/glossPanel.css";

import type { HTMLAttributes } from "react";

import { useMotionPart } from "@/components/core/utils/slotMotion";

import { selectionIndicatorDecorativeProps } from "./selectionIndicatorA11y";
import {
  SelectionIndicatorMotionProvider,
  SelectionIndicatorProvider,
  useOptionalSelectionIndicatorMotionScope,
} from "./selectionIndicatorContext";
import {
  SELECTION_INDICATOR_MOTION_DEFAULTS,
  SelectionIndicatorMotionSync,
} from "./selectionIndicatorAnimations";
import { SelectionIndicatorFill, SelectionIndicatorMark } from "./selectionIndicatorParts";
import type { SelectionIndicatorCheckMotion, SelectionIndicatorProps } from "./selectionIndicatorTypes";
import { useSelectionIndicatorRootState } from "./useSelectionIndicatorRootState";

function SelectionIndicatorRootSlot({
  className,
  motion,
  children,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { motion?: SelectionIndicatorCheckMotion }) {
  const { setRef } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalSelectionIndicatorMotionScope(),
    slot: "root",
    motion,
  });
  return (
    <span ref={setRef} className={className} {...selectionIndicatorDecorativeProps()} {...rest}>
      {children}
    </span>
  );
}

export function SelectionIndicator({
  size = "base",
  variant = "default",
  selected,
  check = false,
  dot = false,
  icon,
  children,
  className,
  classNames,
  motion,
  ...rest
}: SelectionIndicatorProps) {
  const { shellClassName, contextValue, usesCompound, fillSlot, markSlot, hasMark, markContent, showsFill } =
    useSelectionIndicatorRootState({
      size,
      variant,
      selected,
      check,
      dot,
      icon,
      children,
      className,
      classNames,
    });

  const body = usesCompound ? (
    <>
      {showsFill ? (fillSlot ?? <SelectionIndicatorFill />) : null}
      {hasMark ? (markSlot ?? <SelectionIndicatorMark />) : null}
    </>
  ) : (
    <>
      {showsFill ? <SelectionIndicatorFill /> : null}
      {hasMark ? <SelectionIndicatorMark>{markContent}</SelectionIndicatorMark> : null}
    </>
  );

  return (
    <SelectionIndicatorProvider value={contextValue}>
      <SelectionIndicatorMotionProvider motion={motion} defaults={SELECTION_INDICATOR_MOTION_DEFAULTS}>
        <SelectionIndicatorRootSlot className={shellClassName} motion={motion?.root} {...rest}>
          {body}
        </SelectionIndicatorRootSlot>
        <SelectionIndicatorMotionSync
          selected={selected}
          showsFill={showsFill}
          hasMark={hasMark}
        />
      </SelectionIndicatorMotionProvider>
    </SelectionIndicatorProvider>
  );
}

SelectionIndicator.displayName = "SelectionIndicator";