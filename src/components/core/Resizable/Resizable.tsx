import { Children, forwardRef, isValidElement, useCallback, useMemo, useRef, useState, type CSSProperties, type ForwardedRef, type ReactNode } from "react";

import { resolveResizableMotionDefaults, useResizableRootMotion } from "./resizableAnimations";
import { ResizableLayoutProvider, ResizableMotionProvider } from "./resizableContext";
import { ResizableHandle, ResizablePanel } from "./resizableParts";
import { resizableRootClass } from "./resizableStyles";
import type { ResizableLayoutValue, ResizableOrientation, ResizablePartMotion, ResizableProps } from "./resizableTypes";

export type {
  ResizableClassNames,
  ResizableHandleProps,
  ResizableMotion,
  ResizableOrientation,
  ResizablePanelProps,
  ResizablePartMotion,
  ResizableProps,
} from "./resizableTypes";

export const Resizable = forwardRef<HTMLDivElement, ResizableProps>(function Resizable(
  {
    orientation = "horizontal",
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
  const motionDefaults = useMemo(() => resolveResizableMotionDefaults(), []);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const mins = useRef(new Map<string, number>());

  const commit = useCallback((updater: (prev: Record<string, number>) => Record<string, number>) => {
    setSizes((prev) => updater(prev));
  }, []);

  const handleCount = countResizableHandles(children);

  const layout = useMemo<ResizableLayoutValue>(() => ({
    orientation,
    sizes,
    panelClass: classNames?.panel,
    handleClass: classNames?.handle,
    commit,
    rememberMin: (id, min) => {
      mins.current.set(id, min);
    },
    forget: (id) => {
      mins.current.delete(id);
      commit((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    minOf: (id) => mins.current.get(id) ?? 8,
  }), [classNames?.handle, classNames?.panel, commit, orientation, sizes]);

  return (
    <ResizableMotionProvider
      motion={motion}
      defaults={motionDefaults}
      controller={motionController}
      motionState={motionState}
      motionPayload={motionPayload}
      playInitialState={playInitialState}
    >
      <ResizableLayoutProvider value={layout}>
        <ResizableSurface
          orientation={orientation}
          className={className}
          slotClass={classNames?.root}
          forwardedRef={ref}
          rootMotion={motion?.root}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          rest={rest}
          handleCount={handleCount}
        >
          {children}
        </ResizableSurface>
      </ResizableLayoutProvider>
    </ResizableMotionProvider>
  );
});

function ResizableSurface({
  orientation,
  className,
  slotClass,
  children,
  forwardedRef,
  rootMotion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
  handleCount,
}: {
  orientation: ResizableOrientation;
  className: string;
  slotClass?: string;
  children: ResizableProps["children"];
  forwardedRef: ForwardedRef<HTMLDivElement>;
  rootMotion?: ResizablePartMotion;
  onPointerOver: ResizableProps["onPointerOver"];
  onPointerOut: ResizableProps["onPointerOut"];
  onPointerDown: ResizableProps["onPointerDown"];
  onPointerUp: ResizableProps["onPointerUp"];
  handleCount: number;
  rest: Omit<
    ResizableProps,
    | "orientation"
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
  const part = useResizableRootMotion({
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
      className={resizableRootClass({ orientation, slotClass, className })}
      {...rest}
      {...part.pointerHandlers}
      style={{ ...rest.style, "--resizable-handles": handleCount } as CSSProperties}
      data-orientation={orientation}
    >
      {children}
    </div>
  );
}

function countResizableHandles(children: ReactNode): number {
  return Children.toArray(children).filter(
    (child) =>
      isValidElement(child) &&
      (child.type as { displayName?: string }).displayName === "Resizable.Handle",
  ).length;
}

Resizable.displayName = "Resizable";

export { ResizableHandle, ResizablePanel };
