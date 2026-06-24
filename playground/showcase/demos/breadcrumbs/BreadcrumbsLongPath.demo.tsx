import { Breadcrumbs } from "@/components/core/Breadcrumbs";

import { preventNav } from "../../shared/utils";

export function BreadcrumbsLongPathDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Главная
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Раздел
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Подраздел
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Категория
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Страница</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  );
}
