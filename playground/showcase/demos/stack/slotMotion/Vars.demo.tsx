import { Stack } from "@/components/core/Stack";

export function StackMotionVarsDemo() {
  return (
    <Stack
      orientation="horizontal" gap="mid"
      motion={{ root: { enter: { y: -8, opacity: 0, duration: 0.35 } } }}
    >
      <span>Enter</span>
    </Stack>
  );
}
