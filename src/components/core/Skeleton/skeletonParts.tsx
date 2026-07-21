import { forwardRef } from "react";

import { skeletonPresentationProps } from "./skeletonA11y";
import {
  SKELETON_BASE_CLASS,
  SKELETON_BLOCK_CLASS,
  SKELETON_CIRCLE_RADIUS_CLASS,
  SKELETON_CIRCLE_SIZE_DEFAULT,
  SKELETON_TEXT_LINE_CLASS,
  SKELETON_TEXT_LINE_FULL_CLASS,
  SKELETON_TEXT_LINE_LAST_SHORT_CLASS,
  SKELETON_TEXT_ROOT_CLASS,
  SKELETON_WAVE_OVERLAY_CLASS,
  skeletonLineAnimationDelay,
  skeletonVariantStyle,
  skeletonWaveOverlayStyle,
} from "./skeletonStyles";
import type {
  SkeletonBlockProps,
  SkeletonCircleProps,
  SkeletonTextProps,
  SkeletonWaveProps,
} from "./skeletonTypes";

import { cn } from "@/utils/cn";

export function SkeletonWave({ className, style }: SkeletonWaveProps) {
  return (
    <span
      aria-hidden
      className={cn(SKELETON_WAVE_OVERLAY_CLASS, className)}
      style={{ ...skeletonWaveOverlayStyle(), ...style }}
    />
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
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          SKELETON_BASE_CLASS,
          SKELETON_CIRCLE_RADIUS_CLASS,
          size,
          classNames?.root,
          className,
        )}
        style={{ ...skeletonVariantStyle(animation), ...style }}
        {...skeletonPresentationProps()}
        {...rest}
      >
        {animation === "wave" ? <SkeletonWave className={classNames?.wave} /> : null}
      </div>
    );
  },
);

SkeletonCircle.displayName = "SkeletonCircle";

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText(
  {
    animation = "wave",
    lines = 3,
    lastShort = true,
    className,
    classNames,
    style,
    ...rest
  },
  ref,
) {
  const lineWidths = Array.from({ length: lines }, (_, index) => {
    if (lastShort && index === lines - 1) return SKELETON_TEXT_LINE_LAST_SHORT_CLASS;
    return SKELETON_TEXT_LINE_FULL_CLASS;
  });

  return (
    <div
      ref={ref}
      className={cn(SKELETON_TEXT_ROOT_CLASS, classNames?.root, className)}
      style={style}
      {...skeletonPresentationProps()}
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
});

SkeletonText.displayName = "SkeletonText";

export const SkeletonBlock = forwardRef<HTMLDivElement, SkeletonBlockProps>(function SkeletonBlock(
  { animation = "wave", className, classNames, style, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        SKELETON_BASE_CLASS,
        SKELETON_BLOCK_CLASS,
        classNames?.root,
        className,
      )}
      style={{ ...skeletonVariantStyle(animation), ...style }}
      {...skeletonPresentationProps()}
      {...rest}
    >
      {animation === "wave" ? <SkeletonWave className={classNames?.wave} /> : null}
      {children}
    </div>
  );
});

SkeletonBlock.displayName = "SkeletonBlock";
