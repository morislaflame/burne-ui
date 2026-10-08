import { ShowcaseDemoGallery } from "../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../layout/ShowcaseDemoGallery";

import { MotionOffDemo } from "./Off.demo";
import offSource from "./Off.demo.tsx?raw";
import { MotionRecipeDemo } from "./Recipe.demo";
import recipeSource from "./Recipe.demo.tsx?raw";
import { MotionReducedDemo } from "./Reduced.demo";
import reducedSource from "./Reduced.demo.tsx?raw";
import { MotionSlowDemo } from "./Slow.demo";
import slowSource from "./Slow.demo.tsx?raw";
import { MotionVarsDemo } from "./Vars.demo";
import varsSource from "./Vars.demo.tsx?raw";

export const motionLevel1Gallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "slow", title: "Slow down", Demo: MotionSlowDemo, source: slowSource },
  { id: "reduced", title: "Less motion", Demo: MotionReducedDemo, source: reducedSource },
  { id: "recipe", title: "Replace a phase", Demo: MotionRecipeDemo, source: recipeSource },
  { id: "off", title: "Turn a phase off", Demo: MotionOffDemo, source: offSource },
  { id: "vars", title: "Custom tween", Demo: MotionVarsDemo, source: varsSource },
];

export function MotionLevel1GalleryDemo() {
  return <ShowcaseDemoGallery aria-label="Motion demos" items={motionLevel1Gallery} />;
}
