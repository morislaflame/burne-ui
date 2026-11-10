import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

function preventNav(event: { preventDefault(): void }) {
  event.preventDefault();
}

const events = createMotionEvents({
  "breadcrumbs:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function BreadcrumbsMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("list", "breadcrumbs:nudge")}>
        Nudge
      </Button>
      <Breadcrumbs
        collapse={false}
        motionController={controller}
        motion={{
          itemLink: { pressIn: false, pressOut: false },
          events,
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
