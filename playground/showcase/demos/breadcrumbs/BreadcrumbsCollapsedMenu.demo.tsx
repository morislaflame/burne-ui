import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { Text } from "@/components/core/Text";

import { preventNav } from "../../shared/utils";

export function BreadcrumbsCollapsedMenuDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <Text as="p" variant="small" className="text-muted">
        Более трёх пунктов сжимаются: первый · … · два последних.
      </Text>
      <Breadcrumbs>
        <Breadcrumbs.List>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Главная
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Каталог
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Электроника
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Ноутбуки
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Apple
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>MacBook Pro 14&quot;</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>
    </div>
  );
}
