import { forwardRef, useCallback } from "react";

import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";

import { SELECTION_INDICATOR_FILL_DISPLAY_NAME, SELECTION_INDICATOR_MARK_DISPLAY_NAME } from "./selectionIndicatorAPI";
import { selectionIndicatorDecorativeProps } from "./selectionIndicatorA11y";
import { useOptionalSelectionIndicatorMotionScope, useSelectionIndicatorContext } from "./selectionIndicatorContext";
import type { SelectionIndicatorFillProps, SelectionIndicatorMarkProps } from "./selectionIndicatorTypes";

function initFillNode(node: HTMLSpanElement) {
  if (node.dataset.motionInit === "1") return;
  node.dataset.motionInit = "1";
  node.style.transform = "scale(0)";
  node.style.opacity = "0";
}

function initMarkNode(node: HTMLSpanElement) {
  if (node.dataset.motionInit === "1") return;
  node.dataset.motionInit = "1";
  node.style.opacity = "0";
}

export const SelectionIndicatorFill = forwardRef<HTMLSpanElement, SelectionIndicatorFillProps>(
  function SelectionIndicatorFill({ className, style, motion, ...rest }, forwardedRef) {
    const ctx = useSelectionIndicatorContext();
    const bindFillRef = useCallback(
      (node: HTMLSpanElement | null) => {
        if (node) initFillNode(node);
        ctx.fillRef.current = node;
        mergeForwardedRef(forwardedRef, node);
      },
      [ctx.fillRef, forwardedRef],
    );
    const { setRef } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalSelectionIndicatorMotionScope(),
      slot: "fill",
      motion,
      forwardedRef: bindFillRef,
    });

    return (
      <span
        ref={setRef}
        {...selectionIndicatorDecorativeProps()}
        className={cn(ctx.fillClassName, className)}
        style={style}
        {...rest}
      />
    );
  },
);

SelectionIndicatorFill.displayName = SELECTION_INDICATOR_FILL_DISPLAY_NAME;

export const SelectionIndicatorMark = forwardRef<HTMLSpanElement, SelectionIndicatorMarkProps>(
  function SelectionIndicatorMark({ className, children, style, motion, ...rest }, forwardedRef) {
    const ctx = useSelectionIndicatorContext();
    const content = children ?? ctx.markContent;
    const bindMarkRef = useCallback(
      (node: HTMLSpanElement | null) => {
        if (node) initMarkNode(node);
        ctx.markRef.current = node;
        mergeForwardedRef(forwardedRef, node);
      },
      [ctx.markRef, forwardedRef],
    );
    const { setRef } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalSelectionIndicatorMotionScope(),
      slot: "mark",
      motion,
      forwardedRef: bindMarkRef,
    });

    if (content == null) return null;

    return (
      <span
        ref={setRef}
        {...selectionIndicatorDecorativeProps()}
        className={cn(ctx.markClassName, className)}
        style={style}
        {...rest}
      >
        {content}
      </span>
    );
  },
);

SelectionIndicatorMark.displayName = SELECTION_INDICATOR_MARK_DISPLAY_NAME;
