import { IoInformationCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const WAVE_EXCLUDE = ["panelShell", "triggerLift", "chevron", "panelInner", "body"] as const;

const events = createMotionEvents({
  "faq:wave": { y: -6, duration: 0.22, replay: "rest", ease: "power2.out" },
  "faq:rest": { y: 0, duration: 0.16, ease: "power2.out" },
});

export function ExpandableMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("faq:wave", { stagger: 0.07, exclude: [...WAVE_EXCLUDE] })}
        >
          Stagger
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => void controller.playAll("faq:rest", { exclude: [...WAVE_EXCLUDE] })}
        >
          Reset
        </Button>
      </div>
      <Expandable
        className="max-w-lg"
        title="playAll stagger"
        description="icon → title → description, 70ms apart."
        icon={<IoInformationCircleOutline aria-hidden />}
        motionController={controller}
        motion={{ events }}
      >
        <Text as="p" variant="small" className="text-muted">
          exclude panelShell / chevron so height and rotate stay kit-owned.
        </Text>
      </Expandable>
    </div>
  );
}
