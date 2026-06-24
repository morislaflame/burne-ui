import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-mid">
      <Tooltip variant="default">
        <Tooltip.Trigger>
          <Button variant="outline" type="button">
            Default
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Подсказка по hover и focus</Tooltip.Content>
      </Tooltip>
      <Tooltip variant="success" side="top">
        <Tooltip.Trigger>
          <Button variant="outline" type="button">
            Success
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Операция выполнена</Tooltip.Content>
      </Tooltip>
      <Tooltip variant="danger" size="small">
        <Tooltip.Trigger>
          <Button variant="outline" type="button" size="small">
            Danger
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Действие необратимо</Tooltip.Content>
      </Tooltip>
      <Tooltip variant="info">
        <Tooltip.Trigger>
          <Button variant="outline" type="button">
            Info
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Дополнительная информация</Tooltip.Content>
      </Tooltip>
      <Tooltip variant="warning">
        <Tooltip.Trigger>
          <Button variant="outline" type="button">
            Warning
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Проверьте настройки</Tooltip.Content>
      </Tooltip>
    </div>
  );
}
