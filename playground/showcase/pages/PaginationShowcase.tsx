import { PaginationClassNamesFullDemo } from "../demos/pagination/PaginationClassNamesFull.demo";
import paginationClassNamesFullSource from "../demos/pagination/PaginationClassNamesFull.demo.tsx?raw";
import { PaginationCompactCenteredDemo } from "../demos/pagination/PaginationCompactCentered.demo";
import paginationCompactCenteredSource from "../demos/pagination/PaginationCompactCentered.demo.tsx?raw";
import { PaginationCompactDemo } from "../demos/pagination/PaginationCompact.demo";
import paginationCompactSource from "../demos/pagination/PaginationCompact.demo.tsx?raw";
import { PaginationCustomLabelsDemo } from "../demos/pagination/PaginationCustomLabels.demo";
import paginationCustomLabelsSource from "../demos/pagination/PaginationCustomLabels.demo.tsx?raw";
import { PaginationTableFooterDemo } from "../demos/pagination/PaginationTableFooter.demo";
import paginationTableFooterSource from "../demos/pagination/PaginationTableFooter.demo.tsx?raw";
import { PaginationWithPagesDemo } from "../demos/pagination/PaginationWithPages.demo";
import paginationWithPagesSource from "../demos/pagination/PaginationWithPages.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function PaginationShowcase() {
  return (
    <ShowcasePage
      title="Pagination"
      description="Навигация по страницам списка с кнопками «назад/вперёд» и нумерацией."
      importPath='import { Pagination } from "@/components/core/Pagination";'
      tags={["core", "navigation"]}
    >
      <ShowcaseSection
        title="Компактная"
        description="Предыдущая и следующая страница с текстовой сводкой."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationCompactDemo} source={paginationCompactSource} />
      </ShowcaseSection>

      <ShowcaseSection title="С номерами" description="Pagination.Pages для прямого перехода к странице.">
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationWithPagesDemo} source={paginationWithPagesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Слоты root, summary, content, interactive, pageActive, navText и ellipsis — через prop classNames."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationClassNamesFullDemo} source={paginationClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Футер таблицы, центрированная навигация и свои подписи — `demos/pagination/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationTableFooterDemo} source={paginationTableFooterSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationCompactCenteredDemo} source={paginationCompactCenteredSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationCustomLabelsDemo} source={paginationCustomLabelsSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Pagination" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="page, totalPages и onPageChange на корне. Summary, Content, Item, Previous, Next и Pages — слоты."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Управление">
          <p>
            Состояние страницы храните снаружи через <code>useState</code>. <code>onPageChange</code> вызывается при
            клике по кнопкам и номерам.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
