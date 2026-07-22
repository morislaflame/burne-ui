import { TableActivityFeedDemo } from "../demos/table/TableActivityFeed.demo";
import tableActivityFeedSource from "../demos/table/TableActivityFeed.demo.tsx?raw";
import { TableBasicDemo } from "../demos/table/TableBasic.demo";
import tableBasicSource from "../demos/table/TableBasic.demo.tsx?raw";
import { TableClassNamesFullDemo } from "../demos/table/TableClassNamesFull.demo";
import tableClassNamesFullSource from "../demos/table/TableClassNamesFull.demo.tsx?raw";
import { TableCustomSortIconDemo } from "../demos/table/TableCustomSortIcon.demo";
import tableCustomSortIconSource from "../demos/table/TableCustomSortIcon.demo.tsx?raw";
import { TableGlossDemo } from "../demos/table/TableGloss.demo";
import tableGlossSource from "../demos/table/TableGloss.demo.tsx?raw";
import { TableGlossSelectionDemo } from "../demos/table/TableGlossSelection.demo";
import tableGlossSelectionSource from "../demos/table/TableGlossSelection.demo.tsx?raw";
import { TableInvoiceToolbarDemo } from "../demos/table/TableInvoiceToolbar.demo";
import tableInvoiceToolbarSource from "../demos/table/TableInvoiceToolbar.demo.tsx?raw";
import { TableRowSelectionDemo } from "../demos/table/TableRowSelection.demo";
import tableRowSelectionSource from "../demos/table/TableRowSelection.demo.tsx?raw";
import { TableTeamRosterDemo } from "../demos/table/TableTeamRoster.demo";
import tableTeamRosterSource from "../demos/table/TableTeamRoster.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function TableShowcase() {
  return (
    <ShowcasePage
      title="Table"
      description="Data tables with sorting, row selection and scrolling."
      importPath='import { Table } from "@/components/core/Table";'
      tags={["core", "data"]}
    >
      <ShowcaseSection title="Basic" description="ScrollContainer, Header, Body and Badge in cells.">
        <ShowcaseDemoFromFile align="stretch" Demo={TableBasicDemo} source={tableBasicSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Row selection" description="selectionMode multiple and control selectedKeys.">
        <ShowcaseDemoFromFile align="stretch" Demo={TableRowSelectionDemo} source={tableRowSelectionSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom sort icon"
        description="Table.Column sortIcon replaces the default chevron; null hides it."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={TableCustomSortIconDemo}
          source={tableCustomSortIconSource}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — hover lines primary-tint, hover-lift panels.">
        <ShowcaseDemoFromFile align="stretch" Demo={TableGlossDemo} source={tableGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Gloss + choice"
        description="selectionMode multiple — selected rows too primary-tint."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={TableGlossSelectionDemo}
          source={tableGlossSelectionSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Full customization of slots via classNames on root."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={TableClassNamesFullDemo}
          source={tableClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Roster with avatars, account toolbar and activity feed — `demos/table/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={TableTeamRosterDemo} source={tableTeamRosterSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TableInvoiceToolbarDemo} source={tableInvoiceToolbarSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TableActivityFeedDemo} source={tableActivityFeedSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Table" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="ScrollContainer, Content, Header, Column, Body, Row and Cell — table slots."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Data">
          <p>
            <code>items</code> on Body and render-prop{" "}
            <code>{`{(row) => ...}`}</code> for strings. <code>selectionMode</code>,{" "}
            <code>selectedKeys</code> and <code>onSelectionChange</code> — for selection.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
