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
      description="Navigation through list pages with back/forward buttons and numbering."
      importPath='import { Pagination } from "@/components/core/Pagination";'
      tags={["core", "navigation"]}
    >
      <ShowcaseSection
        title="Compact"
        description="Previous and next page with text summary."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationCompactDemo} source={paginationCompactSource} />
      </ShowcaseSection>

      <ShowcaseSection title="With numbers" description="Pagination.Pages to go directly to the page.">
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationWithPagesDemo} source={paginationWithPagesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slots root, summary, content, interactive, pageActive, navText and ellipsis — through prop classNames."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationClassNamesFullDemo} source={paginationClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Table footer, centered navigation and custom captions — `demos/pagination/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationTableFooterDemo} source={paginationTableFooterSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationCompactCenteredDemo} source={paginationCompactCenteredSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={PaginationCustomLabelsDemo} source={paginationCustomLabelsSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Pagination" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="page, totalPages and onPageChange on the root. Summary, Content, Item, Previous, Next and Pages — slots."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Control">
          <p>
            Store page state externally via <code>useState</code>. <code>onPageChange</code> called when
            click on buttons and numbers.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
