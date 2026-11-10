import { useMotionPart, useOptionalEnterOnMount } from "@/components/core/utils/slotMotion";

import { loadingVisualA11yProps } from "./loadingA11y";
import { useLoadingDotsAnimation } from "./loadingAnimations";
import { useOptionalLoadingMotionScope } from "./loadingContext";
import { loadingDotClass, loadingDotPaint, loadingDotsTrackClass, loadingDotsTrackStyle, loadingSpinnerPaint, loadingSpinnerRingClass } from "./loadingStyles";
import type { LoadingSize, SemanticStatus } from "./loadingTypes";
 
const LOADING_DOTS_INDICES = [0, 1, 2] as const;
 
export function LoadingSpinner({
  size,
  color,
  status,
  className,
}: {
  size: LoadingSize;
  color?: string;
  status?: SemanticStatus;
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
      className={loadingSpinnerRingClass(size, color, status, className)}
      style={loadingSpinnerPaint(color, status).style}
    />
  );
}
 
function LoadingDot({
  index,
  size,
  color,
  status,
  className,
}: {
  index: number;
  size: LoadingSize;
  color?: string;
  status?: SemanticStatus;
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
      className={loadingDotClass(size, color, status, className)}
      style={loadingDotPaint(color, status).style}
    />
  );
}

export function LoadingDots({
  size,
  color,
  status,
  className,
  dotClassName,
}: {
  size: LoadingSize;
  color?: string;
  status?: SemanticStatus;
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
        <LoadingDot key={index} index={index} size={size} color={color} status={status} className={dotClassName} />
      ))}
    </span>
  );
}
 
LoadingDots.displayName = "LoadingDots";
LoadingSpinner.displayName = "LoadingSpinner";
 