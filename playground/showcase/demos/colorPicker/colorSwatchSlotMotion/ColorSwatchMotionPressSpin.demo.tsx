import { ColorSwatch } from "@/components/core/ColorPicker";

export function ColorSwatchMotionPressSpinDemo() {
  return (
    <ColorSwatch
      color="#a855f7"
      size="large"
      aria-label="Press spin swatch"
      onClick={() => {}}
      motion={{
        root: {
          pressIn: (ctx) =>
            ctx.to({
              rotate: 180,
              scale: 0.86,
              duration: 0.22,
              ease: "back.out(1.8)",
            }),
          pressOut: (ctx) =>
            ctx.to({
              rotate: 0,
              scale: 1,
              duration: 0.28,
              ease: "power2.inOut",
            }),
        },
      }}
    />
  );
}
