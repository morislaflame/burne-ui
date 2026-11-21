import { Button } from "@/components/core/Button";
import { HoverCard } from "@/components/core/HoverCard";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { HoverCardPersonBody, HoverCardPersonTrigger } from "../profile";

export function HoverCardMotionPlayPartsDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col items-center gap-2xlarge">
      <Button size="small" variant="outline" type="button" onClick={() => controller.playSlot("content", "enter")}>
        Play
      </Button>
      <HoverCard
        defaultOpen
        trigger={<HoverCardPersonTrigger />}
        title="Ada Lovelace"
        description="Mathematician"
        classNames={{ content: "w-64" }}
        motionController={controller}
        motion={{
          content: {
            enter: (ctx) => {
              const tl = ctx.timeline();
              const steps = [ctx.el, ctx.targets.title, ctx.targets.description, ctx.targets.body];
              let at = 0;
              for (const el of steps) {
                if (!el) continue;
                tl.fromTo(el, { y: 8 }, { y: 0, duration: 0.28 }, at);
                at += 0.08;
              }
              return tl;
            },
          },
        }}
      >
        <HoverCardPersonBody />
      </HoverCard>
    </div>
  );
}
