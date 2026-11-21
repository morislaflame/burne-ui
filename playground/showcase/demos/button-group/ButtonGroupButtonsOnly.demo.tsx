import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";

export function ButtonGroupButtonsOnlyDemo() {
  return (
    <ButtonGroup aria-label="Formatting">
      <Button variant="outline" groupSegment={{orientation: "horizontal", position: "first"}}>Fatty</Button>
      <Button variant="outline" groupSegment={{ orientation: "horizontal", position: "middle" }}>
        Italics
      </Button>
      <Button variant="outline" groupSegment={{ orientation: "horizontal", position: "last" }}>
        Underlined
      </Button>
    </ButtonGroup>
  );
}
