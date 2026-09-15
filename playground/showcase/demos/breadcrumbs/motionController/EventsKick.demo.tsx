import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

function preventNav(event: { preventDefault(): void }) {
  event.preventDefault();
}

const events = createMotionEvents({
  "breadcrumbs:scan": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -4, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.separator) {
      tl.fromRest(ctx.targets.separator, { y: -8, duration: 0.18 }, 0);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.separator) {
      tl.to(ctx.targets.separator, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function BreadcrumbsMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("list", "breadcrumbs:scan")}>
        Scan
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
