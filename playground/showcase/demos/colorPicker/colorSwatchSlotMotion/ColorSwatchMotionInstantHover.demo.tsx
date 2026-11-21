import { ColorSwatch } from "@/components/core/ColorPicker";

export function ColorSwatchMotionInstantHoverDemo() {
  return (
    <ColorSwatch
      color="#3b82f6"
      size="large"
      aria-label="Instant hover swatch"
      onClick={() => {}}
      motion={{
        root: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}
