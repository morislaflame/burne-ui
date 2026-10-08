import { TableAlignDemo } from "../demos/table/TableAlign.demo";
import tableAlignSource from "../demos/table/TableAlign.demo.tsx?raw";
import { TableActivityFeedDemo } from "../demos/table/TableActivityFeed.demo";
import tableActivityFeedSource from "../demos/table/TableActivityFeed.demo.tsx?raw";
import { TablePagesDemo } from "../demos/table/TablePages.demo";
import tablePagesSource from "../demos/table/TablePages.demo.tsx?raw";
import { TableVirtualizedDemo } from "../demos/table/TableVirtualized.demo";
import tableVirtualizedSource from "../demos/table/TableVirtualized.demo.tsx?raw";
import { TableBasicDemo } from "../demos/table/TableBasic.demo";
import tableBasicSource from "../demos/table/TableBasic.demo.tsx?raw";
import { TableClassNamesFullDemo } from "../demos/table/TableClassNamesFull.demo";
import tableClassNamesFullSource from "../demos/table/TableClassNamesFull.demo.tsx?raw";
import { TableColumnLabelDemo } from "../demos/table/TableColumnLabel.demo";
import tableColumnLabelSource from "../demos/table/TableColumnLabel.demo.tsx?raw";
import { TableCustomSortIconDemo } from "../demos/table/TableCustomSortIcon.demo";
import tableCustomSortIconSource from "../demos/table/TableCustomSortIcon.demo.tsx?raw";
import { TableInvoiceToolbarDemo } from "../demos/table/TableInvoiceToolbar.demo";
import tableInvoiceToolbarSource from "../demos/table/TableInvoiceToolbar.demo.tsx?raw";
import { TableRowSelectionDemo } from "../demos/table/TableRowSelection.demo";
import tableRowSelectionSource from "../demos/table/TableRowSelection.demo.tsx?raw";
import { TableTeamRosterDemo } from "../demos/table/TableTeamRoster.demo";
import tableTeamRosterSource from "../demos/table/TableTeamRoster.demo.tsx?raw";
import { TableSlotMotionGalleryDemo } from "../demos/table/slotMotion/gallery";
import { TableMotionControllerGalleryDemo } from "../demos/table/motionController/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function TableShowcase() {
  return (
    <ShowcasePage
      title="Table"
      description="Data tables with sorting, row selection and scrolling. Pages, column width and detail rows stay with the parent."
      importPath='import { Table } from "@/components/core/Table";'
      tags={["core", "data"]}
    >
      <ShowcaseSection title="Basic" description="ScrollContainer, Header, Body and Badge in cells.">
        <ShowcaseDemoFromFile align="stretch" Demo={TableBasicDemo} source={tableBasicSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Pages"
        description="Pagination sits in the footer. The parent slices the rows; Table does not page, resize columns, or expand them."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={TablePagesDemo} source={tablePagesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Alignment"
        description="Headers and cells start on the same edge. text-center on Column and Cell moves that column."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={TableAlignDemo} source={tableAlignSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Virtualized" description="Table.Body virtualized with items. ScrollContainer needs overflow-y and a max height.">
        <ShowcaseDemoFromFile align="stretch" Demo={TableVirtualizedDemo} source={tableVirtualizedSource} />
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

      <ShowcaseSection
        title="Column Label"
        description="Table.Label styles header text (color, weight). Plain Column children wrap automatically."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={TableColumnLabelDemo}
          source={tableColumnLabelSource}
        />
      </ShowcaseSection>
<ShowcaseSection
        title="default + choice"
        description="selectionMode multiple — selected rows too primary-tint."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={TableRowSelectionDemo}
          source={tableRowSelectionSource}
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

      <ShowcaseSection title="Slot motion" description="Instant enter skip, root/content timeline, row check/uncheck, column Label enter, headerRow and body, Table.Empty. Sort chevron is columnSortIcon (chevronRotate).">
        <TableSlotMotionGalleryDemo />
      </ShowcaseSection>

      <ShowcaseSection
        title="MotionController"
        description="One gallery: play vs playSlot on table chrome, playAll on repeated columns, nested Table.Row scope, table events."
      >
        <TableMotionControllerGalleryDemo />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Table" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="ScrollContainer, Content, Header, HeaderRow, Column, Label, Body, Row and Cell — table slots."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Data">
          <p>
            <code>items</code> on Body and render-prop{" "}
            <code>{`{(row) => ...}`}</code> for strings. <code>selectionMode</code>,{" "}
            <code>selectedKeys</code> and <code>onSelectionChange</code> — for selection.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
