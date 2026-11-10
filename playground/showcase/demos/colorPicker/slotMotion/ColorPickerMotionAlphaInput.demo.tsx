import { ColorPicker } from "@/components/core/ColorPicker";

export function ColorPickerMotionAlphaInputDemo() {
  return (
    <ColorPicker
      defaultValue="#22c55e"
      defaultOpen
      motion={{
        alphaInput: {
          enter: (ctx) =>
            ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26, delay: 0.08 }),
        },
      }}
    >
      <ColorPicker.Trigger />
      <ColorPicker.Content showAlpha />
    </ColorPicker>
  );
}
