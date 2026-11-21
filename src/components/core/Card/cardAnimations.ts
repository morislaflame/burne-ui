/**
 * Slot motion for Card — look here first.
 *
 * DOM slots: `root`, `title`, `description`, `header`, `headingBlock`, `body`, `footer`
 * (`content` is a layout wrapper, not a public motion slot)
 *
 * Host: root (`useCardAnimations`) plays `hoverIn` / `hoverOut` / `pressIn` / `pressOut`
 * when pressable (or when `motion.root` is set).
 * Defaults: `resolveCardMotionDefaults` (second-level lift + squeeze). A skin overlays its own recipes.
 */
import { killMotion } from "@/components/core/utils/gsapMotion";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";

import {
  isInteractivePressKey,
  isKitHoverLiftRecipe,
  primeInteractiveScaleRest,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import {
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
} from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";

import { overlaySkinMotion, usesKitElevation, usesKitElevationMember } from "@/skins/resolveVariantVisual";

import { isInteractiveCardDescendant } from "./cardAPI";
import { useCardMotionScope } from "./cardContext";
import type { CardMotion, CardVariant, UseCardAnimationsProps } from "./cardTypes";
import { KIT_CARD_VARIANTS } from "./cardTypes";

import { bindLiftRecipes } from "@/components/core/utils/slotMotion/recipes/bindLift";
import { bindSecondLevelRecipe } from "@/components/core/utils/slotMotion/recipes/bindSecondLevel";

bindLiftRecipes();
bindSecondLevelRecipe();

const CARD_VARIANT_HAS_HOVER_SHADOW = new Set<(typeof KIT_CARD_VARIANTS)[number]>([
  "default",
  "outline",
  "secondary",
]);

export function resolveCardMotionDefaults({
  variant,
  pressable,
}: {
  variant: CardVariant;
  pressable: boolean;
}): CardMotion {
  if (!pressable) return overlaySkinMotion({}, variant, KIT_CARD_VARIANTS, "card");
  const kit = usesKitElevation(variant, KIT_CARD_VARIANTS);
  return overlaySkinMotion(
    {
      root: kit
        ? {
            hoverIn: "hoverLiftSecondLevel",
            hoverOut: "hoverLiftSecondLevel",
            pressIn: "pressSqueeze",
            pressOut: false,
          }
        : { pressIn: false, pressOut: false },
    },
    variant,
    KIT_CARD_VARIANTS,
    "card");
}

export function useCardAnimations({
  pressable,
  disabled = false,
  variant,
  shadow = "base",
  motion,
  onClick: onClickProp,
  onKeyDown: onKeyDownProp,
  onPointerDown: onPointerDownProp,
  onPointerUp: onPointerUpProp,
  onPointerOver: onPointerOverProp,
  onPointerOut: onPointerOutProp,
  hoverPointerInsideRef,
  forwardedRef,
}: UseCardAnimationsProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const scope = useCardMotionScope();
  const rootMotionRef = useRef(motion?.root);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  rootMotionRef.current = motion?.root;

  const hasHoverShadow =
    pressable &&
    usesKitElevationMember(variant, KIT_CARD_VARIANTS, CARD_VARIANT_HAS_HOVER_SHADOW);

  // SkinShell registers the `root` slot via useMotionPart; keep a local ref for play/shadow.
  const setRootRef = useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node;
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef]);

  const secondLevelLift = useSecondLevelShadow(rootRef, hasHoverShadow, {
    interactive: false,
    shadowSize: shadow,
    pointerInsideRef: hoverPointerInsideRef,
    killMotionOnUnmount: false,
  });

  const config = useMotionConfig();
  const hoverEnabled = !disabled && (pressable || motion?.root != null);

  useLayoutEffect(() => {
    if (!pressable || disabled || hoverPointerInsideRef.current) return;
    const enterValue = scope.resolve("root", "enter", rootMotionRef.current);
    const hoverValue = scope.resolve("root", "hoverIn", rootMotionRef.current);
    if ((enterValue == null || enterValue === false) && isKitHoverLiftRecipe(hoverValue)) {
      primeInteractiveScaleRest(rootRef.current, config);
    }
  }, [config, disabled, hoverPointerInsideRef, pressable, scope, variant]);

  const playRoot = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      const el = rootRef.current;
      if (!el) return;
      const value = scope.resolve("root", phase, rootMotionRef.current);
      if (value === undefined) return;
      scope.play("root", phase, { partMotion: rootMotionRef.current, el });
    },
    [scope]);

  const motionPointer = useMotionPointerPhases<HTMLElement>({
    enabled: hoverEnabled,
    targetRef: rootRef,
    pointerInsideRef: hoverPointerInsideRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: () => playRoot("hoverIn"),
    onHoverOut: () => playRoot("hoverOut"),
  });

  useEffect(() => {
    if (pressable && !disabled) return;
    const el = rootRef.current;
    if (el) killMotion(el);
    hoverPointerInsideRef.current = false;
  }, [disabled, hoverPointerInsideRef, pressable]);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (disabled) return;
      onPointerDownProp?.(e);
      if (!pressable || e.defaultPrevented) return;
      if (isInteractiveCardDescendant(e.target, e.currentTarget)) return;
      playRoot("pressIn");
    },
    [disabled, onPointerDownProp, playRoot, pressable]);

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (disabled) return;
      onPointerUpProp?.(e);
      if (!pressable || e.defaultPrevented) return;
      if (isInteractiveCardDescendant(e.target, e.currentTarget)) return;
      playRoot("pressOut");
    },
    [disabled, onPointerUpProp, playRoot, pressable]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (isInteractiveCardDescendant(e.target, e.currentTarget)) return;
      onClickProp?.(e);
    },
    [disabled, onClickProp]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (disabled) {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
      if (isInteractiveCardDescendant(e.target, e.currentTarget)) return;
      onKeyDownProp?.(e);
      if (!pressable || e.defaultPrevented || !isInteractivePressKey(e)) return;
      playRoot("pressIn");
    },
    [disabled, onKeyDownProp, playRoot, pressable]);

  const pointerHandlers = useMemo(
    () =>
      mergeMotionPointerHandlers(
        onPointerOverProp,
        onPointerOutProp,
        motionPointer.onPointerOver,
        motionPointer.onPointerOut),
    [motionPointer.onPointerOut, motionPointer.onPointerOver, onPointerOutProp, onPointerOverProp]);

  const pressableLiftMotionClass = pressable
    ? usesKitElevation(variant, KIT_CARD_VARIANTS)
      ? secondLevelLift.motionClass
      : ""
    : "";

  return {
    setRootRef,
    pressableLiftMotionClass,
    handlePointerDown,
    handlePointerUp,
    handleClick,
    handleKeyDown,
    onPointerOver: pointerHandlers.onPointerOver,
    onPointerOut: pointerHandlers.onPointerOut,
    onPointerDownProp,
    onPointerUpProp,
    onClickProp,
    onKeyDownProp,
  };
}
