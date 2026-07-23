import { Button } from "@/components/core/Button";
import { Kbd } from "@/components/core/Kbd";
import { Text } from "@/components/core/Text";

export function KbdShortcutsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-large">
      <Text as="p" variant="small" className="font-medium">
        Hotkeys
      </Text>
      <div className="grid gap-small">
        <Button variant="outline" size="small" type="button" className="w-full justify-between">
          <span>Command Palette</span>
          <Kbd.Group>
            <Kbd size="small" variant="secondary">
              ⌘
            </Kbd>
            <Kbd size="small" variant="secondary">
              K
            </Kbd>
          </Kbd.Group>
        </Button>
        <Button variant="outline" size="small" type="button" className="w-full justify-between">
          <span>Save</span>
          <Kbd.Group>
            <Kbd size="small" variant="secondary">
              ⌘
            </Kbd>
            <Kbd size="small" variant="secondary">
              S
            </Kbd>
          </Kbd.Group>
        </Button>
      </div>
    </div>
  );
}
