import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";

export function AlertCompoundBannerDemo() {
  return (
    <Alert className="max-w-lg rounded-large border border-primary/25 bg-gradient-to-r from-primary/10 to-surface p-mid">
      <Alert.Message>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Ранний доступ к gloss-теме</Alert.Title>
          <Alert.Description>
            <Text as="span" variant="small" className="text-muted">
              Включите эксперимент в настройках workspace — доступно до конца месяца.
            </Text>
          </Alert.Description>
        </Alert.Content>
        <Alert.Action>
          <Button variant="primary" size="small">
            Включить
          </Button>
        </Alert.Action>
      </Alert.Message>
    </Alert>
  );
}
