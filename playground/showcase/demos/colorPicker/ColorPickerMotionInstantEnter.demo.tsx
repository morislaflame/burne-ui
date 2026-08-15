import { ColorPicker } from "@/components/core/ColorPicker";

export function ColorPickerMotionInstantEnterDemo() {
  return (
    <ColorPicker defaultValue="#3b82f6" defaultOpen motion={{ contentPanel: { enter: false } }}>
      <ColorPicker.Trigger />
      <ColorPicker.Content />
    </ColorPicker>
  );
}
