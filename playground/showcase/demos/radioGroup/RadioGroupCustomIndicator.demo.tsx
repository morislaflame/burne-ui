import { RadioGroup } from "@/components/composite/RadioGroup";
import { Radio } from "@/components/core/Radio";

export function RadioGroupCustomIndicatorDemo() {
  return (
    <RadioGroup defaultValue="design" className="w-full max-w-sm">
      <RadioGroup.Legend>
        <RadioGroup.Label>Department</RadioGroup.Label>
        <RadioGroup.Hint>Square indicator through Radio.Indicator className.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="design">
          <Radio.Control>
            <Radio.Indicator className="rounded-mid" />
          </Radio.Control>
          <Radio.Content>
            <Radio.Label>Design</Radio.Label>
          </Radio.Content>
        </Radio>
        <Radio value="dev">
          <Radio.Control>
            <Radio.Indicator className="rounded-mid" />
          </Radio.Control>
          <Radio.Content>
            <Radio.Label>Development</Radio.Label>
          </Radio.Content>
        </Radio>
        <Radio value="qa">
          <Radio.Control>
            <Radio.Indicator className="rounded-mid" />
          </Radio.Control>
          <Radio.Content>
            <Radio.Label>Testing</Radio.Label>
          </Radio.Content>
        </Radio>
      </RadioGroup.List>
    </RadioGroup>
  );
}
