import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";

export function PopoverWithHeaderDemo() {
  return (
    <Popover side="bottom">
      <Popover.Trigger>
        <Button variant="secondary" type="button">
          С header
        </Button>
      </Popover.Trigger>
      <Popover.Content showArrow>
        <Popover.Arrow />
        <Popover.Header className="px-base">
          <Popover.Label>Экспорт</Popover.Label>
          <Popover.Hint>Выберите формат файла</Popover.Hint>
        </Popover.Header>
        <Popover.Body className="p-base">
          <div className="flex flex-col gap-xsmall">
            <Button variant="ghost" size="small" type="button">
              PDF
            </Button>
            <Button variant="ghost" size="small" type="button">
              CSV
            </Button>
          </div>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
