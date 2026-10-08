import type { MotionSlotMap } from "@/components/core/utils/slotMotion";

import { getSkin } from "./skinRegistry";
import type { SkinSlot } from "./skinTypes";

const unknownVariantWarned = new Set<string>();

export type ResolvedVariant<K extends string> = {
  /** Closed kit key. A skin name becomes `baseVariant`, an unknown string becomes `fallback`. */
  key: K;
  /**
   * Class string from `targets[slot]` when `variant` is a registered skin.
   * Missing key means “use the kit map for `key`”.
   */
  className?: string;
};

export function isKitVariant<K extends string>(
  variant: string,
  kit: readonly K[]): variant is K {
  return (kit as readonly string[]).includes(variant);
}

export function hasKitMember<K extends string>(
  variant: string,
  kit: readonly K[],
  set: ReadonlySet<K>): boolean {
  return isKitVariant(variant, kit) && set.has(variant);
}

/**
 * Kit variant → that key (explicit variant wins, including `"default"`).
 * Registered skin name → `targets[slot]` or `baseVariant`.
 * Anything else → dev error and `fallback` (default `"default"`).
 */
export function resolveVariantVisual<K extends string>(
  variant: string,
  kit: readonly K[],
  slot: SkinSlot,
  fallback?: K): ResolvedVariant<K> {
  const fb = (fallback ?? ("default" as K));
  const fallbackKey = (kit as readonly string[]).includes(fb) ? fb : kit[0];

  if (isKitVariant(variant, kit)) {
    return { key: variant };
  }

  const skin = getSkin(variant);
  if (!skin) {
    if (process.env.NODE_ENV !== "production" && !unknownVariantWarned.has(variant)) {
      unknownVariantWarned.add(variant);
      console.error(
        `[burne-ui] unknown variant "${variant}" for ${slot}; no active skin. Falling back to "${fallbackKey}".`);
    }
    return { key: fallbackKey };
  }

  const base = skin.baseVariant ?? "default";
  const key = (kit as readonly string[]).includes(base) ? (base as K) : fallbackKey;
  const className = skin.targets?.[slot];
  return className !== undefined ? { key, className } : { key };
}

/** Skin target for this slot, otherwise the kit class of the resolved key. */
export function variantSlotClass<K extends string>(
  variant: string,
  kit: readonly K[],
  slot: SkinSlot,
  kitClass: (key: K) => string,
  fallback?: K): string {
  const resolved = resolveVariantVisual(variant, kit, slot, fallback);
  if (resolved.className !== undefined) return resolved.className;
  return kitClass(resolved.key);
}

/**
 * Swap recipe names from `skin.motion["{prefix}.{slot}"]` onto kit defaults.
 * A kit variant is left alone. User `motion` props still win later in `resolveSlotPhase`.
 */
export function overlaySkinMotion<M extends MotionSlotMap>(
  defaults: M,
  variant: string,
  kit: readonly string[],
  prefix: string): M {
  if ((kit as readonly string[]).includes(variant)) return defaults;
  const motion = getSkin(variant)?.motion;
  if (!motion) return defaults;

  const next: MotionSlotMap = { ...defaults };
  let changed = false;
  for (const [fullSlot, phases] of Object.entries(motion)) {
    if (!phases) continue;
    const dot = fullSlot.indexOf(".");
    if (dot < 0) continue;
    if (fullSlot.slice(0, dot) !== prefix) continue;
    const local = fullSlot.slice(dot + 1);
    next[local] = { ...next[local], ...phases };
    changed = true;
  }
  return (changed ? next : defaults) as M;
}

/** Test-only. Unknown-variant warnings are once per name. */
export function resetVariantVisualWarningsForTests(): void {
  unknownVariantWarned.clear();
}
