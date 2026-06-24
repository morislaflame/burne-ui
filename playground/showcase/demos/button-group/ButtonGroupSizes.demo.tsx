import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";

export function ButtonGroupSizesDemo() {
  return (
    <div className="flex flex-col gap-mid">
      <ButtonGroup aria-label="Small" buttonSize="small">
        <Button variant="outline">A</Button>
        <Button variant="outline" groupSegment={{ orientation: "horizontal", position: "last" }}>
          B
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Large" buttonSize="large">
        <Button variant="outline">A</Button>
        <Button variant="outline" groupSegment={{ orientation: "horizontal", position: "last" }}>
          B
        </Button>
      </ButtonGroup>
    </div>
  );
}
