import { IoInformationCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function DisclosureMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>
          play() skip
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("title", "hoverIn")}>
          playSlot(title)
        </Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>
          playAll()
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <Disclosure motionController={controller} motion={{ title: { hoverIn: { x: 8, duration: 0.22, replay: "rest" }, hoverOut: { x: 0, duration: 0.16 } }, icon: { hoverIn: { y: -4, duration: 0.22, replay: "rest" }, hoverOut: { y: 0, duration: 0.16 } } }}>
        <Disclosure.Trigger icon={<IoInformationCircleOutline aria-hidden className="size-full" />}>play vs playSlot</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">play() looks for root — skip. playAll hits title + icon, not nested kit height.</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
