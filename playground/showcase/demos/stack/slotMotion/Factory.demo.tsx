import { Stack } from "@/components/core/Stack";

export function StackMotionFactoryDemo() {
  return (
    <Stack
      orientation="horizontal" gap="mid"
      motion={{
        root: {
          enter: (ctx) => ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }),
        },
      }}
    >
      <span>Factory</span>
    </Stack>
  );
}
