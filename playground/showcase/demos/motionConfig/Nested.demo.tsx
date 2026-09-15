import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { MotionConfigProvider, useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

function Island({ title, testId }: { title: string; testId: string }) {
  const config = useMotionConfig();
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-small">
      <div className="flex flex-wrap items-center gap-small">
        <Button size="small" variant="outline" onClick={() => void controller.play("hoverIn")}>
          Lift
        </Button>
        <Text variant="small" className="text-muted" data-testid={testId}>
          {title}: {config.interactiveDuration}ms · hoverLift {config.enableHoverLift ? "on" : "off"}
        </Text>
      </div>
      <Alert
        status="info"
        title={title}
        description="Inner overlay wins for keys it sets. Unspecified keys inherit the outer tree."
        motionController={controller}
      />
    </div>
  );
}

export function MotionConfigNestedDemo() {
  return (
    <MotionConfigProvider motion={{ interactiveDuration: 400 }}>
      <div className="flex flex-col gap-2xlarge">
        <Island title="Outer" testId="motion-config-outer" />
        <MotionConfigProvider motion={{ enableHoverLift: false }}>
          <Island title="Inner" testId="motion-config-inner" />
        </MotionConfigProvider>
      </div>
    </MotionConfigProvider>
  );
}
