import { Button } from "@/components/core/Button";
import { SearchInput } from "@/components/core/SearchInput";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SearchInputMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { stagger: 0.08 })}
        >
          Stagger in
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <SearchInput
        aria-label="Search"
        placeholder="Search…"
        defaultExpanded
        defaultValue="atlas"
        collapseOnBlur={false}
        motionController={controller}
        motion={{
          root: {
            hoverIn: { y: -2, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          icon: {
            hoverIn: { rotation: -18, duration: 0.22, replay: "rest" },
            hoverOut: { rotation: 0, duration: 0.16 },
          },
          clear: {
            hoverIn: { x: 8, duration: 0.22, replay: "rest" },
            hoverOut: { x: 0, duration: 0.16 },
          },
        }}
      />
    </div>
  );
}
