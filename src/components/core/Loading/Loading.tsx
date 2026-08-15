import { forwardRef, useMemo } from "react";

import { cn } from "@/utils/cn";
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { LOADING_DEFAULT_LABEL, loadingStatusProps } from "./loadingA11y";
import { resolveLoadingMotionDefaults } from "./loadingAnimations";
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
  LoadingType,
} from "./loadingTypes";

export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(function Loading(
  {
    type = "spinner",
    size = "base",
    color = "primary",
    label = LOADING_DEFAULT_LABEL,
    className = "",
    classNames,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const motionDefaults = useMemo(() => resolveLoadingMotionDefaults(), []);

  return (
    <LoadingMotionProvider motion={motion} defaults={motionDefaults}>
      <LoadingSurface
        type={type}
        size={size}
        color={color}
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
  type,
  size,
  color,
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
  type: NonNullable<LoadingProps["type"]>;
  size: NonNullable<LoadingProps["size"]>;
  color: NonNullable<LoadingProps["color"]>;
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
    | "type"
    | "size"
    | "color"
    | "label"
    | "className"
    | "classNames"
    | "motion"
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
  useOptionalEnterOnMount(scope, "root");

  return (
    <span
      ref={part.setRef}
      {...loadingStatusProps(label)}
      className={cn(LOADING_ROOT_CLASS, classNames?.root, className)}
      {...part.pointerHandlers}
      {...rest}
    >
      {type === "dots" ? (
        <LoadingDots
          size={size}
          color={color}
          className={classNames?.dots}
          dotClassName={classNames?.dot}
        />
      ) : (
        <LoadingSpinner size={size} color={color} className={classNames?.spinner} />
      )}
    </span>
  );
}

Loading.displayName = "Loading";
