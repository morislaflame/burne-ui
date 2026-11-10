import { forwardRef, useEffect, useMemo, type ForwardedRef } from "react";

import { resolveSidebarMotionDefaults, useSidebarRootMotion } from "./sidebarAnimations";
import { SidebarMotionProvider } from "./sidebarContext";
import { sidebarRootClass } from "./sidebarStyles";
import type { SidebarPartMotion, SidebarProps, SidebarSide } from "./sidebarTypes";

export type {
  SidebarClassNames,
  SidebarMotion,
  SidebarPartMotion,
  SidebarProps,
  SidebarSide,
  SidebarWidth,
} from "./sidebarTypes";

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    width = "small",
    side = "start",
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
  const motionDefaults = useMemo(() => resolveSidebarMotionDefaults(), []);

  return (
    <SidebarMotionProvider
      motion={motion}
      defaults={motionDefaults}
      controller={motionController}
      motionState={motionState}
      motionPayload={motionPayload}
      playInitialState={playInitialState}
    >
      <SidebarSurface
        width={width}
        side={side}
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
      </SidebarSurface>
    </SidebarMotionProvider>
  );
});

function SidebarSurface({
  width,
  side,
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
  width: NonNullable<SidebarProps["width"]>;
  side: SidebarSide;
  className: string;
  classNames: SidebarProps["classNames"];
  children: SidebarProps["children"];
  forwardedRef: ForwardedRef<HTMLElement>;
  rootMotion?: SidebarPartMotion;
  onPointerOver: SidebarProps["onPointerOver"];
  onPointerOut: SidebarProps["onPointerOut"];
  onPointerDown: SidebarProps["onPointerDown"];
  onPointerUp: SidebarProps["onPointerUp"];
  rest: Omit<
    SidebarProps,
    | "width"
    | "side"
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
  const ariaLabel = typeof rest["aria-label"] === "string" ? rest["aria-label"] : "";
  const ariaLabelledBy = typeof rest["aria-labelledby"] === "string" ? rest["aria-labelledby"] : "";
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (ariaLabel.trim() !== "" || ariaLabelledBy.trim() !== "") return;
    console.error("[burne-ui] Sidebar requires aria-label or aria-labelledby.");
  }, [ariaLabel, ariaLabelledBy]);

  const part = useSidebarRootMotion({
    forwardedRef,
    motion: rootMotion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <aside
      ref={part.setRef}
      className={sidebarRootClass({ width, side, slotClass: classNames?.root, className })}
      {...rest}
      {...part.pointerHandlers}
      data-side={side}
    >
      {children}
    </aside>
  );
}

Sidebar.displayName = "Sidebar";
