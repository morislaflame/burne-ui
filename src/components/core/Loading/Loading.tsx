import { forwardRef, useMemo } from "react";
 
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { cn } from "@/utils/cn";
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";
 
import { useBurneLabel } from "@/theme/BurneLabelsProvider";

import { loadingStatusProps } from "./loadingA11y";
import { resolveLoadingMotionDefaults } from "./loadingAnimations";
import { LOADING_DOTS_LAYOUT } from "./loadingStyles";
import { LoadingMotionProvider, useLoadingMotionScope } from "./loadingContext";
import { LoadingDots, LoadingSpinner } from "./loadingParts";
import { LOADING_ROOT_CLASS } from "./loadingStyles";
import type { LoadingPartMotion, LoadingProps } from "./loadingTypes";
 
export type {
  LoadingClassNames,
  LoadingColor,
  LoadingMotion,
  LoadingPartMotion,
  LoadingProps,
  LoadingSize,
  LoadingIndicator,
} from "./loadingTypes";
 
export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(function Loading(
  {
    indicator = "spinner",
    size = "base",
    color,
    status,
    "aria-label": ariaLabel,
    className = "",
    classNames,
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
  const fallbackLabel = useBurneLabel("loading");
  const label = ariaLabel ?? fallbackLabel;
  const motionDefaults = useMemo(() => resolveLoadingMotionDefaults(), []);
  const dotLayout = indicator === "dots" ? LOADING_DOTS_LAYOUT[size] : undefined;
  const motionParams = useMemo(
    () =>
      dotLayout
        ? { loadingDot: { jumpPx: dotLayout.jumpPx, scalePeak: dotLayout.scalePeak } }
        : undefined,
    [dotLayout],
  );

  return (
    <LoadingMotionProvider motion={motion} defaults={motionDefaults} params={motionParams} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
      <LoadingSurface
        indicator={indicator}
        size={size}
        color={color}
        status={status}
        label={label}
        className={className}
        classNames={classNames}
        forwardedRef={ref}
        rootMotion={motion?.root}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        rest={rest}
      />
    </LoadingMotionProvider>
  );
});
 
function LoadingSurface({
  indicator,
  size,
  color,
  status,
  label,
  className,
  classNames,
  forwardedRef,
  rootMotion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
}: {
  indicator: NonNullable<LoadingProps["indicator"]>;
  size: NonNullable<LoadingProps["size"]>;
  color: LoadingProps["color"];
  status: LoadingProps["status"];
  label: string;
  className: string;
  classNames: LoadingProps["classNames"];
  forwardedRef: React.ForwardedRef<HTMLSpanElement>;
  rootMotion?: LoadingPartMotion;
  onPointerOver: LoadingProps["onPointerOver"];
  onPointerOut: LoadingProps["onPointerOut"];
  onPointerDown: LoadingProps["onPointerDown"];
  onPointerUp: LoadingProps["onPointerUp"];
  rest: Omit<
    LoadingProps,
    | "indicator"
    | "size"
    | "color"
    | "status"
    | "className"
    | "classNames"
    | "motion"
    | "motionController"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
  >;
}) {
  const scope = useLoadingMotionScope();
  const pointer = hasPointerPhases(rootMotion);
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "root",
    motion: rootMotion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "root", part.targetRef);
 
  return (
    <span
      ref={part.setRef}
      {...loadingStatusProps(label)}
      className={cn(LOADING_ROOT_CLASS, classNames?.root, className)}
      {...rest}
      {...part.pointerHandlers}
      {...dataVariantProps({ size })}
    >
      {indicator === "dots" ? (
        <LoadingDots
          size={size}
          color={color}
          status={status}
          className={classNames?.dots}
          dotClassName={classNames?.dot}
        />
      ) : (
        <LoadingSpinner size={size} color={color} status={status} className={classNames?.spinner} />
      )}
    </span>
  );
}
 
Loading.displayName = "Loading";
 