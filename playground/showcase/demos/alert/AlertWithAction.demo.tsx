import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";

export function AlertWithActionDemo() {
  return (
    <Alert
      status="warning"
    >
      <Alert.Message>
        <Alert.Indicator className="text-foreground"/>
        <Alert.Content>
          <Alert.Title className="text-small">Session expires soon</Alert.Title>
          <Alert.Description className="text-base">Save your draft or continue working — you will be logged out in 5 minutes.</Alert.Description>
        </Alert.Content>
        <Alert.Action>
          <Button variant="outline" size="small" className="shrink-0">
            Extend
          </Button>
        </Alert.Action>
      </Alert.Message>
    </Alert>
  );
}
