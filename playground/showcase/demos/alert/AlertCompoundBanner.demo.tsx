import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";

export function AlertCompoundBannerDemo() {
  return (
    <Alert className="max-w-lg rounded-large p-mid" variant="gloss">
      <Alert.Message>
        <Alert.Content>
          <Alert.Title className="text-large">Early access to gloss theme</Alert.Title>
          <Alert.Description>
            <Text as="span" variant="small" className="text-muted">
              Enable the experiment in the workspace settings — available until the end of the month.
            </Text>
          </Alert.Description>
        </Alert.Content>
        <Alert.Action>
          <Button variant="gloss" size="small">
            Enable
          </Button>
        </Alert.Action>
      </Alert.Message>
    </Alert>
  );
}
