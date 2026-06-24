import { Input } from "@/components/core/Input";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function InputAuthPanelDemo() {
  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-sm">
      <div className="mb-mid flex flex-col gap-xsmall">
        <Text as="h3" variant="header-2">
          API-ключ
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Compound Input в панели настроек
        </Text>
      </div>
      <div className="flex flex-col gap-mid">
        <Input isRequired>
          <Input.Label>Название</Input.Label>
          <Input.Control placeholder="Production key" autoComplete="off" />
        </Input>
        <Input>
          <Input.Label>Секрет</Input.Label>
          <Input.Control inputType="password" placeholder="sk_live_…" autoComplete="off" />
          <Input.Hint>Не передавайте ключ в клиентский код.</Input.Hint>
        </Input>
      </div>
    </Surface>
  );
}
