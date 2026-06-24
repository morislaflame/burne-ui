import { Breadcrumbs } from "@/components/core/Breadcrumbs";

import { preventNav } from "../../shared/utils";

export function BreadcrumbsDocTrailDemo() {
  return (
    <Breadcrumbs collapse={false} className="w-full max-w-2xl">
      <Breadcrumbs.List>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Документация
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Компоненты
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#" onClick={preventNav}>
          Формы
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>Breadcrumbs</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs>
  );
}
