import { forwardRef, useMemo, type ForwardedRef } from "react";

import { resolveHeaderMotionDefaults, useHeaderRootMotion } from "./headerAnimations";
import { HeaderMotionProvider } from "./headerContext";
import { headerRootClass } from "./headerStyles";
import type { HeaderPartMotion, HeaderProps } from "./headerTypes";

export type {
  HeaderClassNames,
  HeaderMotion,
  HeaderPartMotion,
  HeaderProps,
} from "./headerTypes";

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  {
    sticky = false,
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
  const motionDefaults = useMemo(() => resolveHeaderMotionDefaults(), []);

  return (
    <HeaderMotionProvider
      motion={motion}
      defaults={motionDefaults}
      controller={motionController}
      motionState={motionState}
      motionPayload={motionPayload}
      playInitialState={playInitialState}
    >
      <HeaderSurface
        sticky={sticky}
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
      </HeaderSurface>
    </HeaderMotionProvider>
  );
});

function HeaderSurface({
  sticky,
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
  sticky: boolean;
  className: string;
  classNames: HeaderProps["classNames"];
  children: HeaderProps["children"];
  forwardedRef: ForwardedRef<HTMLElement>;
  rootMotion?: HeaderPartMotion;
  onPointerOver: HeaderProps["onPointerOver"];
  onPointerOut: HeaderProps["onPointerOut"];
  onPointerDown: HeaderProps["onPointerDown"];
  onPointerUp: HeaderProps["onPointerUp"];
  rest: Omit<
    HeaderProps,
    | "sticky"
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
  const part = useHeaderRootMotion({
    forwardedRef,
    motion: rootMotion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <header
      ref={part.setRef}
      className={headerRootClass({ sticky, slotClass: classNames?.root, className })}
      {...rest}
      {...part.pointerHandlers}
    >
      {children}
    </header>
  );
}

Header.displayName = "Header";
