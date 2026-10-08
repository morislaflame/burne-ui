import { getSkin } from "./skinRegistry";
import type { SkinDeclarativeLayers, SkinLayerRenderer, SkinSlot } from "./skinTypes";

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
  part: SkinSlot): ResolvedSkinLayer | null {
  if (!variant || variant === "default") return null;
  const skin = getSkin(variant);
  if (!skin) return null;
  const renderer = skin.layers?.[part];
  const declarative = skin.layersDeclarative?.[part];
  if (!renderer && !declarative) return null;
  return { name: skin.name, renderer, declarative };
}
