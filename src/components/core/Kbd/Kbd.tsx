import { forwardRef, useMemo, type HTMLAttributes } from "react";

import { resolveKbdMotionDefaults, useKbdAnimations } from "./kbdAnimations";
import { KbdBody } from "./kbdBodyPart";
import { KbdClassNamesProvider, KbdMotionProvider } from "./kbdContext";
import type { KbdMotion, KbdProps } from "./kbdTypes";
import { useKbdRootState } from "./useKbdRootState";

import { cn } from "@/utils/cn";

export type {
  KbdProps,
  KbdVariant,
  KbdSize,
  KbdClassNames,
  KbdGroupProps,
  KbdMotion,
  KbdPartMotion,
  KbdTextProps,
} from "./kbdTypes";

export const KbdRoot = forwardRef<HTMLElement, KbdProps>(function Kbd(
  {
    variant = "default",
    size = "base",
    classNames,
    className = "",
    children,
    hoverLift = true,
    motion,
    onPointerOver,
    onPointerOut,
    ...rest
  },
  ref,
) {
  const state = useKbdRootState({
    variant,
    size,
    className,
    classNames,
  });
  const motionDefaults = useMemo(
    () => resolveKbdMotionDefaults({ variant: state.variant, hoverLift }),
    [hoverLift, state.variant],
  );
  const motionParams = useMemo(
    () => ({ shadowSize: "base", variant: state.variant }),
    [state.variant],
  );

  return (
    <KbdClassNamesProvider classNames={classNames}>
      <KbdMotionProvider motion={motion} defaults={motionDefaults} params={motionParams}>
        <KbdSurface
          rootClass={state.rootClass}
          size={state.size}
          variant={state.variant}
          hoverLift={hoverLift}
          motion={motion}
          forwardedRef={ref}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          rest={rest}
        >
          {children}
        </KbdSurface>
      </KbdMotionProvider>
    </KbdClassNamesProvider>
  );
});

KbdRoot.displayName = "KbdRoot";

function KbdSurface({
  rootClass,
  size,
  variant,
  hoverLift,
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  rest,
  children,
}: {
  rootClass: string;
  size: NonNullable<KbdProps["size"]>;
  variant: NonNullable<KbdProps["variant"]>;
  hoverLift: boolean;
  motion?: KbdMotion;
  forwardedRef: React.ForwardedRef<HTMLElement>;
  onPointerOver: KbdProps["onPointerOver"];
  onPointerOut: KbdProps["onPointerOut"];
  rest: HTMLAttributes<HTMLElement>;
  children: KbdProps["children"];
}) {
  const animations = useKbdAnimations({
    variant,
    hoverLift,
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
  });

  return (
    <kbd
      ref={animations.setMergedRef}
      className={cn(rootClass, animations.motionClass)}
      {...animations.pointerHandlers}
      {...rest}
    >
      <KbdBody size={size}>{children}</KbdBody>
    </kbd>
  );
}
