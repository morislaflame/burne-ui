import { Button } from "@/components/core/Button";
import { SearchInput } from "@/components/core/SearchInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "search:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "search:nudge": false });

export function SearchInputMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("search:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("search:nudge")}>
          Off nudge
        </Button>
      </div>
      <SearchInput
        aria-label="Search live"
        placeholder="events on"
        defaultExpanded
        collapseOnBlur={false}
        motionController={liveController}
        motion={{ events: live }}
      />
      <SearchInput
        aria-label="Search off"
        placeholder="events false"
        defaultExpanded
        collapseOnBlur={false}
        motionController={offController}
        motion={{ events: off }}
      />
    </div>
  );
}
