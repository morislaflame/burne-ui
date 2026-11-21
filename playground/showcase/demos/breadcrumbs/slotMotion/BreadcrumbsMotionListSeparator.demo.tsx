import { Breadcrumbs } from "@/components/core/Breadcrumbs";

import { preventNav } from "../../../shared/utils";

export function BreadcrumbsMotionListSeparatorDemo() {
  return (
    <Breadcrumbs
      collapse={false}
      motion={{
        list: {
          enter: (ctx) =>
            ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24 }),
        },
        separator: {
          enter: (ctx) =>
            ctx.fromTo(
              { scale: 0.6, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.22, delay: 0.06 },
            ),
        },
      }}
    >
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Library
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Docs</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  );
}
