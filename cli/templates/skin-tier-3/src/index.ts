import { type MotionContext } from "burne-ui";
import { defineSkin, defineSkinRecipe, type SkinDefinition } from "burne-ui/skin";
import skinJson from "./skin.json" with { type: "json" };

defineSkinRecipe("__SKIN_NAME__", "hover", (ctx: MotionContext) => {
  ctx.fromRest({ scale: ctx.phase === "hoverIn" ? 1.02 : 1 });
});

export const __SKIN_IDENT__ = defineSkin(skinJson as SkinDefinition);
