import { ColorPicker } from "@/components/core/ColorPicker";

export function ColorPickerMotionPreviewSwatchDemo() {
  return (
    <ColorPicker
      defaultValue="#3b82f6"
      defaultOpen
      motion={{
        previewSwatch: {
          enter: (ctx) =>
            ctx.fromTo(
              { scale: 0.6, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.32, ease: "back.out(1.6)" },
            ),
        },
      }}
    >
      <ColorPicker.Trigger />
      <ColorPicker.Content>
        <ColorPicker.Area />
        <ColorPicker.Preview />
      </ColorPicker.Content>
    </ColorPicker>
  );
}
