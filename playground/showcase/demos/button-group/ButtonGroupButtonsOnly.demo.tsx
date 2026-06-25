import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";

export function ButtonGroupButtonsOnlyDemo() {
  return (
    <ButtonGroup aria-label="Форматирование">
      <Button variant="outline" groupSegment={{orientation: "horizontal", position: "first"}}>Жирный</Button>
      <Button variant="outline" groupSegment={{ orientation: "horizontal", position: "middle" }}>
        Курсив
      </Button>
      <Button variant="outline" groupSegment={{ orientation: "horizontal", position: "last" }}>
        Подчёркнутый
      </Button>
    </ButtonGroup>
  );
}
