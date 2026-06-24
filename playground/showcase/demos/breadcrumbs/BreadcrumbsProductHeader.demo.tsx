import { IoHomeOutline } from "react-icons/io5";

import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { Text } from "@/components/core/Text";

import { preventNav } from "../../shared/utils";

export function BreadcrumbsProductHeaderDemo() {
  return (
    <div className="flex w-full flex-col gap-mid rounded-mid border-token bg-surface px-mid py-small">
      <Breadcrumbs>
        <Breadcrumbs.List>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            <span className="inline-flex items-center gap-xsmall">
              <IoHomeOutline aria-hidden className="size-3.5" />
              Магазин
            </span>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Одежда
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Куртки
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>Парка Arctic</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>
      <Text as="h3" variant="base" className="font-semibold">
        Парка Arctic
      </Text>
    </div>
  );
}
