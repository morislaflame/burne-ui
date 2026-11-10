import { Button } from "@/components/core/Button";
import { SearchInput } from "@/components/core/SearchInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "search:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function SearchInputMotionEventsNudgeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("search:nudge")}>
        Nudge
      </Button>
      <SearchInput
        aria-label="Search"
        placeholder="Search…"
        defaultExpanded
        collapseOnBlur={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
