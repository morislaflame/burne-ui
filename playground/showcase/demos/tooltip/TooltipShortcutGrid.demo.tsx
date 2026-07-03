import { Button } from "@/components/core/Button";
import { Kbd } from "@/components/core/Kbd";
import { Text } from "@/components/core/Text";
import { Tooltip } from "@/components/core/Tooltip";

const SHORTCUTS = [
  { keys: "⌘ K", label: "Command Palette" },
  { keys: "⌘ S", label: "Save" },
  { keys: "⌘ ⇧ P", label: "Quick Actions" },
] as const;

export function TooltipShortcutGridDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Hotkeys
      </Text>
      <div className="grid gap-small">
        {SHORTCUTS.map((item) => (
          <Tooltip key={item.keys} side="right">
            <Tooltip.Trigger>
              <Button variant="outline" size="small" type="button" className="w-full justify-between">
                <span>{item.label}</span>
                <Kbd size="small" variant="secondary">
                  {item.keys}
                </Kbd>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{item.label}</Tooltip.Content>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
