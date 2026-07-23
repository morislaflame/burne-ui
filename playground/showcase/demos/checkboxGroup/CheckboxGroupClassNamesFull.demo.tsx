import { Checkbox } from "@/components/core/Checkbox";
import { Text } from "@/components/core/Text";
import { CheckboxGroup } from "@/components/composite/CheckboxGroup";

export function CheckboxGroupClassNamesFullDemo() {
  return (
    <CheckboxGroup
      required
      className="max-w-md"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        legend: "text-primary",
        legendHeader: "gap-xsmall",
        hint: "text-foreground/70",
        error: "font-medium",
        list: "gap-base",
        group: "gap-large",
        actions: "pt-small",
      }}
    >
      <CheckboxGroup.Legend>
        <CheckboxGroup.Label>Consents</CheckboxGroup.Label>
        <CheckboxGroup.Hint>Slots via classNames.</CheckboxGroup.Hint>
      </CheckboxGroup.Legend>
      <CheckboxGroup.Group>
        <CheckboxGroup.List>
          <Checkbox name="terms" label="Terms of service" />
          <Checkbox name="marketing" label="Newsletter (optional)" />
        </CheckboxGroup.List>
        <CheckboxGroup.Error>Accept the terms to continue.</CheckboxGroup.Error>
      </CheckboxGroup.Group>
      <CheckboxGroup.Actions>
        <Text as="span" variant="small" className="text-muted">
          Saved automatically
        </Text>
      </CheckboxGroup.Actions>
    </CheckboxGroup>
  );
}
