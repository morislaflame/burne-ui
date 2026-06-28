import { BreadcrumbsCollapsedMenuDemo } from "../demos/breadcrumbs/BreadcrumbsCollapsedMenu.demo";
import breadcrumbsCollapsedMenuSource from "../demos/breadcrumbs/BreadcrumbsCollapsedMenu.demo.tsx?raw";
import { BreadcrumbsDocTrailDemo } from "../demos/breadcrumbs/BreadcrumbsDocTrail.demo";
import breadcrumbsDocTrailSource from "../demos/breadcrumbs/BreadcrumbsDocTrail.demo.tsx?raw";
import { BreadcrumbsLongPathDemo } from "../demos/breadcrumbs/BreadcrumbsLongPath.demo";
import breadcrumbsLongPathSource from "../demos/breadcrumbs/BreadcrumbsLongPath.demo.tsx?raw";
import { BreadcrumbsProductHeaderDemo } from "../demos/breadcrumbs/BreadcrumbsProductHeader.demo";
import breadcrumbsProductHeaderSource from "../demos/breadcrumbs/BreadcrumbsProductHeader.demo.tsx?raw";
import { BreadcrumbsShortPathDemo } from "../demos/breadcrumbs/BreadcrumbsShortPath.demo";
import breadcrumbsShortPathSource from "../demos/breadcrumbs/BreadcrumbsShortPath.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function BreadcrumbsShowcase() {
  return (
    <ShowcasePage
      title="Breadcrumbs"
      description="Цепочка навигации по иерархии страниц с поддержкой текущего пункта."
      importPath='import { Breadcrumbs } from "@/components/core/Breadcrumbs";'
      tags={["core", "navigation"]}
    >
      <ShowcaseSection title="Короткий путь" description="Типичная цепочка из трёх уровней.">
        <ShowcaseDemoFromFile align="stretch" Demo={BreadcrumbsShortPathDemo} source={breadcrumbsShortPathSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Длинный путь" description="Несколько промежуточных уровней перед текущей страницей.">
        <ShowcaseDemoFromFile align="stretch" Demo={BreadcrumbsLongPathDemo} source={breadcrumbsLongPathSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Сжатие с меню «…», шапка товара и документационный путь — `demos/breadcrumbs/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={BreadcrumbsCollapsedMenuDemo} source={breadcrumbsCollapsedMenuSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={BreadcrumbsProductHeaderDemo} source={breadcrumbsProductHeaderSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={BreadcrumbsDocTrailDemo} source={breadcrumbsDocTrailSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Breadcrumbs" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Breadcrumbs.List оборачивает Breadcrumbs.Item. Проп current на последнем пункте — без ссылки."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Доступность">
          <p>
            Список рендерится как <code>&lt;ol&gt;</code>. Текущая страница помечается <code>aria-current</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
