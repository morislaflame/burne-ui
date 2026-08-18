import { ListBoxMotionHintStaggerDemo } from "./ListBoxMotionHintStagger.demo";
import { ListBoxMotionInstantPressDemo } from "./ListBoxMotionInstantPress.demo";
import { ListBoxMotionItemWaveDemo } from "./ListBoxMotionItemWave.demo";
import { ListBoxMotionLabelTintDemo } from "./ListBoxMotionLabelTint.demo";
import { ListBoxMotionSectionHeaderDemo } from "./ListBoxMotionSectionHeader.demo";
import { ListBoxMotionSeparatorDemo } from "./ListBoxMotionSeparator.demo";

export function ListBoxMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <ListBoxMotionInstantPressDemo />
      <ListBoxMotionItemWaveDemo />
      <ListBoxMotionLabelTintDemo />
      <ListBoxMotionHintStaggerDemo />
      <ListBoxMotionSectionHeaderDemo />
      <ListBoxMotionSeparatorDemo />
    </div>
  );
}
