import { forwardRef, useMemo, type HTMLAttributes } from "react";
 
import { resolveKbdMotionDefaults, useKbdAnimations } from "./kbdAnimations";
import { KbdBody } from "./kbdBodyPart";
import { KbdClassNamesProvider, KbdMotionProvider } from "./kbdContext";
import type { KbdMotion, KbdProps } from "./kbdTypes";
import { useKbdRootState } from "./useKbdRootState";
 
import { mergeSkinSurfaceStyle, useSkinRegistryRevision, useSkinSurfaceStyle } from "@/skins/skinContext";
import { dataVariantProps } from "@/components/core/utils/dataContract";
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
    variant,
    size = "base",
    classNames,
    className = "",
    children,
    hoverLift = true,
    motion,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
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
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(
    () => {
      void skinRevision;
      return resolveKbdMotionDefaults({ variant: state.variant, hoverLift });
    },
    [hoverLift, skinRevision, state.variant],
  );
  const motionParams = useMemo(
    () => ({ shadowSize: "base" as const, variant: state.variant }),
    [state.variant],
  );
 
  return (
    <KbdClassNamesProvider classNames={classNames}>
      <KbdMotionProvider
        motion={motion}
        defaults={motionDefaults}
        params={motionParams}
        controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
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
  const surfaceStyle = useSkinSurfaceStyle(variant);
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
      style={mergeSkinSurfaceStyle(surfaceStyle, rest.style)}
      {...dataVariantProps({ size, variant })}
    >
      <KbdBody size={size}>{children}</KbdBody>
    </kbd>
  );
}
 