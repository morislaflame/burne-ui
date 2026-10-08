import { useEffect } from "react";

import { Button } from "@/components/core/Button";
import { TagsInput } from "@/components/core/TagsInput";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const slots = ["tag", "input", "label", "hint", "error"] as const;

export function TagsInputMotionPlayPartsDemo() {
  const controller = useMotionControllerHandle();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      controller.playSlot("shell", "enter");
    });
    return () => cancelAnimationFrame(frame);
  }, [controller]);

  return (
    <div className="flex w-full max-w-xs flex-col gap-2xlarge">
      <Button size="small" variant="outline" type="button" onClick={() => controller.playSlot("shell", "enter")}>
        Play
      </Button>
      <TagsInput
        label="Topics"
        hint="Enter or a comma"
        error="Add a topic"
        defaultValues={["design", "react"]}
        placeholder="Add a tag"
        motionController={controller}
        motion={{
          shell: {
            enter: (ctx) => {
              const tl = ctx.timeline();
              let at = 0;
              tl.fromTo(ctx.el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.28 }, at);
              at += 0.08;
              for (const slot of slots) {
                for (const el of ctx.getTargets(slot)) {
                  tl.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.24 }, at);
                  at += 0.05;
                }
              }
              return tl;
            },
          },
        }}
      />
    </div>
  );
}
