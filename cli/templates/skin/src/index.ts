import { registerSkin, type SkinDefinition } from "burne-ui";
import skinJson from "./skin.json" with { type: "json" };

export const __SKIN_IDENT__ = skinJson as SkinDefinition;

registerSkin(__SKIN_IDENT__);
