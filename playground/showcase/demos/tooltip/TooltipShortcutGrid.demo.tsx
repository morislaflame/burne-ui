import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { Tooltip } from "@/components/core/Tooltip";

const SHORTCUTS = [
  { keys: "⌘ K", label: "Командная палитра" },
  { keys: "⌘ S", label: "Сохранить" },
  { keys: "⌘ ⇧ P", label: "Быстрые действия" },
] as const;

export function TooltipShortcutGridDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Горячие клавиши
      </Text>
      <div className="grid gap-small">
        {SHORTCUTS.map((item) => (
          <Tooltip key={item.keys} side="right">
            <Tooltip.Trigger>
              <Button variant="outline" size="small" type="button" className="w-full justify-between">
                <span>{item.label}</span>
                <kbd className="rounded-small bg-secondary px-xsmall font-mono text-xs">{item.keys}</kbd>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{item.label}</Tooltip.Content>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
