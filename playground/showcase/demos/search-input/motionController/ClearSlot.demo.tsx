import { Button } from "@/components/core/Button";
import { SearchInput } from "@/components/core/SearchInput";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SearchInputMotionControllerClearDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("clear", "hoverIn")}>
          Shake clear
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.playSlot("clear", "hoverOut")}>
          Reset
        </Button>
      </div>
      <SearchInput
        aria-label="Search"
        placeholder="Search…"
        defaultExpanded
        defaultValue="quartz"
        collapseOnBlur={false}
        motionController={controller}
        motion={{
          clear: {
            hoverIn: { rotation: 18, duration: 0.2, yoyo: true, repeat: 1, replay: "rest" },
            hoverOut: { rotation: 0, duration: 0.16 },
          },
        }}
      />
    </div>
  );
}
