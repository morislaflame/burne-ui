import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Checkbox } from "@/components/core/Checkbox";

export function CheckboxGroupMotionInstantEnterDemo() {
  return (
    <CheckboxGroup motion={{ root: { enter: false } }}>
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
