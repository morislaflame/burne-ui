import { bindKitRecipe } from "./bindKitRecipe";
import { chevronRotateRecipe } from "./chevronRotate";

export function bindChevronRecipe(): void {
  bindKitRecipe("chevronRotate", chevronRotateRecipe);
}
