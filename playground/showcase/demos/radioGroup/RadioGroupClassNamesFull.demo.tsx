import { Radio } from "@/components/core/Radio";
import { Text } from "@/components/core/Text";
import { RadioGroup } from "@/components/composite/RadioGroup";
import { Label } from "@/components/core/Label";

export function RadioGroupClassNamesFullDemo() {
  return (
    <RadioGroup
      required
      defaultValue="card"
      className="max-w-md"
      classNames={{
        root: "rounded-large border border-primary/20 p-base",
        legend: "text-primary",
        legendHeader: "gap-xsmall",
        hint: "text-foreground/70",
        error: "font-medium",
        list: "gap-base",
        group: "gap-large",
        actions: "pt-small",
      }}
    >
      <RadioGroup.Legend>
        <Label>Payment method</Label>
        <RadioGroup.Hint>Slots via classNames.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.Group>
        <RadioGroup.List>
          <Radio value="card" label="Bank card" />
          <Radio value="cash" label="Cash" />
        </RadioGroup.List>
        <RadioGroup.Error>Select a payment method to continue.</RadioGroup.Error>
      </RadioGroup.Group>
      <RadioGroup.Actions>
        <Text as="span" textStyle="small" className="text-muted">
          Saved automatically
        </Text>
      </RadioGroup.Actions>
    </RadioGroup>
  );
}
