import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

function preventNav(event: { preventDefault(): void }) {
  event.preventDefault();
}

const live = createMotionEvents({
  "breadcrumbs:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "breadcrumbs:nudge": false });

export function BreadcrumbsMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("list", "breadcrumbs:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("list", "breadcrumbs:nudge")}>
          Off nudge
        </Button>
      </div>
      <Breadcrumbs
        collapse={false}
        motionController={liveController}
        motion={{
          itemLink: { pressIn: false, pressOut: false },
          events: live,
        }}
      >
        <Breadcrumbs.List>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Home
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Catalog
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>Page</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>
      <Breadcrumbs
        collapse={false}
        motionController={offController}
        motion={{
          itemLink: { pressIn: false, pressOut: false },
          events: off,
        }}
      >
        <Breadcrumbs.List>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Home
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Catalog
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>Page</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>
    </div>
  );
}
