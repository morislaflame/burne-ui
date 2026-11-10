import { forwardRef, useMemo } from "react";

import { resolveContainerMotionDefaults, useContainerRootMotion } from "./containerAnimations";
import { ContainerMotionProvider } from "./containerContext";
import { containerRootClass } from "./containerStyles";
import type { ContainerPartMotion, ContainerProps } from "./containerTypes";

export type {
  ContainerClassNames,
  ContainerMotion,
  ContainerPadding,
  ContainerPartMotion,
  ContainerProps,
  ContainerMaxWidth,
} from "./containerTypes";

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  {
    maxWidth = "large",
    padding = "base",
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
  const motionDefaults = useMemo(() => resolveContainerMotionDefaults(), []);

  return (
    <ContainerMotionProvider
      motion={motion}
      defaults={motionDefaults}
      controller={motionController}
      motionState={motionState}
      motionPayload={motionPayload}
      playInitialState={playInitialState}
    >
      <ContainerSurface
        maxWidth={maxWidth}
        padding={padding}
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
      </ContainerSurface>
    </ContainerMotionProvider>
  );
});

function ContainerSurface({
  maxWidth,
  padding,
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
  maxWidth: NonNullable<ContainerProps["maxWidth"]>;
  padding: NonNullable<ContainerProps["padding"]>;
  className: string;
  classNames: ContainerProps["classNames"];
  children: ContainerProps["children"];
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  rootMotion?: ContainerPartMotion;
  onPointerOver: ContainerProps["onPointerOver"];
  onPointerOut: ContainerProps["onPointerOut"];
  onPointerDown: ContainerProps["onPointerDown"];
  onPointerUp: ContainerProps["onPointerUp"];
  rest: Omit<
    ContainerProps,
    | "maxWidth"
    | "padding"
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
  const part = useContainerRootMotion({
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
      className={containerRootClass({
        maxWidth,
        padding,
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

Container.displayName = "Container";
