import { IoInformationCircleOutline } from "react-icons/io5";

import { Tooltip } from "@/components/core/Tooltip";
import { Label } from "@/components/core/Label/Label";
import { Input } from "@/index";

export function TooltipFormHintDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-xsmall">
      <div className="flex items-center gap-xsmall">
        <Label htmlFor="api-key" className="text-sm font-medium">
          API-ключ
        </Label>
        <Tooltip variant="info" side="right">
          <Tooltip.Trigger>
            <button
              type="button"
              className="inline-flex text-muted hover:text-foreground"
              aria-label="Подсказка про API-ключ"
            >
              <IoInformationCircleOutline aria-hidden className="size-4" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            Ключ хранится локально и не отправляется на сервер без вашего действия.
          </Tooltip.Content>
        </Tooltip>
      </div>
      <Input
        id="api-key"
        variant="gloss"
        value="sk_live_••••••••"
      />
    </div>
  );
}
