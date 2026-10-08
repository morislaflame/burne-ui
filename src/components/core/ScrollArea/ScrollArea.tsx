import {
  forwardRef,
  useMemo,
  type FocusEvent,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";

import { resolveScrollAreaMotionDefaults, useScrollAreaRootMotion } from "./scrollAreaAnimations";
import {
  ScrollAreaClassNamesProvider,
  ScrollAreaMotionProvider,
  ScrollAreaProvider,
} from "./scrollAreaContext";
import { ScrollAreaSimpleBody } from "./scrollAreaParts";
import { scrollAreaRootClass } from "./scrollAreaStyles";
import type { ScrollAreaClassNames, ScrollAreaProps } from "./scrollAreaTypes";
import { useScrollAreaRootState } from "./useScrollAreaRootState";

function ScrollAreaFrame({
  children,
  className,
  classNames,
  isCompound,
  setHovered,
  setFocused,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  forwardedRef,
  rest,
}: {
  children?: ReactNode;
  className?: string;
  classNames?: ScrollAreaClassNames;
  isCompound: boolean;
  setHovered: (hovered: boolean) => void;
  setFocused: (focused: boolean) => void;
  onPointerEnter?: ScrollAreaProps["onPointerEnter"];
  onPointerLeave?: ScrollAreaProps["onPointerLeave"];
  onFocus?: ScrollAreaProps["onFocus"];
  onBlur?: ScrollAreaProps["onBlur"];
  onPointerOver?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerOut?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (event: PointerEvent<HTMLDivElement>) => void;
  forwardedRef?: Ref<HTMLDivElement>;
  rest: HTMLAttributes<HTMLDivElement>;
}) {
  const part = useScrollAreaRootMotion({
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <div
      {...rest}
      {...part.pointerHandlers}
      ref={part.setRef}
      className={scrollAreaRootClass({ slotClass: classNames?.root, className })}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        setHovered(true);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        setHovered(false);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        setFocused(true);
      }}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        onBlur?.(event);
        const next = event.relatedTarget;
        if (next instanceof Node && event.currentTarget.contains(next)) return;
        setFocused(false);
      }}
    >
      {isCompound ? children : <ScrollAreaSimpleBody>{children}</ScrollAreaSimpleBody>}
    </div>
  );
}

export const ScrollAreaRoot = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollAreaRoot({
  children,
  className,
  classNames,
  id,
  visibility = "hover",
  orientation = "vertical",
  scrollHideDelay,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: ScrollAreaProps,
ref: Ref<HTMLDivElement>,
) {
  const state = useScrollAreaRootState({
    children,
    id,
    visibility,
    orientation,
    scrollHideDelay,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  });
  const motionDefaults = useMemo(() => resolveScrollAreaMotionDefaults(), []);

  return (
    <ScrollAreaProvider value={state.contextValue}>
      <ScrollAreaClassNamesProvider classNames={classNames}>
        <ScrollAreaMotionProvider
          motion={motion}
          defaults={motionDefaults}
          params={{}}
          controller={motionController}
          motionState={motionState}
          motionPayload={motionPayload}
          playInitialState={playInitialState}
        >
          <ScrollAreaFrame
            className={className}
            classNames={classNames}
            isCompound={state.isCompound}
            setHovered={state.setHovered}
            setFocused={state.setFocused}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onFocus={onFocus}
            onBlur={onBlur}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            forwardedRef={ref}
            rest={rest}
          >
            {children}
          </ScrollAreaFrame>
        </ScrollAreaMotionProvider>
      </ScrollAreaClassNamesProvider>
    </ScrollAreaProvider>
  );
});

ScrollAreaRoot.displayName = "ScrollArea";
