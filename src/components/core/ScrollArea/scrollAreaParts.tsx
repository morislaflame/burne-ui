import { createContext, forwardRef, useContext, useLayoutEffect, type ReactNode } from "react";

import { dataActiveState } from "@/components/core/utils/dataContract";

import {
  SCROLL_AREA_CORNER_DISPLAY_NAME,
  SCROLL_AREA_SCROLLBAR_DISPLAY_NAME,
  SCROLL_AREA_THUMB_DISPLAY_NAME,
  SCROLL_AREA_VIEWPORT_DISPLAY_NAME,
  applyScrollAreaKey,
  bindScrollAreaThumbDrag,
  jumpScrollAreaToPointer,
  scrollAreaHasPart,
} from "./scrollAreaAPI";
import { scrollAreaScrollbarA11y } from "./scrollAreaA11y";
import { useScrollAreaSlotMotion } from "./scrollAreaAnimations";
import { useScrollAreaClassNames, useScrollAreaContext } from "./scrollAreaContext";
import {
  scrollAreaContentClass,
  scrollAreaCornerClass,
  scrollAreaScrollbarClass,
  scrollAreaThumbClass,
  scrollAreaViewportClass,
} from "./scrollAreaStyles";
import type {
  ScrollAreaCornerProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
  ScrollAxis,
} from "./scrollAreaTypes";

const ScrollAreaAxisContext = createContext<ScrollAxis>("vertical");

function useScrollAreaAxis(): ScrollAxis {
  return useContext(ScrollAreaAxisContext);
}

export const ScrollAreaViewport = forwardRef<HTMLDivElement, ScrollAreaViewportProps>(function ScrollAreaViewport({
  children,
  className,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: ScrollAreaViewportProps, ref) {
  const context = useScrollAreaContext();
  const classNames = useScrollAreaClassNames();
  const part = useScrollAreaSlotMotion<HTMLDivElement>({
    slot: "viewport",
    forwardedRef: ref,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <div
      {...rest}
      {...part.pointerHandlers}
      ref={(node) => {
        context.viewportRef.current = node;
        part.setRef(node);
      }}
      id={context.viewportId}
      aria-label={ariaLabel ?? context.ariaLabel}
      aria-labelledby={ariaLabelledBy ?? context.ariaLabelledBy}
      className={scrollAreaViewportClass({
        orientation: context.orientation,
        slotClass: classNames.viewport,
        className,
      })}
    >
      <div className={scrollAreaContentClass(context.orientation)}>{children}</div>
    </div>
  );
});

ScrollAreaViewport.displayName = SCROLL_AREA_VIEWPORT_DISPLAY_NAME;

export function ScrollAreaScrollbar({
  children,
  className,
  orientation = "vertical",
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  onWheel,
  onKeyDown,
  ...rest
}: ScrollAreaScrollbarProps) {
  const { viewportId, viewportRef, axesRef, overflow, aria, barActive, registerBar } = useScrollAreaContext();
  const classNames = useScrollAreaClassNames();
  const overflowing = orientation === "vertical" ? overflow.vertical : overflow.horizontal;
  const active = orientation === "vertical" ? barActive.vertical : barActive.horizontal;
  const values = orientation === "vertical" ? aria.vertical : aria.horizontal;
  const a11y = scrollAreaScrollbarA11y({
    controls: viewportId,
    axis: orientation,
    now: values.now,
    max: values.max,
  });
  const part = useScrollAreaSlotMotion<HTMLDivElement>({
    slot: "scrollbar",
    motion,
    onPointerOver,
    onPointerOut,
    onPointerUp,
    onPointerDown: (event) => {
      onPointerDown?.(event);
      const viewport = viewportRef.current;
      if (!viewport || event.defaultPrevented) return;
      jumpScrollAreaToPointer(event.currentTarget, event, {
        axis: orientation,
        viewport,
        metrics: axesRef.current[orientation],
      });
    },
  });

  useLayoutEffect(() => {
    const node = part.targetRef.current;
    if (!node) return undefined;
    return registerBar({ axis: orientation, element: node });
  }, [orientation, part.targetRef, registerBar]);

  const thumb = scrollAreaHasPart(children, SCROLL_AREA_THUMB_DISPLAY_NAME) ? (
    children
  ) : (
    <>
      {children}
      <ScrollAreaThumb />
    </>
  );

  return (
    <ScrollAreaAxisContext.Provider value={orientation}>
      <div
        {...rest}
        {...part.pointerHandlers}
        ref={part.setRef}
        role="scrollbar"
        aria-controls={a11y["aria-controls"]}
        aria-orientation={a11y["aria-orientation"]}
        aria-valuemin={a11y["aria-valuemin"]}
        aria-valuemax={a11y["aria-valuemax"]}
        aria-valuenow={a11y["aria-valuenow"]}
        tabIndex={overflowing ? 0 : -1}
        hidden={overflowing ? undefined : true}
        className={scrollAreaScrollbarClass({
          axis: orientation,
          slotClass: classNames.scrollbar,
          className,
        })}
        data-orientation={orientation}
        data-state={dataActiveState(active)}
        onWheel={(event) => {
          onWheel?.(event);
          const viewport = viewportRef.current;
          if (!viewport || event.defaultPrevented) return;
          if (orientation === "vertical") viewport.scrollTop += event.deltaY;
          else viewport.scrollLeft += event.deltaX || event.deltaY;
          event.preventDefault();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          const viewport = viewportRef.current;
          if (!viewport || event.defaultPrevented) return;
          const handled = applyScrollAreaKey(viewport, orientation, axesRef.current[orientation], event.key);
          if (handled) event.preventDefault();
        }}
      >
        {thumb}
      </div>
    </ScrollAreaAxisContext.Provider>
  );
}

ScrollAreaScrollbar.displayName = SCROLL_AREA_SCROLLBAR_DISPLAY_NAME;

export function ScrollAreaThumb({
  className,
  style,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}: ScrollAreaThumbProps) {
  const axis = useScrollAreaAxis();
  const { viewportRef, axesRef, setDragging } = useScrollAreaContext();
  const classNames = useScrollAreaClassNames();
  const part = useScrollAreaSlotMotion<HTMLDivElement>({
    slot: "thumb",
    motion,
    onPointerOver,
    onPointerOut,
    onPointerUp,
    onPointerDown: (event) => {
      onPointerDown?.(event);
      const viewport = viewportRef.current;
      if (!viewport) return;
      bindScrollAreaThumbDrag(event.currentTarget, event, {
        axis,
        viewport,
        metrics: axesRef.current[axis],
        onDragging: (dragging) => setDragging(axis, dragging),
      });
    },
  });

  const geometry =
    axis === "vertical"
      ? { height: "var(--scroll-thumb-size)", translate: "0 var(--scroll-thumb-offset)" }
      : { width: "var(--scroll-thumb-size)", translate: "var(--scroll-thumb-offset) 0" };

  return (
    <div
      {...rest}
      {...part.pointerHandlers}
      ref={part.setRef}
      className={scrollAreaThumbClass({ axis, slotClass: classNames.thumb, className })}
      style={{ ...style, ...geometry }}
    />
  );
}

ScrollAreaThumb.displayName = SCROLL_AREA_THUMB_DISPLAY_NAME;

export function ScrollAreaCorner({
  className,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}: ScrollAreaCornerProps) {
  const { overflow } = useScrollAreaContext();
  const classNames = useScrollAreaClassNames();
  const part = useScrollAreaSlotMotion<HTMLDivElement>({
    slot: "corner",
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  const both = overflow.vertical && overflow.horizontal;

  return (
    <div
      {...rest}
      {...part.pointerHandlers}
      ref={part.setRef}
      aria-hidden="true"
      hidden={both ? undefined : true}
      className={scrollAreaCornerClass({ slotClass: classNames.corner, className })}
    />
  );
}

ScrollAreaCorner.displayName = SCROLL_AREA_CORNER_DISPLAY_NAME;

export function ScrollAreaSimpleBody({ children }: { children?: ReactNode }) {
  const { orientation } = useScrollAreaContext();
  return (
    <>
      <ScrollAreaViewport>{children}</ScrollAreaViewport>
      {orientation !== "horizontal" ? <ScrollAreaScrollbar orientation="vertical" /> : null}
      {orientation !== "vertical" ? <ScrollAreaScrollbar orientation="horizontal" /> : null}
      {orientation === "both" ? <ScrollAreaCorner /> : null}
    </>
  );
}
