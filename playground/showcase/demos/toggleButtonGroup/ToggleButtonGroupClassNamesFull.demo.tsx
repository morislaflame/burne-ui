import { ToggleButton } from "@/components/core/ToggleButton";
import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";

export function ToggleButtonGroupClassNamesFullDemo() {
  return (
    <ToggleButtonGroup
      type="single"
      defaultValue="a"
      aria-label="Custom slots"
      classNames={{
        root: "rounded-mid border border-primary/25 p-xsmall",
        separator: "border-primary/40",
      }}
    >
      <ToggleButton value="a">A</ToggleButton>
      <ToggleButton value="b">B</ToggleButton>
      <ToggleButton value="c">C</ToggleButton>
    </ToggleButtonGroup>
  );
}
