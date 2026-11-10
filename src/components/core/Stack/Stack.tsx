import { forwardRef, useMemo } from "react";

import { resolveStackMotionDefaults, useStackRootMotion } from "./stackAnimations";
import { StackMotionProvider } from "./stackContext";
import { stackRootClass } from "./stackStyles";
import type { StackPartMotion, StackProps } from "./stackTypes";

export type {
  StackAlign,
  StackClassNames,
  StackGap,
  StackJustify,
  StackMotion,
  StackOrientation,
  StackPartMotion,
  StackProps,
} from "./stackTypes";

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  {
    orientation = "vertical",
    gap = "base",
    align = "stretch",
    justify = "start",
    wrap = false,
    className = "",
    classNames,
    children,
    motion,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const motionDefaults = useMemo(() => resolveStackMotionDefaults(), []);

  return (
    <StackMotionProvider
      motion={motion}
      defaults={motionDefaults}
      controller={motionController}
      motionState={motionState}
      motionPayload={motionPayload}
      playInitialState={playInitialState}
    >
      <StackSurface
        orientation={orientation}
        gap={gap}
        align={align}
        justify={justify}
        wrap={wrap}
        className={className}
        classNames={classNames}
        forwardedRef={ref}
        rootMotion={motion?.root}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        rest={rest}
      >
        {children}
      </StackSurface>
    </StackMotionProvider>
  );
});

function StackSurface({
  orientation,
  gap,
  align,
  justify,
  wrap,
  className,
  classNames,
  children,
  forwardedRef,
  rootMotion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
}: {
  orientation: NonNullable<StackProps["orientation"]>;
  gap: NonNullable<StackProps["gap"]>;
  align: NonNullable<StackProps["align"]>;
  justify: NonNullable<StackProps["justify"]>;
  wrap: boolean;
  className: string;
  classNames: StackProps["classNames"];
  children: StackProps["children"];
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  rootMotion?: StackPartMotion;
  onPointerOver: StackProps["onPointerOver"];
  onPointerOut: StackProps["onPointerOut"];
  onPointerDown: StackProps["onPointerDown"];
  onPointerUp: StackProps["onPointerUp"];
  rest: Omit<
    StackProps,
    | "orientation"
    | "gap"
    | "align"
    | "justify"
    | "wrap"
    | "className"
    | "classNames"
    | "children"
    | "motion"
    | "motionController"
    | "motionState"
    | "motionPayload"
    | "playInitialState"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
  >;
}) {
  const part = useStackRootMotion({
    forwardedRef,
    motion: rootMotion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <div
      ref={part.setRef}
      className={stackRootClass({
        orientation,
        gap,
        align,
        justify,
        wrap,
        slotClass: classNames?.root,
        className,
      })}
      {...rest}
      {...part.pointerHandlers}
      data-orientation={orientation}
    >
      {children}
    </div>
  );
}

Stack.displayName = "Stack";
