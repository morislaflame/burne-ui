import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

function preventNav(event: { preventDefault(): void }) {
  event.preventDefault();
}

const events = createMotionEvents({
  "breadcrumbs:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function ListPulse({ children }: { children: ReactNode }) {
  const controller = useMotionController();
  return (
    <Breadcrumbs.List onPointerEnter={() => controller.playSlot("list", "breadcrumbs:nudge")}>
      {children}
    </Breadcrumbs.List>
  );
}

export function BreadcrumbsMotionControllerInsideDemo() {
  return (
    <Breadcrumbs collapse={false} motion={{ itemLink: { pressIn: false, pressOut: false }, events }}>
      <ListPulse>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Catalog
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Page</Breadcrumbs.Item>
      </ListPulse>
    </Breadcrumbs>
  );
}
