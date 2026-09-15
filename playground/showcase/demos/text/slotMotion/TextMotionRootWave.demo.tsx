import { Text } from "@/components/core/Text";

export function TextMotionRootWaveDemo() {
  return (
    <Text
      variant="large"
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }),
          hoverIn: { y: -3, duration: 0.2 },
          hoverOut: { y: 0, duration: 0.18 },
        },
      }}
    >
      Enter wave
    </Text>
  );
}
