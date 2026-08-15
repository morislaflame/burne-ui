import "../utils/glossPanel.css";

import { selectionIndicatorDecorativeProps } from "./selectionIndicatorA11y";
import {
  SelectionIndicatorMotionProvider,
  SelectionIndicatorProvider,
} from "./selectionIndicatorContext";
import {
  SELECTION_INDICATOR_MOTION_DEFAULTS,
  SelectionIndicatorMotionSync,
} from "./selectionIndicatorAnimations";
import { SelectionIndicatorFill, SelectionIndicatorMark } from "./selectionIndicatorParts";
import type { SelectionIndicatorProps } from "./selectionIndicatorTypes";
import { useSelectionIndicatorRootState } from "./useSelectionIndicatorRootState";

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
        <span className={shellClassName} {...selectionIndicatorDecorativeProps()} {...rest}>
          {body}
        </span>
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
