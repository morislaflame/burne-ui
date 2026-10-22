import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Checkbox } from "@/components/core/Checkbox";
import { Label } from "@/components/core/Label";

export function CheckboxGroupMotionHintEnterDemo() {
  return (
    <CheckboxGroup
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
      <CheckboxGroup.Legend>
        <Label>Plan</Label>
        <CheckboxGroup.Hint>Shown on invoices and receipts.</CheckboxGroup.Hint>
      </CheckboxGroup.Legend>
      <CheckboxGroup.List>
        <Checkbox value="pro" label="Pro" />
        <Checkbox value="team" label="Team" />
      </CheckboxGroup.List>
    </CheckboxGroup>
  );
}
