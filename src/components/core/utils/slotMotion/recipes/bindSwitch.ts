import { bindKitRecipe } from "./bindKitRecipe";
import {
  switchFillRecipe,
  switchIconOffRecipe,
  switchIconOnRecipe,
  switchThumbRecipe,
} from "./switchThumb";

export function bindSwitchRecipes(): void {
  bindKitRecipe("switchThumb", switchThumbRecipe);
  bindKitRecipe("switchFill", switchFillRecipe);
  bindKitRecipe("switchIconOn", switchIconOnRecipe);
  bindKitRecipe("switchIconOff", switchIconOffRecipe);
}
