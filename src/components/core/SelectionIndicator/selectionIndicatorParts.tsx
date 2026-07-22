import { forwardRef } from "react";

import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { cn } from "@/utils/cn";

import { SELECTION_INDICATOR_FILL_DISPLAY_NAME, SELECTION_INDICATOR_MARK_DISPLAY_NAME } from "./selectionIndicatorAPI";
import { selectionIndicatorDecorativeProps } from "./selectionIndicatorA11y";
import { useSelectionIndicatorContext } from "./selectionIndicatorContext";
import type { SelectionIndicatorFillProps, SelectionIndicatorMarkProps } from "./selectionIndicatorTypes";

const SELECTION_INDICATOR_FILL_INITIAL_STYLE = {
  transform: "scale(0)",
  opacity: 0,
} as const;

const SELECTION_INDICATOR_MARK_INITIAL_STYLE = {
  opacity: 0,
} as const;

export const SelectionIndicatorFill = forwardRef<HTMLSpanElement, SelectionIndicatorFillProps>(
  function SelectionIndicatorFill({ className, style, ...rest }, forwardedRef) {
    const ctx = useSelectionIndicatorContext();

    return (
      <span
        ref={(node) => {
          ctx.fillRef.current = node;
          mergeForwardedRef(forwardedRef, node);
        }}
        {...selectionIndicatorDecorativeProps()}
        className={cn(ctx.fillClassName, className)}
        style={{ ...SELECTION_INDICATOR_FILL_INITIAL_STYLE, ...style }}
        {...rest}
      />
    );
  },
);

SelectionIndicatorFill.displayName = SELECTION_INDICATOR_FILL_DISPLAY_NAME;

export const SelectionIndicatorMark = forwardRef<HTMLSpanElement, SelectionIndicatorMarkProps>(
  function SelectionIndicatorMark({ className, children, style, ...rest }, forwardedRef) {
    const ctx = useSelectionIndicatorContext();
    const content = children ?? ctx.markContent;

    if (content == null) return null;

    return (
      <span
        ref={(node) => {
          ctx.markRef.current = node;
          mergeForwardedRef(forwardedRef, node);
        }}
        {...selectionIndicatorDecorativeProps()}
        className={cn(ctx.markClassName, className)}
        style={{ ...SELECTION_INDICATOR_MARK_INITIAL_STYLE, ...style }}
        {...rest}
      >
        {content}
      </span>
    );
  },
);

SelectionIndicatorMark.displayName = SELECTION_INDICATOR_MARK_DISPLAY_NAME;
