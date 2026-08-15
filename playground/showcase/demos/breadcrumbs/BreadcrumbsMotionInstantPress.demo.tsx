import { Breadcrumbs } from "@/components/core/Breadcrumbs";

import { preventNav } from "../../shared/utils";

export function BreadcrumbsMotionInstantPressDemo() {
  return (
    <Breadcrumbs
      motion={{
        itemLink: { pressIn: false },
      }}
    >
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Docs
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Instant press</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  );
}
