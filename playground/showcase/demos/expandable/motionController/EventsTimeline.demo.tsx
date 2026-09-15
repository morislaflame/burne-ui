import { IoInformationCircleOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "faq:attention": (ctx) => {
    const tl = ctx.timeline();
    if (ctx.targets.icon) {
      tl.fromRest(ctx.targets.icon, { rotation: -14, scale: 1.12, duration: 0.28, ease: "back.out(1.8)" }, 0);
    }
    if (ctx.targets.title) {
      tl.fromRest(ctx.targets.title, { x: 8, duration: 0.22, ease: "power2.out" }, 0.05);
    }
    if (ctx.targets.description) {
      tl.fromRest(ctx.targets.description, { y: -4, duration: 0.22 }, 0.1);
    }
    return tl;
  },
  "faq:rest": (ctx) => {
    const tl = ctx.timeline();
    if (ctx.targets.icon) {
      tl.to(ctx.targets.icon, { rotation: 0, scale: 1, duration: 0.2 }, 0);
    }
    if (ctx.targets.title) {
      tl.to(ctx.targets.title, { x: 0, duration: 0.2 }, 0);
    }
    if (ctx.targets.description) {
      tl.to(ctx.targets.description, { y: 0, duration: 0.2 }, 0);
    }
    return tl;
  },
});

export function ExpandableMotionEventsTimelineDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("title", "faq:attention")}>
          Attention
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.playSlot("title", "faq:rest")}>
          Rest
        </Button>
      </div>
      <Expandable
        className="max-w-lg"
        title="ctx.targets timeline"
        description="One factory tweens icon + title + description."
        icon={<IoInformationCircleOutline aria-hidden />}
        motionController={controller}
        motion={{ events }}
      >
        <Text as="p" variant="small" className="text-muted">
          playSlot on title — factory still reaches sibling slots via ctx.targets.
        </Text>
      </Expandable>
    </div>
  );
}
