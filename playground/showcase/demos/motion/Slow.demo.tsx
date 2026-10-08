import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { MotionConfigProvider, useMotionConfig } from "@/components/core/utils/motionConfigContext";

function Pace({ title, testId }: { title: string; testId: string }) {
  const config = useMotionConfig();
  return (
    <div className="flex flex-col gap-small">
      <Text variant="small" className="text-muted" data-testid={testId}>
        {title}: {config.interactiveDuration}ms
      </Text>
      <Button>{title}</Button>
    </div>
  );
}

export function MotionSlowDemo() {
  return (
    <div className="flex flex-wrap gap-large">
      <MotionConfigProvider motion={{ interactiveDuration: 80 }}>
        <Pace title="Fast" testId="motion-level1-fast" />
      </MotionConfigProvider>
      <MotionConfigProvider motion={{ interactiveDuration: 700 }}>
        <Pace title="Slow" testId="motion-level1-slow" />
      </MotionConfigProvider>
    </div>
  );
}
