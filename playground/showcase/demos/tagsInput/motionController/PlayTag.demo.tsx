import { Button } from "@/components/core/Button";
import { TagsInput } from "@/components/core/TagsInput";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function TagsInputMotionPlayTagDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex w-full max-w-xs flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" type="button" onClick={() => controller.playSlot("tag", "hoverIn")}>
          Nudge
        </Button>
        <Button size="small" variant="ghost" type="button" onClick={() => controller.set("tag", { y: 0 })}>
          Reset
        </Button>
      </div>
      <TagsInput
        label="Topics"
        defaultValues={["design", "react"]}
        placeholder="Add a tag"
        motionController={controller}
        motion={{
          tag: {
            hoverIn: (ctx) => ctx.fromRest({ y: -4, yoyo: true, repeat: 1, duration: 0.2 }),
            hoverOut: false,
          },
        }}
      />
    </div>
  );
}
