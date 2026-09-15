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
          {title}: {config.interactiveDuration}ms
        </Text>
      </div>
      <Alert
        status="info"
        title={title}
        description="Sibling overlay — hover or Lift. Global configureMotion does not leak across islands."
        motionController={controller}
      />
    </div>
  );
}

export function MotionConfigTwoRootsDemo() {
  return (
    <div className="flex flex-col gap-2xlarge">
      <MotionConfigProvider motion={{ interactiveDuration: 80 }}>
        <Island title="Fast" testId="motion-config-fast" />
      </MotionConfigProvider>
      <MotionConfigProvider motion={{ interactiveDuration: 700 }}>
        <Island title="Slow" testId="motion-config-slow" />
      </MotionConfigProvider>
    </div>
  );
}
