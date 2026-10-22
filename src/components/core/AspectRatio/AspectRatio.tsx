import { forwardRef, useMemo, type ForwardedRef } from "react";

import { useAspectRatioContentMotion, useAspectRatioRootMotion, resolveAspectRatioMotionDefaults } from "./aspectRatioAnimations";
import { AspectRatioMotionProvider } from "./aspectRatioContext";
import { aspectRatioContentClass, aspectRatioRootClass } from "./aspectRatioStyles";
import type { AspectRatioPartMotion, AspectRatioProps } from "./aspectRatioTypes";

export type {
  AspectRatioClassNames,
  AspectRatioMotion,
  AspectRatioPartMotion,
  AspectRatioProps,
  AspectRatioValue,
} from "./aspectRatioTypes";

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  {
    ratio = 1,
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
  const motionDefaults = useMemo(() => resolveAspectRatioMotionDefaults(), []);

  return (
    <AspectRatioMotionProvider
      motion={motion}
      defaults={motionDefaults}
      controller={motionController}
      motionState={motionState}
      motionPayload={motionPayload}
      playInitialState={playInitialState}
    >
      <AspectRatioSurface
        ratio={ratio}
        className={className}
        classNames={classNames}
        forwardedRef={ref}
        rootMotion={motion?.root}
        contentMotion={motion?.content}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        rest={rest}
      >
        {children}
      </AspectRatioSurface>
    </AspectRatioMotionProvider>
  );
});

function AspectRatioSurface({
  ratio,
  className,
  classNames,
  children,
  forwardedRef,
  rootMotion,
  contentMotion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
}: {
  ratio: NonNullable<AspectRatioProps["ratio"]>;
  className: string;
  classNames: AspectRatioProps["classNames"];
  children: AspectRatioProps["children"];
  forwardedRef: ForwardedRef<HTMLDivElement>;
  rootMotion?: AspectRatioPartMotion;
  contentMotion?: AspectRatioPartMotion;
  onPointerOver: AspectRatioProps["onPointerOver"];
  onPointerOut: AspectRatioProps["onPointerOut"];
  onPointerDown: AspectRatioProps["onPointerDown"];
  onPointerUp: AspectRatioProps["onPointerUp"];
  rest: Omit<
    AspectRatioProps,
    | "ratio"
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
  const part = useAspectRatioRootMotion({
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
      className={aspectRatioRootClass({ slotClass: classNames?.root, className })}
      {...rest}
      {...part.pointerHandlers}
      style={{ ...rest.style, aspectRatio: ratio }}
    >
      <AspectRatioContent slotClass={classNames?.content} motion={contentMotion}>
        {children}
      </AspectRatioContent>
    </div>
  );
}

function AspectRatioContent({
  slotClass,
  motion,
  children,
}: {
  slotClass?: string;
  motion?: AspectRatioPartMotion;
  children: AspectRatioProps["children"];
}) {
  const part = useAspectRatioContentMotion({ motion });
  return (
    <div ref={part.setRef} className={aspectRatioContentClass({ slotClass })} {...part.pointerHandlers}>
      {children}
    </div>
  );
}

AspectRatio.displayName = "AspectRatio";
