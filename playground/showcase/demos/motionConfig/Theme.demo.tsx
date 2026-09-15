import { useState } from "react";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { ThemeProvider } from "@/theme/ThemeProvider";

function Island() {
  const config = useMotionConfig();
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-small">
      <div className="flex flex-wrap items-center gap-small">
        <Button size="small" variant="outline" onClick={() => void controller.play("hoverIn")}>
          Lift
        </Button>
        <Text variant="small" className="text-muted" data-testid="motion-config-theme">
          ThemeProvider: {config.interactiveDuration}ms
        </Text>
      </div>
      <Alert
        status="info"
        title="Theme island"
        description="ThemeProvider.motion overlays GSAP for this tree. CSS tokens still go on this DOM root."
        motionController={controller}
      />
    </div>
  );
}

export function MotionConfigThemeDemo() {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setRoot} className="flex flex-col gap-2xlarge">
      {root ? (
        <ThemeProvider storageKey={null} root={root} motion={{ interactiveDuration: 90 }}>
          <Island />
        </ThemeProvider>
      ) : null}
    </div>
  );
}
