import { RadioGroup } from "@/components/composite/RadioGroup";
import { Radio } from "@/components/core/Radio";
import { Label } from "@/components/core/Label";

export function RadioGroupMotionInstantEnterDemo() {
  return (
    <RadioGroup motion={{ root: { enter: false } }} defaultValue="pro">
      <RadioGroup.Legend>
        <Label>Plan</Label>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="pro" label="Pro" />
        <Radio value="team" label="Team" />
      </RadioGroup.List>
    </RadioGroup>
  );
}
