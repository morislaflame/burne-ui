import { Breadcrumbs } from "@/components/core/Breadcrumbs";

import { preventNav } from "../../shared/utils";

export function BreadcrumbsShortPathDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Главная
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Компоненты
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Playground</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  );
}
