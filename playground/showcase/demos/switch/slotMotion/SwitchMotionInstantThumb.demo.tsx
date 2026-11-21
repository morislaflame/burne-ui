import { Switch } from "@/components/core/Switch";

export function SwitchMotionInstantThumbDemo() {
  return (
    <Switch
      defaultChecked
      label="Instant thumb"
      hint="thumb check/uncheck: false — snap, fill still tweens."
      motion={{ thumb: { check: false, uncheck: false } }}
    />
  );
}
