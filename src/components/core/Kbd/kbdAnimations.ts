/**
 * Slot motion for Kbd — look here first.
 *
 * DOM slots: `root` (`<kbd>`), `text` (`Kbd.Text`), `group` (`Kbd.Group` wrap).
 * Separator between keys is layout-only (`classNames.separator`).
 *
 * Host: root (`useKbdAnimations`) plays pointer `hoverIn` / `hoverOut`.
 * `Kbd.Group` registers `group` on an ancestor Kbd scope, or creates its own
 * scope when used standalone with `motion`.
 * Defaults: `resolveKbdMotionDefaults` (second-level lift). A skin overlays its own recipes.
 */
import { useCallback, useMemo, useRef, type ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
 
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { mergeMotionPointerHandlers, useMotionPointerPhases, hasPointerPhases, useMotionPart, useOptionalEnterOnMount } from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";
 
import { useKbdMotionScope, useOptionalKbdMotionScope } from "./kbdContext";
import type { KbdMotion, KbdPartMotion, KbdVariant, UseKbdAnimationsProps } from "./kbdTypes";
import { KIT_KBD_VARIANTS } from "./kbdTypes";
 
 
export function resolveKbdMotionDefaults({
  variant,
  hoverLift,
}: {
  variant: KbdVariant;
  hoverLift: boolean;
}): KbdMotion {
  const rootPhase = hoverLift ? "hoverLiftSecondLevel" : false;
  return overlaySkinMotion(
    { root: { hoverIn: rootPhase, hoverOut: rootPhase } },
    variant,
    KIT_KBD_VARIANTS,
    "kbd",
  );
}
 
export function useKbdAnimations({
  variant,
  hoverLift = true,
  motion,
  forwardedRef,
  onPointerOver: onPointerOverProp,
  onPointerOut: onPointerOutProp,
}: UseKbdAnimationsProps) {
  const kitSurface = isKitVariant(variant, KIT_KBD_VARIANTS);
  const rootRef = useRef<HTMLElement | null>(null);
  const scope = useKbdMotionScope();
  const rootMotionRef = useRef(motion?.root);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  rootMotionRef.current = motion?.root;
 
  const secondLevelLift = useSecondLevelShadow(rootRef, kitSurface && hoverLift, {
    interactive: false,
  });
 
  const setMergedRef = useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node;
      scope.registerTarget("root", node);
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef, scope],
  );
 
  const motionPointer = useMotionPointerPhases<HTMLElement>({
    enabled: true,
    targetRef: rootRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: (el) => {
      const value = scope.resolve("root", "hoverIn", rootMotionRef.current);
      if (value === undefined) return;
      scope.play("root", "hoverIn", { partMotion: rootMotionRef.current, el });
    },
    onHoverOut: (el) => {
      const value = scope.resolve("root", "hoverOut", rootMotionRef.current);
      if (value === undefined) return;
      scope.play("root", "hoverOut", { partMotion: rootMotionRef.current, el });
    },
  });
 
  const pointerHandlers = useMemo(
    () =>
      mergeMotionPointerHandlers(
        onPointerOverProp,
        onPointerOutProp,
        motionPointer.onPointerOver,
        motionPointer.onPointerOut,
      ),
    [motionPointer.onPointerOut, motionPointer.onPointerOver, onPointerOutProp, onPointerOverProp],
  );
 
  const motionClass = kitSurface && hoverLift ? secondLevelLift.motionClass : "";
 
  return {
    setMergedRef,
    motionClass,
    pointerHandlers,
  };
}
 
export function useKbdGroupSlotMotion(
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
  }: {
    motion?: KbdPartMotion;
    forwardedRef?: ForwardedRef<HTMLSpanElement>;
    onPointerOver?: (e: ReactPointerEvent<HTMLSpanElement>) => void;
    onPointerOut?: (e: ReactPointerEvent<HTMLSpanElement>) => void;
  } = {},
) {
  const scope = useOptionalKbdMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.group);
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "group",
    motion,
    forwardedRef,
    pointerPhases: pointer,
    onPointerOver,
    onPointerOut,
  });
  useOptionalEnterOnMount(scope, "group", part.targetRef);
  return part;
}
