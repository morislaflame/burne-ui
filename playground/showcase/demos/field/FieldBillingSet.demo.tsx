import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { Input } from "@/components/core/Input";
import { Label } from "@/components/core/Label";

export function FieldBillingSetDemo() {
  return (
    <Field.Set className="w-full max-w-md">
      <Field.Legend>
        <Field.LegendHeader>
          <Label>Payment</Label>
          <Field.Hint as="span">Data protected</Field.Hint>
        </Field.LegendHeader>
      </Field.Legend>
      <Field.Group>
        <Input>
          <Input.Label>Name on the card</Input.Label>
          <Input.Control placeholder="IVAN IVANOV" autoComplete="cc-name" />
        </Input>
        <Input>
          <Input.Label>Card number</Input.Label>
          <Input.Control placeholder="•••• •••• •••• 4242" inputMode="numeric" />
          <Input.Hint>The debit will occur after confirmation.</Input.Hint>
        </Input>
      </Field.Group>
      <Field.Actions>
        <Button type="button" variant="primary" size="small">
          Pay
        </Button>
      </Field.Actions>
    </Field.Set>
  );
}
