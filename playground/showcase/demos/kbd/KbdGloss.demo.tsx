import { Button } from "@/components/core/Button";
import { Kbd } from "@/components/core/Kbd";
import { Text } from "@/components/core/Text";

export function KbdGlossDemo() {
  return (
    <div className="flex flex-col items-start gap-mid">
      <Kbd variant="gloss" size="mid">
        ⌘ K
      </Kbd>
      <Kbd.Group>
        <Kbd variant="gloss">⌘</Kbd>
        <Kbd variant="gloss">Shift</Kbd>
        <Kbd variant="gloss">P</Kbd>
      </Kbd.Group>
      <Text as="p" variant="small" className="text-muted">
        Click{" "}
        <Kbd variant="gloss" size="small">
          Esc
        </Kbd>{" "}
        to close
      </Text>
      <Button variant="gloss" type="button" className="justify-between gap-plus">
        <span>Command Palette</span>
        <Kbd.Group>
          <Kbd variant="gloss" size="small">
            ⌘
          </Kbd>
          <Kbd variant="gloss" size="small">
            K
          </Kbd>
        </Kbd.Group>
      </Button>
    </div>
  );
}
