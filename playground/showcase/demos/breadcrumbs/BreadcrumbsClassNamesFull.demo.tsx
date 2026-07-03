import { Breadcrumbs } from "@/components/core/Breadcrumbs";

import { preventNav } from "../../shared/utils";

export function BreadcrumbsClassNamesFullDemo() {
  return (
    <Breadcrumbs
      className="max-w-lg rounded-mid border border-token p-small"
      classNames={{
        list: "gap-small",
        listItem: "gap-xsmall",
        separator: "text-primary opacity-100",
        separatorWrapper: "text-primary",
        link: "text-info hover:text-info",
        linkWrapper: "rounded-small",
        linkText: "tracking-tight",
        static: "text-warning",
        current: "font-semibold text-success",
        ellipsisTrigger: "text-warning",
        ellipsisLiftWrapper: "rounded-small",
        ellipsisText: "font-semibold",
        ellipsisPopover: "border border-token",
        dropdownItem: "text-foreground",
      }}
    >
      <Breadcrumbs.List>
        <div>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Home
          </Breadcrumbs.Item>
        </div>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Catalog
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Electronics
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Laptops
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>MacBook Pro</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  );
}
