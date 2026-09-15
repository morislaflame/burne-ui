import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "notify:ping": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function PingAction() {
  const controller = useMotionController();
  return (
    <Button size="small" variant="outline" onClick={() => controller.play("notify:ping")}>
      Ping
    </Button>
  );
}

export function AlertMotionControllerInsideDemo() {
  return (
    <Alert status="info" hoverLift={false} motion={{ events }}>
      <Alert.Message>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Inside the tree</Alert.Title>
          <Alert.Description>
            Action calls useMotionController() — no handle on the root.
          </Alert.Description>
        </Alert.Content>
        <Alert.Action>
          <PingAction />
        </Alert.Action>
      </Alert.Message>
    </Alert>
  );
}
