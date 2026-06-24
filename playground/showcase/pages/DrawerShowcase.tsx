import { DrawerFilterSheetDemo } from "../demos/drawer/DrawerFilterSheet.demo";
import drawerFilterSheetSource from "../demos/drawer/DrawerFilterSheet.demo.tsx?raw";
import { DrawerGlossDemo } from "../demos/drawer/DrawerGloss.demo";
import drawerGlossSource from "../demos/drawer/DrawerGloss.demo.tsx?raw";
import { DrawerMobileNavDemo } from "../demos/drawer/DrawerMobileNav.demo";
import drawerMobileNavSource from "../demos/drawer/DrawerMobileNav.demo.tsx?raw";
import { DrawerNotificationPanelDemo } from "../demos/drawer/DrawerNotificationPanel.demo";
import drawerNotificationPanelSource from "../demos/drawer/DrawerNotificationPanel.demo.tsx?raw";
import { DrawerPlacementDemo } from "../demos/drawer/DrawerPlacement.demo";
import drawerPlacementSource from "../demos/drawer/DrawerPlacement.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function DrawerShowcase() {
  return (
    <ShowcasePage
      title="Drawer"
      description="Выдвижная панель с размещением слева/справа и настраиваемым размером."
      importPath='import { Drawer } from "@/components/core/Drawer";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection title="Размещение" description="placement: right и left, size: default и mid.">
        <ShowcaseDemoFromFile Demo={DrawerPlacementDemo} source={drawerPlacementSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; — стеклянная боковая панель.">
        <ShowcaseDemoFromFile Demo={DrawerGlossDemo} source={drawerGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Фильтры, мобильная навигация и панель уведомлений — `demos/drawer/`."
      >
        <ShowcaseDemoFromFile Demo={DrawerFilterSheetDemo} source={drawerFilterSheetSource} />
        <ShowcaseDemoFromFile Demo={DrawerMobileNavDemo} source={drawerMobileNavSource} />
        <ShowcaseDemoFromFile Demo={DrawerNotificationPanelDemo} source={drawerNotificationPanelSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Drawer" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.ApiRow
          api="compound"
          description="Drawer.Header, Drawer.Body, Drawer.Footer, Drawer.Close — структура панели."
        />
        <ShowcaseDoc.Block title="Кастомизация">
          <p>
            Используйте <code>placement</code> (left, right, top, bottom) и <code>size</code> для
            ширины/высоты. Подходит для мобильной навигации и боковых настроек.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
