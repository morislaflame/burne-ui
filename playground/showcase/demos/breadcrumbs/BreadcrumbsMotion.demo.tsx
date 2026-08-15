import { BreadcrumbsMotionCrumbWaveDemo } from "./BreadcrumbsMotionCrumbWave.demo";
import { BreadcrumbsMotionInstantPressDemo } from "./BreadcrumbsMotionInstantPress.demo";
import { BreadcrumbsMotionTextTintDemo } from "./BreadcrumbsMotionTextTint.demo";

export function BreadcrumbsMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <BreadcrumbsMotionInstantPressDemo />
      <BreadcrumbsMotionCrumbWaveDemo />
      <BreadcrumbsMotionTextTintDemo />
    </div>
  );
}
