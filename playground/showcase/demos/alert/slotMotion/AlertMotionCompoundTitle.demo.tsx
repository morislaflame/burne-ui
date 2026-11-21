import { Alert } from "@/components/core/Alert";

export function AlertMotionCompoundTitleDemo() {
  return (
    <Alert status="success">
      <Alert.Message>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title
            motion={{
              hoverIn: { y: -2, duration: 0.2 },
              hoverOut: { y: 0 },
            }}
          >
            Compound Title
          </Alert.Title>
          <Alert.Description>Hover the title itself.</Alert.Description>
        </Alert.Content>
      </Alert.Message>
    </Alert>
  );
}
