import { bindKitRecipe } from "./bindKitRecipe";
import { fileRowExitRecipe } from "./fileRowExit";

export function bindFileRowRecipe(): void {
  bindKitRecipe("fileRowExit", fileRowExitRecipe);
}
