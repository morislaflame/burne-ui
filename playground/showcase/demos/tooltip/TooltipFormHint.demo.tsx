import { IoInformationCircleOutline } from "react-icons/io5";

import { Tooltip } from "@/components/core/Tooltip";

export function TooltipFormHintDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-xsmall">
      <div className="flex items-center gap-xsmall">
        <label htmlFor="api-key" className="text-sm font-medium">
          API-ключ
        </label>
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
      <input
        id="api-key"
        readOnly
        value="sk_live_••••••••"
        className="rounded-base border-token bg-surface px-small py-xsmall font-mono text-sm"
      />
    </div>
  );
}
