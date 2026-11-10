import { Stack } from "@/components/core/Stack";

export function StackClassNamesFullDemo() {
  return (
    <Stack gap="mid" classNames={{ root: "rounded-mid bg-surface p-mid" }}>
      <span>One</span>
      <span>Two</span>
    </Stack>
  );
}
