import { ButtonGroupButtonsOnlyDemo } from "../demos/button-group/ButtonGroupButtonsOnly.demo";
import buttonGroupButtonsOnlySource from "../demos/button-group/ButtonGroupButtonsOnly.demo.tsx?raw";
import { ButtonGroupGlossDemo } from "../demos/button-group/ButtonGroupGloss.demo";
import buttonGroupGlossSource from "../demos/button-group/ButtonGroupGloss.demo.tsx?raw";
import { ButtonGroupHorizontalDemo } from "../demos/button-group/ButtonGroupHorizontal.demo";
import buttonGroupHorizontalSource from "../demos/button-group/ButtonGroupHorizontal.demo.tsx?raw";
import { ButtonGroupPricingTierDemo } from "../demos/button-group/ButtonGroupPricingTier.demo";
import buttonGroupPricingTierSource from "../demos/button-group/ButtonGroupPricingTier.demo.tsx?raw";
import { ButtonGroupSizesDemo } from "../demos/button-group/ButtonGroupSizes.demo";
import buttonGroupSizesSource from "../demos/button-group/ButtonGroupSizes.demo.tsx?raw";
import { ButtonGroupVerticalMenuDemo } from "../demos/button-group/ButtonGroupVerticalMenu.demo";
import buttonGroupVerticalMenuSource from "../demos/button-group/ButtonGroupVerticalMenu.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function ButtonGroupShowcase() {
  return (
    <ShowcasePage
      title="ButtonGroup"
      description="Склеенные кнопки и подписи: единая обводка, сегменты и вложенные контролы."
      importPath='import { ButtonGroup, ButtonGroupText } from "@/components/composite/ButtonGroup";'
      tags={["composite", "actions"]}
    >
      <ShowcaseSection
        title="Горизонтальная группа"
        description="ButtonGroupText, сегменты groupSegment и Dropdown в последнем сегменте."
      >
        <ShowcaseDemoFromFile Demo={ButtonGroupHorizontalDemo} source={buttonGroupHorizontalSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Только кнопки" description="Несколько outline-кнопок без подписи.">
        <ShowcaseDemoFromFile Demo={ButtonGroupButtonsOnlyDemo} source={buttonGroupButtonsOnlySource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="buttonSize: small, base, mid, large — высота всех сегментов.">
        <ShowcaseDemoFromFile Demo={ButtonGroupSizesDemo} source={buttonGroupSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; — общая стеклянная поверхность группы.">
        <ShowcaseDemoFromFile Demo={ButtonGroupGlossDemo} source={buttonGroupGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Вертикальные панели и цветные сегменты — demo-файлы в `demos/button-group/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ButtonGroupVerticalMenuDemo} source={buttonGroupVerticalMenuSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ButtonGroupPricingTierDemo} source={buttonGroupPricingTierSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/composite/ButtonGroup" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="ButtonGroup + ButtonGroupText; дочерние Button получают groupSegment из контекста."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="aria-label на группе, buttonSize, orientation; у Button — groupSegment для позиции сегмента."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Кастомизация">
          <p>
            Позиции сегмента: <code>first</code>, <code>middle</code>, <code>last</code>. Для
            вертикальной ориентации передайте <code>orientation=&quot;vertical&quot;</code> на группе и в{" "}
            <code>groupSegment</code>.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
