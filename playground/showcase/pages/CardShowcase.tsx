import { CardAuthPanelDemo } from "../demos/card/CardAuthPanel.demo";
import cardAuthPanelSource from "../demos/card/CardAuthPanel.demo.tsx?raw";
import { CardClassNamesFullDemo } from "../demos/card/CardClassNamesFull.demo";
import cardClassNamesFullSource from "../demos/card/CardClassNamesFull.demo.tsx?raw";
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
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function CardShowcase() {
  return (
    <ShowcasePage
      title="Card"
      description="Cards for grouping content with title, description and actions."
      importPath='import { Card } from "@/components/core/Card";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Options" description="default, outline and secondary.">
        <ShowcaseDemoFromFile align="stretch" Demo={CardVariantsDemo} source={cardVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Pressable" description="Clickable card with ripple and preview.">
        <ShowcaseDemoFromFile align="stretch" Demo={CardPressableDemo} source={cardPressableSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass surface with motion.">
        <ShowcaseDemoFromFile align="stretch" Demo={CardGlossDemo} source={cardGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Full customization of slots via classNames on root."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={CardClassNamesFullDemo}
          source={cardClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Tariffs, metrics, login/registration and selected product — `demos/card/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={CardAuthPanelDemo} source={cardAuthPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CardPricingGridDemo} source={cardPricingGridSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CardMetricTilesDemo} source={cardMetricTilesSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={CardProductSelectableDemo} source={cardProductSelectableSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Card" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Card.Header, Card.Title, Card.Description, Card.Body, Card.Footer — card slots."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="pressable and onPress on the root - an interactive card-button."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="root, header, title, description, body, footer, content, glossContent."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Options">
          <p>
            <code>default</code>, <code>outline</code>, <code>secondary</code>, <code>gloss</code> — prop{" "}
            <code>variant</code> on the root Card.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
