import { Input } from "@/components/core/Input";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function InputAuthPanelDemo() {
  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-sm">
      <div className="mb-mid flex flex-col gap-xsmall">
        <Text as="h3" variant="header-2">
          API-key
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Compound Input in the settings panel
        </Text>
      </div>
      <div className="flex flex-col gap-mid">
        <Input required>
          <Input.Label>Name</Input.Label>
          <Input.Control placeholder="Production key" autoComplete="off" />
        </Input>
        <Input>
          <Input.Label>Secret</Input.Label>
          <Input.Control inputType="password" placeholder="sk_live_…" autoComplete="off" />
          <Input.Hint>Don't pass the key to client code.</Input.Hint>
        </Input>
      </div>
    </Surface>
  );
}
