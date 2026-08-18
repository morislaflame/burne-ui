import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonGroupMotionRootWaveDemo() {
  return (
    <ToggleButtonGroup
      type="single"
      defaultValue="a"
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }),
        },
      }}
    >
      <ToggleButton value="a">A</ToggleButton>
      <ToggleButton value="b">B</ToggleButton>
    </ToggleButtonGroup>
  );
}
