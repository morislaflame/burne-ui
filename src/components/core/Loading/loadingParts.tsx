import { useMotionPart, useOptionalEnterOnMount } from "@/components/core/utils/slotMotion";

import { loadingVisualA11yProps } from "./loadingA11y";
import { useLoadingDotsAnimation } from "./loadingAnimations";
import { useOptionalLoadingMotionScope } from "./loadingContext";
import { loadingDotClass, loadingDotsTrackClass, loadingDotsTrackStyle, loadingSpinnerRingClass } from "./loadingStyles";
import type { LoadingColor, LoadingSize } from "./loadingTypes";
 
const LOADING_DOTS_INDICES = [0, 1, 2] as const;
 
export function LoadingSpinner({
  size,
  color,
  className,
}: {
  size: LoadingSize;
  color: LoadingColor;
  className?: string;
}) {
  const scope = useOptionalLoadingMotionScope();
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "spinner",
    pointerPhases: false,
  });
  useOptionalEnterOnMount(scope, "spinner", part.targetRef);
 
  return (
    <span
      ref={part.setRef}
      {...loadingVisualA11yProps()}
      className={loadingSpinnerRingClass(size, color, className)}
    />
  );
}
 
function LoadingDot({
  index,
  size,
  color,
  className,
}: {
  index: number;
  size: LoadingSize;
  color: LoadingColor;
  className?: string;
}) {
  const scope = useOptionalLoadingMotionScope();
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "dot",
    pointerPhases: false,
  });

  return (
    <span
      ref={part.setRef}
      data-loading-dot={index}
      className={loadingDotClass(size, color, className)}
    />
  );
}

export function LoadingDots({
  size,
  color,
  className,
  dotClassName,
}: {
  size: LoadingSize;
  color: LoadingColor;
  className?: string;
  dotClassName?: string;
}) {
  const scope = useOptionalLoadingMotionScope();
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "dots",
    pointerPhases: false,
  });
  useLoadingDotsAnimation(scope);
  useOptionalEnterOnMount(scope, "dots", part.targetRef);
 
  return (
    <span
      ref={part.setRef}
      className={loadingDotsTrackClass(size, className)}
      style={loadingDotsTrackStyle(size)}
      {...loadingVisualA11yProps()}
    >
      {LOADING_DOTS_INDICES.map((index) => (
        <LoadingDot key={index} index={index} size={size} color={color} className={dotClassName} />
      ))}
    </span>
  );
}
 
LoadingDots.displayName = "LoadingDots";
LoadingSpinner.displayName = "LoadingSpinner";
 