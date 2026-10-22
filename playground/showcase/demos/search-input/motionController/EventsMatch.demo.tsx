import { Button } from "@/components/core/Button";
import { SearchInput } from "@/components/core/SearchInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "search:match": (ctx) => {
    const tl = ctx.timeline();
    if (ctx.targets.icon) {
      tl.fromRest(ctx.targets.icon, { rotation: -16, duration: 0.24, ease: "back.out(1.6)" }, 0);
    }
    if (ctx.targets.clear) {
      tl.fromRest(ctx.targets.clear, { x: 6, duration: 0.2 }, 0.06);
    }
    return tl;
  },
});

export function SearchInputMotionEventsMatchDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("search:match")}>
        Match
      </Button>
      <SearchInput
        aria-label="Search"
        placeholder="Search…"
        defaultExpanded
        defaultValue="atlas"
        collapseOnBlur={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
