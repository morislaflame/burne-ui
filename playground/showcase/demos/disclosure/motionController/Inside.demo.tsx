import { IoInformationCircleOutline } from "react-icons/io5";

import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "disclosure:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function IconPulse() {
  const controller = useMotionController();
  return (
    <Disclosure.Icon onPointerOver={() => void controller.playSlot("icon", "disclosure:nudge")}>
      <IoInformationCircleOutline aria-hidden className="size-full" />
    </Disclosure.Icon>
  );
}
IconPulse.displayName = "DisclosureIcon";

export function DisclosureMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-lg">
      <Disclosure motion={{ events }}>
        <Disclosure.Trigger>
          <IconPulse />
          Hover the icon
        </Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">useMotionController inside Trigger sees Disclosure.</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
