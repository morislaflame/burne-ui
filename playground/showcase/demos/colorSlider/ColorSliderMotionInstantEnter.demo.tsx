import { ColorSlider } from "@/components/core/ColorPicker";

export function ColorSliderMotionInstantEnterDemo() {
  return <ColorSlider channel="hue" defaultValue={200} motion={{ track: { enter: false } }} />;
}
