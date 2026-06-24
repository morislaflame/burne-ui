import { IoCopyOutline, IoPencilOutline, IoTrashOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";

export function TooltipIconToolbarDemo() {
  return (
    <div className="flex items-center gap-xsmall rounded-mid border-token bg-surface p-xsmall">
      <Tooltip side="top">
        <Tooltip.Trigger>
          <Button variant="ghost" size="small" type="button" aria-label="Редактировать">
            <IoPencilOutline aria-hidden className="size-4" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Редактировать</Tooltip.Content>
      </Tooltip>
      <Tooltip side="top">
        <Tooltip.Trigger>
          <Button variant="ghost" size="small" type="button" aria-label="Копировать">
            <IoCopyOutline aria-hidden className="size-4" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Копировать ссылку</Tooltip.Content>
      </Tooltip>
      <Tooltip variant="danger" side="top">
        <Tooltip.Trigger>
          <Button variant="ghost" size="small" type="button" aria-label="Удалить">
            <IoTrashOutline aria-hidden className="size-4" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Удалить</Tooltip.Content>
      </Tooltip>
    </div>
  );
}
