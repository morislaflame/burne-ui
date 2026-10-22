import { lookupSkin } from "./skinLookup";
import type { SkinDeclarativeLayers, SkinLayerRenderer, SkinLayerSlot } from "./skinTypes";

export type ResolvedSkinLayer = {
  name: string;
  renderer?: SkinLayerRenderer;
  declarative?: SkinDeclarativeLayers;
};

/**
 * Tier 3 lookup. `variant="default"` is the off switch.
 * A registered skin name resolves even when it is not a kit variant.
 * A code renderer wins over `layersDeclarative`.
 */
export function resolveSkinLayer(
  variant: string | undefined,
  part: string): ResolvedSkinLayer | null {
  if (!variant || variant === "default") return null;
  const skin = lookupSkin(variant);
  if (!skin) return null;
  const slot = part as SkinLayerSlot;
  const renderer = skin.layers?.[slot];
  const declarative = skin.layersDeclarative?.[slot];
  if (!renderer && !declarative) return null;
  return { name: skin.name, renderer, declarative };
}
