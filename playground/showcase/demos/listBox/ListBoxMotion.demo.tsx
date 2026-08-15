import { ListBoxMotionInstantPressDemo } from "./ListBoxMotionInstantPress.demo";
import { ListBoxMotionItemWaveDemo } from "./ListBoxMotionItemWave.demo";
import { ListBoxMotionLabelTintDemo } from "./ListBoxMotionLabelTint.demo";

export function ListBoxMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <ListBoxMotionInstantPressDemo />
      <ListBoxMotionItemWaveDemo />
      <ListBoxMotionLabelTintDemo />
    </div>
  );
}
