import { RadioGroup } from "@/components/composite/RadioGroup";
import { Radio } from "@/components/core/Radio";
import { Label } from "@/components/core/Label";

export function RadioGroupMotionHintEnterDemo() {
  return (
    <RadioGroup
      defaultValue="email"
      motion={{
        legend: {
          enter: (ctx) =>
            ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26 }),
        },
        hint: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28, delay: 0.06 },
            ),
        },
      }}
    >
      <RadioGroup.Legend>
        <Label>Channel</Label>
        <RadioGroup.Hint>Only one option can be selected.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="email" label="Email" />
        <Radio value="chat" label="Chat" />
      </RadioGroup.List>
    </RadioGroup>
  );
}
