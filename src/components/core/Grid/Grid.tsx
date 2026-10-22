import { forwardRef, useMemo } from "react";

import { resolveGridMotionDefaults, useGridRootMotion } from "./gridAnimations";
import { GridMotionProvider } from "./gridContext";
import { gridRootClass } from "./gridStyles";
import type { GridPartMotion, GridProps } from "./gridTypes";

export type {
  GridAlign,
  GridClassNames,
  GridColumnCount,
  GridColumns,
  GridGap,
  GridMinTrack,
  GridMotion,
  GridPartMotion,
  GridProps,
} from "./gridTypes";

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  {
    columns = 1,
    minTrack = "mid",
    gap = "base",
    align = "stretch",
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
  const motionDefaults = useMemo(() => resolveGridMotionDefaults(), []);

  return (
    <GridMotionProvider
      motion={motion}
      defaults={motionDefaults}
      controller={motionController}
      motionState={motionState}
      motionPayload={motionPayload}
      playInitialState={playInitialState}
    >
      <GridSurface
        columns={columns}
        minTrack={minTrack}
        gap={gap}
        align={align}
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
      </GridSurface>
    </GridMotionProvider>
  );
});

function GridSurface({
  columns,
  minTrack,
  gap,
  align,
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
  columns: NonNullable<GridProps["columns"]>;
  minTrack: NonNullable<GridProps["minTrack"]>;
  gap: NonNullable<GridProps["gap"]>;
  align: NonNullable<GridProps["align"]>;
  className: string;
  classNames: GridProps["classNames"];
  children: GridProps["children"];
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  rootMotion?: GridPartMotion;
  onPointerOver: GridProps["onPointerOver"];
  onPointerOut: GridProps["onPointerOut"];
  onPointerDown: GridProps["onPointerDown"];
  onPointerUp: GridProps["onPointerUp"];
  rest: Omit<
    GridProps,
    | "columns"
    | "minTrack"
    | "gap"
    | "align"
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
  const part = useGridRootMotion({
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
      className={gridRootClass({
        columns,
        minTrack,
        gap,
        align,
        slotClass: classNames?.root,
        className,
      })}
      {...rest}
      {...part.pointerHandlers}
    >
      {children}
    </div>
  );
}

Grid.displayName = "Grid";
