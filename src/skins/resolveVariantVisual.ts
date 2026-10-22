import type { MotionPartPhases, MotionSlotMap } from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";

import { lookupSkin } from "./skinLookup";
import type { SkinSlot, SkinTargetSpec } from "./skinTypes";

const unknownVariantWarned = new Set<string>();

export type ResolvedVariant<K extends string> = {
  /** Closed kit key. A skin name becomes `baseVariant`, an unknown string becomes `fallback`. */
  key: K;
  /**
   * Class string from a string target or `{ replace }`.
   * Missing key means “use the kit map for `key`”.
   */
  className?: string;
  /** Classes appended after the kit class (`{ extend }`). */
  extend?: string;
};

function targetSpec(spec: SkinTargetSpec | undefined): { className?: string; extend?: string } {
  if (spec == null) return {};
  if (typeof spec === "string") return { className: spec };
  if ("extend" in spec) return { extend: spec.extend };
  return { className: spec.replace };
}

/**
 * Kit variant names keep kit elevation. A skin keeps it only when `elevation` is `kit`.
 * Omitted elevation is `skin`: the kit does not draw its shadow layers.
 */
export function usesKitElevation<K extends string>(
  variant: string,
  kit: readonly K[]): boolean {
  if (isKitVariant(variant, kit)) return true;
  return lookupSkin(variant)?.elevation === "kit";
}

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

/** Shadow gate: a kit member, or a skin with `elevation: "kit"` using `baseVariant`. */
export function usesKitElevationMember<K extends string>(
  variant: string,
  kit: readonly K[],
  set: ReadonlySet<K>): boolean {
  if (hasKitMember(variant, kit, set)) return true;
  const skin = lookupSkin(variant);
  if (skin?.elevation !== "kit") return false;
  const base = (skin.baseVariant ?? "default") as K;
  return (kit as readonly string[]).includes(base) && set.has(base);
}

/**
 * Kit variant → that key (explicit variant wins, including `"default"`).
 * Skin in the active scope → `targets[slot]` or `baseVariant`.
 * Anything else → dev error and `fallback` (default `"default"`).
 * Outside React, the registry is the source. During render, a missing provider
 * does not read the registry.
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

  const skin = lookupSkin(variant);
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
  const spec = targetSpec(skin.targets?.[slot as keyof typeof skin.targets]);
  return { key, ...spec };
}

/**
 * Layout roots (`header.root` and the other shells) read the live target list.
 * The kit variant `default` keeps the kit classes; a skin may extend or replace them.
 */
export function layoutTargetClass(slot: SkinSlot): string | undefined {
  const visual = resolveVariantVisual("default", ["default"], slot);
  return visual.extend ?? visual.className;
}

/** Skin target for this slot, otherwise the kit class of the resolved key. */
export function variantSlotClass<K extends string>(
  variant: string,
  kit: readonly K[],
  slot: SkinSlot,
  kitClass: (key: K) => string,
  fallback?: K): string {
  const resolved = resolveVariantVisual(variant, kit, slot, fallback);
  const kitClasses = kitClass(resolved.key);
  if (resolved.extend !== undefined) return cn(kitClasses, resolved.extend);
  if (resolved.className !== undefined) return resolved.className;
  return kitClasses;
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
  const motion = lookupSkin(variant)?.motion;
  if (!motion) return defaults;

  const next: MotionSlotMap = { ...defaults };
  let changed = false;
  for (const [fullSlot, phases] of Object.entries(motion)) {
    if (!phases) continue;
    const dot = fullSlot.indexOf(".");
    if (dot < 0) continue;
    if (fullSlot.slice(0, dot) !== prefix) continue;
    const local = fullSlot.slice(dot + 1);
    next[local] = { ...next[local], ...phases } as MotionPartPhases;
    changed = true;
  }
  return (changed ? next : defaults) as M;
}

/** Test-only. Unknown-variant warnings are once per name. */
export function resetVariantVisualWarningsForTests(): void {
  unknownVariantWarned.clear();
}
