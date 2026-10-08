import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
} from "react";

import { Popover } from "@/components/core/Popover";
import { usePopoverClassNames, usePopoverContext } from "@/components/core/Popover/popoverContext";
import { dataOpenState } from "@/components/core/utils/dataContract";
import { focusElement } from "@/components/core/utils/focusElement";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
import { hoverCardTriggerA11y } from "./hoverCardA11y";
import { useHoverCardTriggerMotion } from "./hoverCardAnimations";
import { HOVER_CARD_TRIGGER_NAME } from "./hoverCardAPI";
import { useHoverCardHost } from "./hoverCardContext";
import { hoverCardTriggerClass } from "./hoverCardStyles";
import type { HoverCardContentProps, HoverCardTriggerProps } from "./hoverCardTypes";

export function HoverCardEscapeFocus() {
  const { open, contentRef, triggerRef } = usePopoverContext("HoverCard");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const active = document.activeElement;
      if (active && contentRef.current?.contains(active)) focusElement(triggerRef.current);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [contentRef, open, triggerRef]);

  return null;
}

export const HoverCardTrigger = forwardRef<HTMLButtonElement, HoverCardTriggerProps>(
  function HoverCardTrigger(
    {
      asChild = true,
      className,
      children,
      motion,
      onPointerEnter,
      onPointerLeave,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      onFocus,
      onBlur,
      ...rest
    },
    forwardedRef,
  ) {
    const { open, popoverId, triggerRef, contentRef } = usePopoverContext("HoverCard.Trigger");
    const slotClassNames = usePopoverClassNames();
    const { hold, release } = useHoverCardHost();
    const { setRef, pointerHandlers } = useHoverCardTriggerMotion({
      motion,
      forwardedRef,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
    const a11y = hoverCardTriggerA11y(open, popoverId);

    const mergedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        setRef(node);
        triggerRef.current = node;
      },
      [setRef, triggerRef],
    );

    const handleEnter = useCallback(
      (event: PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(event);
        if (!event.defaultPrevented) hold();
      },
      [hold, onPointerEnter],
    );

    const handleLeave = useCallback(
      (event: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(event);
        if (!event.defaultPrevented) release();
      },
      [onPointerLeave, release],
    );

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLButtonElement>) => {
        onFocus?.(event);
        if (!event.defaultPrevented) hold();
      },
      [hold, onFocus],
    );

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLButtonElement>) => {
        onBlur?.(event);
        if (event.defaultPrevented) return;
        const next = event.relatedTarget;
        if (next instanceof Node && contentRef.current?.contains(next)) return;
        release();
      },
      [contentRef, onBlur, release],
    );

    const shared = {
      className: hoverCardTriggerClass({
        rootSlot: slotClassNames.root,
        slotClass: slotClassNames.trigger,
        className,
      }),
      onPointerEnter: handleEnter,
      onPointerLeave: handleLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
    };

    const onlyChild = Children.count(children) === 1 && isValidElement(children) ? children : null;
    if (asChild && onlyChild) {
      return cloneElement(
        onlyChild as ReactElement,
        mergeAsChildProps(
          onlyChild as ReactElement,
          {
            ...rest,
            ...pointerHandlers,
            ...shared,
            "aria-haspopup": a11y["aria-haspopup"],
            "aria-expanded": a11y["aria-expanded"],
            "aria-controls": a11y["aria-controls"],
            "data-state": dataOpenState(open),
          },
          mergedRef,
        ),
      );
    }

    return (
      <button
        type="button"
        ref={mergedRef}
        {...rest}
        {...pointerHandlers}
        {...shared}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        data-state={dataOpenState(open)}
      >
        {children}
      </button>
    );
  },
);

HoverCardTrigger.displayName = HOVER_CARD_TRIGGER_NAME;

export const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(
  function HoverCardContent(
    {
      showArrow = true,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      onPointerEnter,
      onPointerLeave,
      ...rest
    },
    forwardedRef,
  ) {
    const host = useHoverCardHost();

    return (
      <Popover.Content
        ref={forwardedRef}
        showArrow={showArrow}
        motion={motion}
        motionController={motionController ?? host.motionController}
        motionState={motionState ?? host.motionState}
        motionPayload={motionPayload ?? host.motionPayload}
        playInitialState={playInitialState ?? host.playInitialState}
        {...rest}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (!event.defaultPrevented) host.hold();
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          if (!event.defaultPrevented) host.release();
        }}
      />
    );
  },
);

HoverCardContent.displayName = "HoverCardContent";

export const HoverCardHeader = Popover.Header;
export const HoverCardTitle = Popover.Title;
export const HoverCardDescription = Popover.Description;
export const HoverCardBody = Popover.Body;
export const HoverCardArrow = Popover.Arrow;
