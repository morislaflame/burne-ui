import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonGroupMotionInstantEnterDemo() {
  return (
    <ToggleButtonGroup type="single" defaultValue="a" motion={{ root: { enter: false } }}>
      <ToggleButton value="a">A</ToggleButton>
      <ToggleButton value="b">B</ToggleButton>
    </ToggleButtonGroup>
  );
}
