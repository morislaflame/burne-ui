import { forwardRef } from "react";

import { skeletonPresentationProps } from "./skeletonA11y";
import { skeletonVariantStyle } from "./skeletonAPI";
import {
  mergeSkeletonSlotClass,
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
  skeletonRadiusClass,
  skeletonWaveOverlayStyle,
} from "./skeletonStyles";
import type {
  SkeletonBlockProps,
  SkeletonCircleProps,
  SkeletonProps,
  SkeletonTextProps,
  SkeletonWaveProps,
} from "./skeletonTypes";

function SkeletonWave({ className, style }: SkeletonWaveProps) {
  return (
    <span
      aria-hidden
      className={mergeSkeletonSlotClass(SKELETON_WAVE_OVERLAY_CLASS, className)}
      style={{ ...skeletonWaveOverlayStyle(), ...style }}
    />
  );
}

export const SkeletonRoot = forwardRef<HTMLDivElement, SkeletonProps>(function SkeletonRoot(
  {
    variant = "wave",
    radius = "small",
    className,
    classNames,
    style,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={mergeSkeletonSlotClass(
        SKELETON_BASE_CLASS,
        skeletonRadiusClass(radius),
        classNames?.root,
        className,
      )}
      style={{ ...skeletonVariantStyle(variant), ...style }}
      {...skeletonPresentationProps()}
      {...rest}
    >
      {variant === "wave" ? <SkeletonWave className={classNames?.wave} /> : null}
      {children}
    </div>
  );
});

SkeletonRoot.displayName = "Skeleton";

export const SkeletonCircle = forwardRef<HTMLDivElement, SkeletonCircleProps>(
  function SkeletonCircle(
    {
      variant = "wave",
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
        className={mergeSkeletonSlotClass(
          SKELETON_BASE_CLASS,
          SKELETON_CIRCLE_RADIUS_CLASS,
          size,
          classNames?.root,
          className,
        )}
        style={{ ...skeletonVariantStyle(variant), ...style }}
        {...skeletonPresentationProps()}
        {...rest}
      >
        {variant === "wave" ? <SkeletonWave className={classNames?.wave} /> : null}
      </div>
    );
  },
);

SkeletonCircle.displayName = "SkeletonCircle";

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText(
  {
    variant = "wave",
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
      className={mergeSkeletonSlotClass(SKELETON_TEXT_ROOT_CLASS, classNames?.root, className)}
      style={style}
      {...skeletonPresentationProps()}
      {...rest}
    >
      {lineWidths.map((widthClass, index) => (
        <div
          key={index}
          className={mergeSkeletonSlotClass(
            SKELETON_BASE_CLASS,
            SKELETON_TEXT_LINE_CLASS,
            widthClass,
            classNames?.line,
          )}
          style={{
            ...skeletonVariantStyle(variant),
            animationDelay: skeletonLineAnimationDelay(index),
          }}
        >
          {variant === "wave" ? <SkeletonWave className={classNames?.wave} /> : null}
        </div>
      ))}
    </div>
  );
});

SkeletonText.displayName = "SkeletonText";

export const SkeletonBlock = forwardRef<HTMLDivElement, SkeletonBlockProps>(function SkeletonBlock(
  { variant = "wave", className, classNames, style, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={mergeSkeletonSlotClass(
        SKELETON_BASE_CLASS,
        SKELETON_BLOCK_CLASS,
        classNames?.root,
        className,
      )}
      style={{ ...skeletonVariantStyle(variant), ...style }}
      {...skeletonPresentationProps()}
      {...rest}
    >
      {variant === "wave" ? <SkeletonWave className={classNames?.wave} /> : null}
      {children}
    </div>
  );
});

SkeletonBlock.displayName = "SkeletonBlock";
