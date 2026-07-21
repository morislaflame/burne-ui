import { Radio } from "@/components/core/Radio";
import { Text } from "@/components/core/Text";
import { RadioGroup } from "@/components/composite/RadioGroup";

export function RadioGroupClassNamesFullDemo() {
  return (
    <RadioGroup
      required
      defaultValue="card"
      className="max-w-md"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        legend: "text-primary",
        legendHeader: "gap-xsmall",
        hint: "text-foreground/70",
        error: "font-medium",
        list: "gap-base",
        group: "gap-mid",
        actions: "pt-small",
      }}
    >
      <RadioGroup.Legend>
        <RadioGroup.Label>Payment method</RadioGroup.Label>
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
        <Text as="span" variant="small" className="text-muted">
          Saved automatically
        </Text>
      </RadioGroup.Actions>
    </RadioGroup>
  );
}
