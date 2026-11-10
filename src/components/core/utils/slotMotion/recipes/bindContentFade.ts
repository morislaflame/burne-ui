import { bindKitRecipe } from "./bindKitRecipe";
import { contentFadeRecipe } from "./contentFade";

export function bindContentFadeRecipe(): void {
  bindKitRecipe("contentFade", contentFadeRecipe);
}
