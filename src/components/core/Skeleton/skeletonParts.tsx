import { forwardRef, useMemo } from "react";
 
import { skeletonPresentationProps, skeletonRegionA11yProps } from "./skeletonA11y";
import { resolveSkeletonMotionDefaults, useSkeletonSlotMotion } from "./skeletonAnimations";
import { SkeletonMotionProvider, useSkeletonMotionScope } from "./skeletonContext";
import { SKELETON_BASE_CLASS, SKELETON_BLOCK_CLASS, SKELETON_CIRCLE_RADIUS_CLASS, SKELETON_CIRCLE_SIZE_DEFAULT, SKELETON_TEXT_LINE_CLASS, SKELETON_TEXT_LINE_FULL_CLASS, SKELETON_TEXT_LINE_LAST_SHORT_CLASS, SKELETON_TEXT_ROOT_CLASS, SKELETON_WAVE_OVERLAY_CLASS, skeletonLineAnimationDelay, skeletonVariantStyle, skeletonWaveOverlayStyle } from "./skeletonStyles";
import type { MotionController, MotionMapWithEvents, MotionStateHostProps } from "@/components/core/utils/slotMotion";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { cn } from "@/utils/cn";
 
import type {
  SkeletonBlockProps,
  SkeletonCircleProps,
  SkeletonMotion,
  SkeletonPartMotion,
  SkeletonRegionProps,
  SkeletonTextProps,
  SkeletonWaveProps,
} from "./skeletonTypes";
 
export function SkeletonWave({ className, style }: SkeletonWaveProps) {
  return (
    <span
      aria-hidden
      className={cn(SKELETON_WAVE_OVERLAY_CLASS, className)}
      style={{ ...skeletonWaveOverlayStyle(), ...style }}
    />
  );
}
 
function SkeletonPartProvider({
  motion,
  controller,
  motionState,
  motionPayload,
  playInitialState,
  children,
}: {
  motion?: MotionMapWithEvents<SkeletonMotion>;
  controller?: MotionController;
  children: React.ReactNode;
} & MotionStateHostProps) {
  const motionDefaults = useMemo(() => resolveSkeletonMotionDefaults(), []);
  return (
    <SkeletonMotionProvider motion={motion} defaults={motionDefaults} controller={controller}
      motionState={motionState}
      motionPayload={motionPayload}
      playInitialState={playInitialState}>
      {children}
    </SkeletonMotionProvider>
  );
}
 
export const SkeletonCircle = forwardRef<HTMLDivElement, SkeletonCircleProps>(
  function SkeletonCircle(
    {
      animation = "wave",
      size = SKELETON_CIRCLE_SIZE_DEFAULT,
      className,
      classNames,
      style,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      ...rest
    },
    ref,
  ) {
    return (
      <SkeletonPartProvider motion={motion} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
        <SkeletonCircleSurface
          animation={animation}
          size={size}
          className={className}
          classNames={classNames}
          style={style}
          forwardedRef={ref}
          rootMotion={motion?.root}
          rest={rest}
        />
      </SkeletonPartProvider>
    );
  },
);
 
function SkeletonCircleSurface({
  animation,
  size,
  className,
  classNames,
  style,
  forwardedRef,
  rootMotion,
  rest,
}: {
  animation: NonNullable<SkeletonCircleProps["animation"]>;
  size: string;
  className: SkeletonCircleProps["className"];
  classNames: SkeletonCircleProps["classNames"];
  style: SkeletonCircleProps["style"];
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  rootMotion?: SkeletonPartMotion;
  rest: Omit<
    SkeletonCircleProps,
    "animation" | "size" | "className" | "classNames" | "style" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"
  >;
}) {
  const part = useSkeletonSlotMotion<HTMLDivElement>({
    scope: useSkeletonMotionScope(),
    slot: "root",
    motion: rootMotion,
    forwardedRef,
  });
 
  return (
    <div
      ref={part.setRef}
      className={cn(
        SKELETON_BASE_CLASS,
        SKELETON_CIRCLE_RADIUS_CLASS,
        size,
        classNames?.root,
        className,
      )}
      style={{ ...skeletonVariantStyle(animation), ...style }}
      {...skeletonPresentationProps()}
      {...part.pointerHandlers}
      {...rest}
      {...dataVariantProps({ size })}
    >
      {animation === "wave" ? <SkeletonWave className={classNames?.wave} /> : null}
    </div>
  );
}
 
SkeletonCircle.displayName = "SkeletonCircle";
 
export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText(
  {
    animation = "wave",
    lines = 3,
    lastShort = true,
    className,
    classNames,
    style,
    motion,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
    ...rest
  },
  ref,
) {
  return (
    <SkeletonPartProvider motion={motion} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
      <SkeletonTextSurface
        animation={animation}
        lines={lines}
        lastShort={lastShort}
        className={className}
        classNames={classNames}
        style={style}
        forwardedRef={ref}
        rootMotion={motion?.root}
        rest={rest}
      />
    </SkeletonPartProvider>
  );
});
 
function SkeletonTextSurface({
  animation,
  lines,
  lastShort,
  className,
  classNames,
  style,
  forwardedRef,
  rootMotion,
  rest,
}: {
  animation: NonNullable<SkeletonTextProps["animation"]>;
  lines: number;
  lastShort: boolean;
  className: SkeletonTextProps["className"];
  classNames: SkeletonTextProps["classNames"];
  style: SkeletonTextProps["style"];
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  rootMotion?: SkeletonPartMotion;
  rest: Omit<
    SkeletonTextProps,
    "animation" | "lines" | "lastShort" | "className" | "classNames" | "style" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"
  >;
}) {
  const part = useSkeletonSlotMotion<HTMLDivElement>({
    scope: useSkeletonMotionScope(),
    slot: "root",
    motion: rootMotion,
    forwardedRef,
  });
  const lineWidths = Array.from({ length: lines }, (_, index) => {
    if (lastShort && index === lines - 1) return SKELETON_TEXT_LINE_LAST_SHORT_CLASS;
    return SKELETON_TEXT_LINE_FULL_CLASS;
  });
 
  return (
    <div
      ref={part.setRef}
      className={cn(SKELETON_TEXT_ROOT_CLASS, classNames?.root, className)}
      style={style}
      {...skeletonPresentationProps()}
      {...part.pointerHandlers}
      {...rest}
    >
      {lineWidths.map((widthClass, index) => (
        <div
          key={index}
          className={cn(
            SKELETON_BASE_CLASS,
            SKELETON_TEXT_LINE_CLASS,
            widthClass,
            classNames?.line,
          )}
          style={{
            ...skeletonVariantStyle(animation),
            animationDelay: skeletonLineAnimationDelay(index),
          }}
        >
          {animation === "wave" ? <SkeletonWave className={classNames?.wave} /> : null}
        </div>
      ))}
    </div>
  );
}
 
SkeletonText.displayName = "SkeletonText";
 
export const SkeletonBlock = forwardRef<HTMLDivElement, SkeletonBlockProps>(function SkeletonBlock(
  { animation = "wave", className, classNames, style, children, motion, motionController, motionState, motionPayload, playInitialState, ...rest },
  ref,
) {
  return (
    <SkeletonPartProvider motion={motion} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
      <SkeletonBlockSurface
        animation={animation}
        className={className}
        classNames={classNames}
        style={style}
        forwardedRef={ref}
        rootMotion={motion?.root}
        rest={rest}
      >
        {children}
      </SkeletonBlockSurface>
    </SkeletonPartProvider>
  );
});
 
function SkeletonBlockSurface({
  animation,
  className,
  classNames,
  style,
  children,
  forwardedRef,
  rootMotion,
  rest,
}: {
  animation: NonNullable<SkeletonBlockProps["animation"]>;
  className: SkeletonBlockProps["className"];
  classNames: SkeletonBlockProps["classNames"];
  style: SkeletonBlockProps["style"];
  children: SkeletonBlockProps["children"];
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  rootMotion?: SkeletonPartMotion;
  rest: Omit<
    SkeletonBlockProps,
    "animation" | "className" | "classNames" | "style" | "children" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"
  >;
}) {
  const part = useSkeletonSlotMotion<HTMLDivElement>({
    scope: useSkeletonMotionScope(),
    slot: "root",
    motion: rootMotion,
    forwardedRef,
  });
 
  return (
    <div
      ref={part.setRef}
      className={cn(
        SKELETON_BASE_CLASS,
        SKELETON_BLOCK_CLASS,
        classNames?.root,
        className,
      )}
      style={{ ...skeletonVariantStyle(animation), ...style }}
      {...skeletonPresentationProps()}
      {...part.pointerHandlers}
      {...rest}
    >
      {animation === "wave" ? <SkeletonWave className={classNames?.wave} /> : null}
      {children}
    </div>
  );
}
 
SkeletonBlock.displayName = "SkeletonBlock";
 
export const SkeletonRegion = forwardRef<HTMLDivElement, SkeletonRegionProps>(
  function SkeletonRegion(
    { busy = true, className, classNames, children, motion, motionController, motionState, motionPayload, playInitialState, ...rest },
    ref,
  ) {
    return (
      <SkeletonPartProvider motion={motion} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
        <SkeletonRegionSurface
          busy={busy}
          className={className}
          classNames={classNames}
          forwardedRef={ref}
          regionMotion={motion?.region}
          rest={rest}
        >
          {children}
        </SkeletonRegionSurface>
      </SkeletonPartProvider>
    );
  },
);
 
function SkeletonRegionSurface({
  busy,
  className,
  classNames,
  children,
  forwardedRef,
  regionMotion,
  rest,
}: {
  busy: boolean;
  className: SkeletonRegionProps["className"];
  classNames: SkeletonRegionProps["classNames"];
  children: SkeletonRegionProps["children"];
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  regionMotion?: SkeletonPartMotion;
  rest: Omit<
    SkeletonRegionProps,
    "busy" | "className" | "classNames" | "children" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"
  >;
}) {
  const part = useSkeletonSlotMotion<HTMLDivElement>({
    scope: useSkeletonMotionScope(),
    slot: "region",
    motion: regionMotion,
    forwardedRef,
  });
 
  return (
    <div
      ref={part.setRef}
      className={cn(classNames?.root, className)}
      {...skeletonRegionA11yProps(busy)}
      {...part.pointerHandlers}
      {...rest}
    >
      {children}
    </div>
  );
}
 
SkeletonRegion.displayName = "SkeletonRegion";
 