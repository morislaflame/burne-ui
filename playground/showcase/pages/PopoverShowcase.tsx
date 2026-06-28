import { PopoverFilterPanelDemo } from "../demos/popover/PopoverFilterPanel.demo";
import popoverFilterPanelSource from "../demos/popover/PopoverFilterPanel.demo.tsx?raw";
import { PopoverGlossDemo } from "../demos/popover/PopoverGloss.demo";
import popoverGlossSource from "../demos/popover/PopoverGloss.demo.tsx?raw";
import { PopoverProfileCardDemo } from "../demos/popover/PopoverProfileCard.demo";
import popoverProfileCardSource from "../demos/popover/PopoverProfileCard.demo.tsx?raw";
import { PopoverShareMenuDemo } from "../demos/popover/PopoverShareMenu.demo";
import popoverShareMenuSource from "../demos/popover/PopoverShareMenu.demo.tsx?raw";
import { PopoverSimpleDemo } from "../demos/popover/PopoverSimple.demo";
import popoverSimpleSource from "../demos/popover/PopoverSimple.demo.tsx?raw";
import { PopoverSidesDemo } from "../demos/popover/PopoverSides.demo";
import popoverSidesSource from "../demos/popover/PopoverSides.demo.tsx?raw";
import { PopoverSizesDemo } from "../demos/popover/PopoverSizes.demo";
import popoverSizesSource from "../demos/popover/PopoverSizes.demo.tsx?raw";
import { PopoverWithHeaderDemo } from "../demos/popover/PopoverWithHeader.demo";
import popoverWithHeaderSource from "../demos/popover/PopoverWithHeader.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function PopoverShowcase() {
  return (
    <ShowcasePage
      title="Popover"
      description="Панель по клику на триггер — для меню, форм и дополнительного контента."
      importPath='import { Popover } from "@/components/core/Popover";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection title="Простой" description="Минимальная разметка: Trigger + Content + Body.">
        <ShowcaseDemoFromFile Demo={PopoverSimpleDemo} source={popoverSimpleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={PopoverSizesDemo} source={popoverSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="С заголовком" description="Header, Label, Hint и стрелка showArrow.">
        <ShowcaseDemoFromFile Demo={PopoverWithHeaderDemo} source={popoverWithHeaderSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная всплывающая панель.">
        <ShowcaseDemoFromFile Demo={PopoverGlossDemo} source={popoverGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размещение" description="side: top, right, bottom, left.">
        <ShowcaseDemoFromFile Demo={PopoverSidesDemo} source={popoverSidesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Карточка профиля, меню «Поделиться» и панель фильтров — `demos/popover/`."
      >
        <ShowcaseDemoFromFile Demo={PopoverProfileCardDemo} source={popoverProfileCardSource} />
        <ShowcaseDemoFromFile Demo={PopoverShareMenuDemo} source={popoverShareMenuSource} />
        <ShowcaseDemoFromFile Demo={PopoverFilterPanelDemo} source={popoverFilterPanelSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Popover" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Trigger, Content, Header, Body, Label, Hint и Arrow — слоты для структуры панели."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Стрелка">
          <p>
            <code>showArrow</code> на Content включает Popover.Arrow — указатель к триггеру.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
