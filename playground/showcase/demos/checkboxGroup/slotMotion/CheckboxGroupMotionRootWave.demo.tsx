import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Checkbox } from "@/components/core/Checkbox";

export function CheckboxGroupMotionRootWaveDemo() {
  return (
    <CheckboxGroup
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }),
        },
        list: {
          enter: (ctx) => ctx.fromTo({ x: -6 }, { x: 0, duration: 0.22 }),
        },
      }}
    >
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Plan</CheckboxGroup.Label>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox value="pro" label="Pro" />
        <Checkbox value="team" label="Team" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  );
}
