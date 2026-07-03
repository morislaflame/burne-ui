import { RadioGroup } from "@/components/composite/RadioGroup";
import { Radio } from "@/components/core/Radio";

export function RadioGroupHorizontalSizesDemo() {
  return (
    <RadioGroup defaultValue="m" className="w-full max-w-md">
      <RadioGroup.Legend>
        <RadioGroup.Label>Size</RadioGroup.Label>
        <RadioGroup.Hint>RadioGroup.List orientation=&quot;horizontal&quot;.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.List orientation="horizontal">
        <Radio value="xs" label="XS" />
        <Radio value="s" label="S" />
        <Radio value="m" label="M" />
        <Radio value="l" label="L" />
        <Radio value="xl" label="XL" />
      </RadioGroup.List>
    </RadioGroup>
  );
}
