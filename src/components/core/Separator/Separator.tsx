import { forwardRef, useMemo, type Ref } from "react";

import { separatorAriaOrientation } from "./separatorA11y";
import { resolveSeparatorMotionDefaults, useSeparatorRootMotion } from "./separatorAnimations";
import { SeparatorMotionProvider } from "./separatorContext";
import { separatorRootClass } from "./separatorStyles";
import type { SeparatorPartMotion, SeparatorProps } from "./separatorTypes";

export type {
  SeparatorOrientation,
  SeparatorProps,
  SeparatorMotion,
  SeparatorPartMotion,
} from "./separatorTypes";

export const Separator = forwardRef<HTMLElement, SeparatorProps>(function Separator(
  {
    orientation = "horizontal",
    className = "",
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const motionDefaults = useMemo(() => resolveSeparatorMotionDefaults(), []);

  return (
    <SeparatorMotionProvider motion={motion} defaults={motionDefaults}>
      <SeparatorSurface
        orientation={orientation}
        className={className}
        forwardedRef={ref}
        rootMotion={motion?.root}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        rest={rest}
      />
    </SeparatorMotionProvider>
  );
});

function SeparatorSurface({
  orientation,
  className,
  forwardedRef,
  rootMotion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
}: {
  orientation: NonNullable<SeparatorProps["orientation"]>;
  className: string;
  forwardedRef: React.ForwardedRef<HTMLElement>;
  rootMotion?: SeparatorPartMotion;
  onPointerOver: SeparatorProps["onPointerOver"];
  onPointerOut: SeparatorProps["onPointerOut"];
  onPointerDown: SeparatorProps["onPointerDown"];
  onPointerUp: SeparatorProps["onPointerUp"];
  rest: Omit<
    SeparatorProps,
    | "orientation"
    | "className"
    | "motion"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
  >;
}) {
  const sharedClassName = separatorRootClass(orientation, className);
  const part = useSeparatorRootMotion({
    forwardedRef,
    motion: rootMotion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  if (orientation === "horizontal") {
    return (
      <hr
        ref={part.setRef as Ref<HTMLHRElement>}
        className={sharedClassName}
        {...part.pointerHandlers}
        {...rest}
      />
    );
  }

  return (
    <div
      ref={part.setRef as Ref<HTMLDivElement>}
      role="separator"
      aria-orientation={separatorAriaOrientation(orientation)}
      className={sharedClassName}
      {...part.pointerHandlers}
      {...rest}
    />
  );
}

Separator.displayName = "Separator";
