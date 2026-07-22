import { Button } from "@/components/core/Button";
import { ButtonGroup } from "@/components/composite/ButtonGroup";

export function ButtonGroupClassNamesFullDemo() {
  return (
    <ButtonGroup
      aria-label="Custom slots"
      buttonSize="base"
      classNames={{
        root: "rounded-mid border border-primary/25 p-xsmall",
        separator: "border-primary/40",
        text: "bg-primary/5",
        textLabel: "text-primary font-medium",
      }}
    >
      <ButtonGroup.Text>Label</ButtonGroup.Text>
      <Button variant="outline">One</Button>
      <Button variant="outline">Two</Button>
    </ButtonGroup>
  );
}
