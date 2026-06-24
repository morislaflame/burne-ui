import { Disclosure, DisclosureGroup } from "@/components/core/Disclosure";
import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function DisclosureSettingsGroupDemo() {
  return (
    <DisclosureGroup variant="card" defaultValue="notifications" className="w-full max-w-lg">
      <Disclosure value="notifications">
        <Disclosure.Trigger>Уведомления</Disclosure.Trigger>
        <Disclosure.Content>
          <div className="flex flex-col gap-mid">
            <Switch defaultChecked label="Email-дайджест" />
            <Switch label="Push на мобильном" />
          </div>
        </Disclosure.Content>
      </Disclosure>
      <Disclosure value="privacy">
        <Disclosure.Trigger>Приватность</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">
            Управление видимостью профиля и данных аналитики.
          </Text>
        </Disclosure.Content>
      </Disclosure>
    </DisclosureGroup>
  );
}
