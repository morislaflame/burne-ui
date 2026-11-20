import { useCallback, useRef, type ForwardedRef, type PointerEventHandler } from "react";
 
import { animateInteractivePressSqueeze } from "./hoverInteractiveLift";
import type { MotionConfig } from "./motionConfig";
import { useMotionConfig } from "./motionConfigContext";
import { runOpenAfterSqueeze, useOpeningRef } from "./runOpenAfterSqueeze";
import {
  runMotionPhase,
  useMotionPart,
  type MotionPartPhases,
  type MotionScopeValue,
} from "./slotMotion";

import { lookupSkin } from "@/skins/skinLookup";

import { bindLiftRecipes } from "@/components/core/utils/slotMotion/recipes/bindLift";

bindLiftRecipes();
 
/** Defaults for overlay `trigger` — live on Root so Trigger (outside Panel) sees them. */
export const OVERLAY_TRIGGER_MOTION_DEFAULTS = {
  trigger: {
    pressIn: "pressSqueeze" as const,
    pressOut: false as const,
  },
};
 
export async function playOverlayTriggerOpenSqueeze({
  scope,
  el,
  partMotion,
  config,
}: {
  scope: MotionScopeValue | null;
  el: HTMLElement;
  partMotion?: MotionPartPhases;
  config?: Readonly<MotionConfig>;
}): Promise<void> {
  // A skinned control (`<Button variant="skin">` under `asChild`) owns its press feel.
  // Run that recipe once here and open after it, instead of racing it with the kit squeeze.
  const skinPress = skinPressRecipeFor(el);
  if (skinPress) {
    await runMotionPhase({
      el,
      phase: "pressIn",
      value: skinPress,
      targets: { trigger: el },
      params: { pointerInside: () => el.matches(":hover") },
      waitForComplete: false,
      slot: "trigger",
      config,
    }).finished;
    return;
  }
  if (!scope) {
    await animateInteractivePressSqueeze(el, { config });
    return;
  }
  const value = scope.resolve("trigger", "pressIn", partMotion);
  if (value === false) return;
  if (value === undefined) {
    await animateInteractivePressSqueeze(el, { config });
    return;
  }
  await scope.play("trigger", "pressIn", { el, partMotion }).finished;
}

/** `pressIn` recipe a skin declares for the control under this trigger, if any. */
function skinPressRecipeFor(el: HTMLElement): string | undefined {
  const variant = el.dataset.variant;
  if (!variant) return undefined;
  const skin = lookupSkin(variant);
  if (!skin?.motion) return undefined;
  const slots = (el.dataset.skinSlot ?? "").split(/\s+/).filter(Boolean);
  for (const slot of slots) {
    const phases = skin.motion[slot as keyof typeof skin.motion] as
      | Record<string, unknown>
      | undefined;
    const press = phases?.pressIn;
    if (typeof press === "string") return press;
  }
  return undefined;
}

/** True while the trigger runs its own open press, so the child control skips a second one. */
export function isOverlayTriggerOpening(el: Element | null): boolean {
  return el instanceof HTMLElement && el.dataset.overlayOpening === "true";
}
 
export function useOverlayTriggerSlot<T extends HTMLElement>({
  scope,
  slot = "trigger",
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  scope: MotionScopeValue | null;
  slot?: string;
  motion?: MotionPartPhases;
  forwardedRef?: ForwardedRef<T>;
  onPointerOver?: PointerEventHandler<T>;
  onPointerOut?: PointerEventHandler<T>;
  onPointerDown?: PointerEventHandler<T>;
  onPointerUp?: PointerEventHandler<T>;
}) {
  const slotMotion = motion ?? scope?.getRootMotion()?.[slot];
  const hover = slotMotion?.hoverIn != null || slotMotion?.hoverOut != null;
  const part = useMotionPart<T>({
    scope,
    slot,
    motion,
    forwardedRef,
    pointerPhases: hover,
    pressPhases: false,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  const openingRef = useOpeningRef();
  const config = useMotionConfig();
  const partMotionRef = useRef(motion);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  partMotionRef.current = motion;
 
  const openAfterSqueeze = useCallback(
    (setOpen: (open: boolean) => void) => {
      runOpenAfterSqueeze({
        triggerRef: part.targetRef,
        openingRef,
        setOpen,
        config,
        runSqueeze: (el) =>
          playOverlayTriggerOpenSqueeze({
            scope,
            el,
            partMotion: partMotionRef.current,
            config,
          }),
      });
    },
    [config, openingRef, part.targetRef, scope],
  );
 
  return { part, openingRef, openAfterSqueeze };
}
 