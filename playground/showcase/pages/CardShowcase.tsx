import { CardAuthPanelDemo } from "../demos/card/CardAuthPanel.demo";
import cardAuthPanelSource from "../demos/card/CardAuthPanel.demo.tsx?raw";
import { CardGlossDemo } from "../demos/card/CardGloss.demo";
import cardGlossSource from "../demos/card/CardGloss.demo.tsx?raw";
import { CardMetricTilesDemo } from "../demos/card/CardMetricTiles.demo";
import cardMetricTilesSource from "../demos/card/CardMetricTiles.demo.tsx?raw";
import { CardPressableDemo } from "../demos/card/CardPressable.demo";
import cardPressableSource from "../demos/card/CardPressable.demo.tsx?raw";
import { CardPricingGridDemo } from "../demos/card/CardPricingGrid.demo";
import cardPricingGridSource from "../demos/card/CardPricingGrid.demo.tsx?raw";
import { CardProductSelectableDemo } from "../demos/card/CardProductSelectable.demo";
import cardProductSelectableSource from "../demos/card/CardProductSelectable.demo.tsx?raw";
import { CardVariantsDemo } from "../demos/card/CardVariants.demo";
import cardVariantsSource from "../demos/card/CardVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function CardShowcase() {
  return (
    <ShowcasePage
      title="Card"
      description="Карточки для группировки контента с заголовком, описанием и действиями."
      importPath='import { Card } from "@/components/core/Card";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Варианты" description="default, outline и secondary.">
        <ShowcaseDemoFromFile align="stretch" Demo={CardVariantsDemo} source={cardVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Pressable" description="Кликабельная карточка с ripple и превью.">
        <ShowcaseDemoFromFile align="stretch" Demo={CardPressableDemo} source={cardPressableSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная поверхность с motion.">
        <ShowcaseDemoFromFile align="stretch" Demo={CardGlossDemo} source={cardGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Тарифы, метрики, вход/регистрация и выбираемый товар — `demos/card/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={CardAuthPanelDemo} source={cardAuthPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CardPricingGridDemo} source={cardPricingGridSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CardMetricTilesDemo} source={cardMetricTilesSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CardProductSelectableDemo} source={cardProductSelectableSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Card" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Header, Title, Description, Body и Footer — слоты карточки."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="pressable и onPress на корне — интерактивная карточка-кнопка."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Варианты">
          <p>
            <code>default</code>, <code>outline</code>, <code>secondary</code>, <code>gloss</code> — проп{" "}
            <code>variant</code> на корне Card.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
