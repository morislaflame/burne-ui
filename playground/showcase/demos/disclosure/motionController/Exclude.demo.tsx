import { IoInformationCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function DisclosureMotionControllerExcludeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn", { exclude: ["titleLift"] })}>
          Exclude titleLift
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Disclosure motionController={controller} motion={{ titleLift: { hoverIn: { y: -8, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } }, title: { hoverIn: { x: 8, duration: 0.22, replay: "rest" }, hoverOut: { x: 0, duration: 0.16 } }, icon: { hoverIn: { y: -4, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } } }}>
        <Disclosure.Trigger icon={<IoInformationCircleOutline aria-hidden className="size-full" />}>exclude titleLift</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">title + icon move; titleLift stays.</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
