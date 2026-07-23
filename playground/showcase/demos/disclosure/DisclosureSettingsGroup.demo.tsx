import { Disclosure } from "@/components/core/Disclosure";
import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function DisclosureSettingsGroupDemo() {
  return (
    <Disclosure.Group variant="card" defaultValue="notifications" className="w-full max-w-lg">
      <Disclosure value="notifications">
        <Disclosure.Trigger>Notifications</Disclosure.Trigger>
        <Disclosure.Content>
          <div className="flex flex-col gap-large">
            <Switch defaultChecked label="Email-digest" />
            <Switch label="Push on mobile" />
          </div>
        </Disclosure.Content>
      </Disclosure>
      <Disclosure value="privacy">
        <Disclosure.Trigger>Privacy</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">
            Manage Profile Visibility and Analytics Data.
          </Text>
        </Disclosure.Content>
      </Disclosure>
    </Disclosure.Group>
  );
}
