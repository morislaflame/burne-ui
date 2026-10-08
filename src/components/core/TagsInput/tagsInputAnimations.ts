/**
 * Slot motion for TagsInput — look here first.
 *
 * DOM slots: `shell` (host), `tag` (repeated chip), `remove`, `input`, `label`, `hint`, `error`
 *
 * Root owns the scope. The shell is the field surface: rest shadow, lift on hover.
 */
import { useRef, type ForwardedRef, type PointerEventHandler } from "react";

import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  type MotionPartPhases,
} from "@/components/core/utils/slotMotion";
import { KIT_INPUT_VARIANTS, type InputVariant } from "@/components/core/Input/inputTypes";
import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";

import { useOptionalTagsInputMotionScope, useTagsInputContext } from "./tagsInputContext";
import type { TagsInputMotion, TagsInputPartMotion } from "./tagsInputTypes";

export function resolveTagsInputMotionDefaults({
  variant,
  disabled,
}: {
  variant: InputVariant;
  disabled: boolean;
}): TagsInputMotion {
  const active = !disabled;
  return overlaySkinMotion(
    {
      shell: {
        hoverIn: active ? "hoverLiftSecondLevel" : false,
        hoverOut: active ? "hoverLiftSecondLevel" : false,
      },
    },
    variant,
    KIT_INPUT_VARIANTS,
    "tagsInput",
  );
}

export function resolveTagsInputMotionParams({
  variant,
  disabled,
}: {
  variant: InputVariant;
  disabled: boolean;
}) {
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  return {
    shadowSize: "base" as const,
    hasHoverShadow: !disabled && kitSurface,
  };
}

export function useTagsInputShellMotion({
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: TagsInputPartMotion;
  forwardedRef?: ForwardedRef<HTMLDivElement>;
  onPointerOver?: PointerEventHandler<HTMLDivElement>;
  onPointerOut?: PointerEventHandler<HTMLDivElement>;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  onPointerUp?: PointerEventHandler<HTMLDivElement>;
}) {
  const scope = useOptionalTagsInputMotionScope();
  const { disabled, variant } = useTagsInputContext();
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const pointerInsideRef = useRef(false);
  const shadow = useSecondLevelShadow(shellRef, !disabled && kitSurface, {
    interactive: false,
    shadowSize: "base",
    pointerInsideRef,
    killMotionOnUnmount: false,
  });
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.shell) || !disabled;
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "shell",
    motion,
    forwardedRef,
    pointerPhases: pointer,
    onPointerOver: (event) => {
      pointerInsideRef.current = true;
      onPointerOver?.(event);
    },
    onPointerOut: (event) => {
      pointerInsideRef.current = false;
      onPointerOut?.(event);
    },
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "shell", part.targetRef);

  const setRef = (node: HTMLDivElement | null) => {
    shellRef.current = node;
    part.setRef(node);
  };

  return {
    setRef,
    pointerHandlers: part.pointerHandlers,
    motionClass: kitSurface ? shadow.motionClass : "",
  };
}

export function useTagsInputSlotMotion<T extends HTMLElement>(
  slot: "tag" | "remove" | "input",
  motion?: TagsInputPartMotion,
) {
  const scope = useOptionalTagsInputMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<T>({
    scope,
    slot,
    motion,
    pointerPhases: pointer,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}

export function useTagsInputChromeSlot(
  slot: "label" | "hint" | "error",
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: MotionPartPhases;
    forwardedRef?: ForwardedRef<HTMLElement>;
    onPointerOver?: PointerEventHandler<HTMLElement>;
    onPointerOut?: PointerEventHandler<HTMLElement>;
    onPointerDown?: PointerEventHandler<HTMLElement>;
    onPointerUp?: PointerEventHandler<HTMLElement>;
  } = {},
) {
  const scope = useOptionalTagsInputMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<HTMLElement>({
    scope,
    slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}
