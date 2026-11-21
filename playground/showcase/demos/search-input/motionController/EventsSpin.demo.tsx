import { Button } from "@/components/core/Button";
import { SearchInput } from "@/components/core/SearchInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "search:spin": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { rotation: -22, duration: 0.16 }, 0);
    tl.fromRest(ctx.el, { rotation: 14, duration: 0.14 }, 0.16);
    tl.to(ctx.el, { rotation: 0, duration: 0.16 }, 0.3);
    return tl;
  },
});

export function SearchInputMotionEventsSpinDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("icon", "search:spin")}>
        Spin icon
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
