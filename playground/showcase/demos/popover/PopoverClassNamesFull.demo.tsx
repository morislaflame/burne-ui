import { Button } from "@/components/core/Button/Button";
import { Popover } from "@/components/core/Popover";
import { Text } from "@/components/core/Text";

export function PopoverClassNamesFullDemo() {
  return (
    <Popover
      classNames={{
        content: "ring-1 ring-primary/25",
        panel: "border-primary/30 bg-surface/95",
        label: "text-primary font-semibold",
        hint: "text-muted/80",
        body: "text-foreground",
      }}
    >
      <Popover.Trigger>
        <Button variant="outline" type="button">
          Фильтры
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>
          <Popover.Label>Настройки отображения</Popover.Label>
          <Popover.Hint>Слоты panel, label и body через classNames</Popover.Hint>
        </Popover.Header>
        <Popover.Body>
          <Text as="p" variant="small">
            Пример кастомизации всплывающей панели.
          </Text>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
