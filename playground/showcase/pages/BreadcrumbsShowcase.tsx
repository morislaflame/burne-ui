import { BreadcrumbsClassNamesFullDemo } from "../demos/breadcrumbs/BreadcrumbsClassNamesFull.demo";
import breadcrumbsClassNamesFullSource from "../demos/breadcrumbs/BreadcrumbsClassNamesFull.demo.tsx?raw";
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
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function BreadcrumbsShowcase() {
  return (
    <ShowcasePage
      title="Breadcrumbs"
      description="Navigation chain through the page hierarchy with support for the current item."
      importPath='import { Breadcrumbs } from "@/components/core/Breadcrumbs";'
      tags={["core", "navigation"]}
    >
      <ShowcaseSection title="Shortcut" description="Typical chain of three levels.">
        <ShowcaseDemoFromFile align="stretch" Demo={BreadcrumbsShortPathDemo} source={breadcrumbsShortPathSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Long way" description="Several intermediate levels before the current page.">
        <ShowcaseDemoFromFile align="stretch" Demo={BreadcrumbsLongPathDemo} source={breadcrumbsLongPathSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Compression from menu «…», product header and documentation path — `demos/breadcrumbs/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={BreadcrumbsClassNamesFullDemo} source={breadcrumbsClassNamesFullSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={BreadcrumbsCollapsedMenuDemo} source={breadcrumbsCollapsedMenuSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={BreadcrumbsProductHeaderDemo} source={breadcrumbsProductHeaderSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={BreadcrumbsDocTrailDemo} source={breadcrumbsDocTrailSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Breadcrumbs" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="`items` on root for quick assembly. Slots can be configured via `classNames`."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Breadcrumbs.List + Breadcrumbs.Item. Item can be nested through wrappers, collection is done recursively."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Availability">
          <p>
            The list is rendered as <code>&lt;ol&gt;</code>. The current page is marked <code>aria-current</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Next step">
          <p>
            The next step is to go through and unify the names of the slots (
            <code>root</code>/<code>content</code>/<code>message</code> etc.) in the general guideline,
            so that they are called the same everywhere in China.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
