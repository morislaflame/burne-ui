import { IoInformationCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const WAVE_EXCLUDE = ["contentShell", "titleLift", "chevron", "panelInner", "body"] as const;
const events = createMotionEvents({
  "disclosure:wave": { y: -6, duration: 0.22, replay: "rest", ease: "power2.out" },
  "disclosure:rest": { y: 0, duration: 0.16, ease: "power2.out" },
});

export function DisclosureMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => void controller.playAll("disclosure:wave", { stagger: 0.07, exclude: [...WAVE_EXCLUDE] })}>
          Stagger
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("disclosure:rest", { exclude: [...WAVE_EXCLUDE] })}>
          Reset
        </Button>
      </div>
      <Disclosure motionController={controller} motion={{ events }}>
        <Disclosure.Trigger icon={<IoInformationCircleOutline aria-hidden className="size-full" />}>playAll stagger</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">exclude contentShell / chevron so height and rotate stay kit-owned.</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
