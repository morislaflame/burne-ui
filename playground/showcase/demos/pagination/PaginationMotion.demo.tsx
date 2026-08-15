import { PaginationMotionControlWaveDemo } from "./PaginationMotionControlWave.demo";
import { PaginationMotionInstantPressDemo } from "./PaginationMotionInstantPress.demo";
import { PaginationMotionNavTintDemo } from "./PaginationMotionNavTint.demo";

export function PaginationMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <PaginationMotionInstantPressDemo />
      <PaginationMotionControlWaveDemo />
      <PaginationMotionNavTintDemo />
    </div>
  );
}
