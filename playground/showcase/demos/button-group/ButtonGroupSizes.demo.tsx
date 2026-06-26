import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";

const SIZES = ["small", "base", "mid", "large"] as const;

export function ButtonGroupSizesDemo() {
  return (
    <div className="flex flex-col gap-mid">
      {SIZES.map((size) => (
        <ButtonGroup key={size} aria-label={size} buttonSize={size}>
          <Button variant="outline">A</Button>
          <Button variant="outline" groupSegment={{ orientation: "horizontal", position: "last" }}>
            B
          </Button>
        </ButtonGroup>
      ))}
    </div>
  );
}
