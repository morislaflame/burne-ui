import { TabsMotionInstantEnterDemo } from "./TabsMotionInstantEnter.demo";
import { TabsMotionPanelWaveDemo } from "./TabsMotionPanelWave.demo";
import { TabsMotionSelectionTintDemo } from "./TabsMotionSelectionTint.demo";

export function TabsMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <TabsMotionInstantEnterDemo />
      <TabsMotionPanelWaveDemo />
      <TabsMotionSelectionTintDemo />
    </div>
  );
}
