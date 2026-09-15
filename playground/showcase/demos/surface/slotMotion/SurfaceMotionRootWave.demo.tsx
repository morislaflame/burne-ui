import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function SurfaceMotionRootWaveDemo() {
  return (
    <Surface
      padding="large"
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }),
          hoverIn: { y: -4, duration: 0.2 },
          hoverOut: { y: 0, duration: 0.18 },
        },
      }}
    >
      <Text variant="base">Surface wave</Text>
    </Surface>
  );
}
