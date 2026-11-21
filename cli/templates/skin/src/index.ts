import { defineSkin, type SkinDefinition } from "burne-ui/skin";
import skinJson from "./skin.json" with { type: "json" };

export const __SKIN_IDENT__ = defineSkin(skinJson as SkinDefinition);
