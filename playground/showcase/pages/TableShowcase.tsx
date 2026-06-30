import { TableActivityFeedDemo } from "../demos/table/TableActivityFeed.demo";
import tableActivityFeedSource from "../demos/table/TableActivityFeed.demo.tsx?raw";
import { TableBasicDemo } from "../demos/table/TableBasic.demo";
import tableBasicSource from "../demos/table/TableBasic.demo.tsx?raw";
import { TableClassNamesFullDemo } from "../demos/table/TableClassNamesFull.demo";
import tableClassNamesFullSource from "../demos/table/TableClassNamesFull.demo.tsx?raw";
import { TableGlossDemo } from "../demos/table/TableGloss.demo";
import tableGlossSource from "../demos/table/TableGloss.demo.tsx?raw";
import { TableInvoiceToolbarDemo } from "../demos/table/TableInvoiceToolbar.demo";
import tableInvoiceToolbarSource from "../demos/table/TableInvoiceToolbar.demo.tsx?raw";
import { TableRowSelectionDemo } from "../demos/table/TableRowSelection.demo";
import tableRowSelectionSource from "../demos/table/TableRowSelection.demo.tsx?raw";
import { TableTeamRosterDemo } from "../demos/table/TableTeamRoster.demo";
import tableTeamRosterSource from "../demos/table/TableTeamRoster.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function TableShowcase() {
  return (
    <ShowcasePage
      title="Table"
      description="Таблицы данных с сортировкой, выбором строк и прокруткой."
      importPath='import { Table } from "@/components/core/Table";'
      tags={["core", "data"]}
    >
      <ShowcaseSection title="Базовая" description="ScrollContainer, Header, Body и Badge в ячейках.">
        <ShowcaseDemoFromFile align="stretch" Demo={TableBasicDemo} source={tableBasicSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Выбор строк" description="selectionMode multiple и контроль selectedKeys.">
        <ShowcaseDemoFromFile align="stretch" Demo={TableRowSelectionDemo} source={tableRowSelectionSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная таблица с hover-lift.">
        <ShowcaseDemoFromFile align="stretch" Demo={TableGlossDemo} source={tableGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Полная кастомизация слотов через classNames на root."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={TableClassNamesFullDemo}
          source={tableClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Ростер с аватарами, тулбар счетов и лента активности — `demos/table/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={TableTeamRosterDemo} source={tableTeamRosterSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TableInvoiceToolbarDemo} source={tableInvoiceToolbarSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TableActivityFeedDemo} source={tableActivityFeedSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Table" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="ScrollContainer, Content, Header, Column, Body, Row и Cell — слоты таблицы."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Данные">
          <p>
            <code>items</code> на Body и render-prop{" "}
            <code>{`{(row) => ...}`}</code> для строк. <code>selectionMode</code>,{" "}
            <code>selectedKeys</code> и <code>onSelectionChange</code> — для выбора.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
