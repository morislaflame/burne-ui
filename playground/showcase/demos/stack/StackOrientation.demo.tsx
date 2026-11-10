import { Stack } from "@/components/core/Stack";

export function StackOrientationDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <Stack gap="mid">
        <span>First</span>
        <span>Second</span>
      </Stack>
      <Stack orientation="horizontal" gap="mid" align="center">
        <span>Left</span>
        <span>Right</span>
      </Stack>
    </div>
  );
}
