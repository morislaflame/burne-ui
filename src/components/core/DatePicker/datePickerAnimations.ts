/**
 * Slot motion for DatePicker — look here first.
 *
 * DOM slots: `trigger` (host), `icon`, `label`, `hint`, `error`
 *
 * Root owns the scope (defaults + `play`). The trigger button is the field shell.
 * Chevron rotation plays `icon` enter / leave. Popover and Calendar keep their own motion.
 */
import { useRef, type ForwardedRef, type MutableRefObject, type PointerEventHandler } from "react";

import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  type MotionPartPhases,
} from "@/components/core/utils/slotMotion";
import { KIT_INPUT_VARIANTS, type InputVariant } from "@/components/core/Input/inputTypes";
import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";

import { useDatePickerContext, useOptionalDatePickerMotionScope } from "./datePickerContext";
import type { DatePickerMotion, DatePickerPartMotion } from "./datePickerTypes";

function datePickerChevronEnabled() {
  return true;
}

export function resolveDatePickerMotionDefaults({
  variant,
  disabled,
}: {
  variant: InputVariant;
  disabled: boolean;
}): DatePickerMotion {
  const active = !disabled;
  return overlaySkinMotion(
    {
      trigger: {
        hoverIn: active ? "hoverLiftSecondLevel" : false,
        hoverOut: active ? "hoverLiftSecondLevel" : false,
        pressIn: active ? "pressSqueeze" : false,
        pressOut: false,
      },
      icon: { enter: "chevronRotate", leave: "chevronRotate" },
    },
    variant,
    KIT_INPUT_VARIANTS,
    "datePicker",
  );
}

export function resolveDatePickerMotionParams({
  variant,
  disabled,
  pointerInside,
}: {
  variant: InputVariant;
  disabled: boolean;
  pointerInside: MutableRefObject<boolean>;
}) {
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  return {
    shadowSize: "base" as const,
    hasHoverShadow: !disabled && kitSurface,
    pointerInside,
  };
}

export function useDatePickerTriggerMotion({
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: DatePickerPartMotion;
  forwardedRef?: ForwardedRef<HTMLButtonElement>;
  onPointerOver?: PointerEventHandler<HTMLButtonElement>;
  onPointerOut?: PointerEventHandler<HTMLButtonElement>;
  onPointerDown?: PointerEventHandler<HTMLButtonElement>;
  onPointerUp?: PointerEventHandler<HTMLButtonElement>;
}) {
  const scope = useOptionalDatePickerMotionScope();
  const { triggerRef, pointerInsideRef, disabled, variant } = useDatePickerContext();
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  const shadow = useSecondLevelShadow(triggerRef, !disabled && kitSurface, {
    interactive: false,
    shadowSize: "base",
  });
  const part = useMotionPart<HTMLButtonElement>({
    scope,
    slot: "trigger",
    motion,
    forwardedRef,
    pointerPhases: !disabled,
    pressPhases: !disabled,
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
  useOptionalEnterOnMount(scope, "trigger", part.targetRef);

  const setRef = (node: HTMLButtonElement | null) => {
    triggerRef.current = node;
    part.setRef(node);
  };

  return {
    setRef,
    pointerHandlers: part.pointerHandlers,
    shellHoverMotionClass: kitSurface ? shadow.motionClass : "",
  };
}

export function useDatePickerIconMotion(open: boolean) {
  const scope = useOptionalDatePickerMotionScope();
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const bindChevron = useChevronRotation(
    open,
    iconRef,
    datePickerChevronEnabled,
    undefined,
    scope,
    "icon",
  );
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "icon",
  });

  const setRef = (node: HTMLSpanElement | null) => {
    part.setRef(node);
    bindChevron(node);
  };

  return { setRef };
}

export function useDatePickerChromeSlot(
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
  const scope = useOptionalDatePickerMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<HTMLElement>({
    scope,
    slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}
