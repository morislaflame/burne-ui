import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { Button } from "@/components/core/Button";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

function preventNav(event: { preventDefault(): void }) {
  event.preventDefault();
}

export function BreadcrumbsMotionControllerPlayItemDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("itemLink", "hoverIn")}>
          playSlot(itemLink)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("itemLink", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("itemLink", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Breadcrumbs collapse={false}>
        <Breadcrumbs.List>
          <Breadcrumbs.Item
            href="#"
            onClick={preventNav}
            motionController={controller}
            motion={{
              hoverIn: { y: -6, duration: 0.22, replay: "rest" },
              hoverOut: { y: 0, duration: 0.16 },
            }}
          >
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
