import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { MotionConfigProvider, useMotionConfig } from "@/components/core/utils/motionConfigContext";

function Flag() {
  const config = useMotionConfig();
  return (
    <div className="flex flex-col gap-small">
      <Text variant="small" className="text-muted" data-testid="motion-level1-reduced">
        {config.enableAnimations ? "animations on" : "animations off"}
      </Text>
      <Button>Still</Button>
    </div>
  );
}

export function MotionReducedDemo() {
  return (
    <MotionConfigProvider motion={{ enableAnimations: false }}>
      <Flag />
    </MotionConfigProvider>
  );
}
