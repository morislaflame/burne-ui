import { ExpandableCompoundDemo } from "../demos/expandable/ExpandableCompound.demo";
import expandableCompoundSource from "../demos/expandable/ExpandableCompound.demo.tsx?raw";
import { ExpandableGlossDemo } from "../demos/expandable/ExpandableGloss.demo";
import expandableGlossSource from "../demos/expandable/ExpandableGloss.demo.tsx?raw";
import { ExpandableOrderDetailsDemo } from "../demos/expandable/ExpandableOrderDetails.demo";
import expandableOrderDetailsSource from "../demos/expandable/ExpandableOrderDetails.demo.tsx?raw";
import { ExpandableSettingsStackDemo } from "../demos/expandable/ExpandableSettingsStack.demo";
import expandableSettingsStackSource from "../demos/expandable/ExpandableSettingsStack.demo.tsx?raw";
import { ExpandableShippingCompoundDemo } from "../demos/expandable/ExpandableShippingCompound.demo";
import expandableShippingCompoundSource from "../demos/expandable/ExpandableShippingCompound.demo.tsx?raw";
import { ExpandableSimpleApiDemo } from "../demos/expandable/ExpandableSimpleApi.demo";
import expandableSimpleApiSource from "../demos/expandable/ExpandableSimpleApi.demo.tsx?raw";
import { ExpandableSizesDemo } from "../demos/expandable/ExpandableSizes.demo";
import expandableSizesSource from "../demos/expandable/ExpandableSizes.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function ExpandableShowcase() {
  return (
    <ShowcasePage
      title="Expandable"
      description="Раскрывающиеся панели с заголовком, иконкой и описанием."
      importPath='import { Expandable } from "@/components/core/Expandable";'
      tags={["core", "disclosure"]}
    >
      <ShowcaseSection title="Simple API" description="title, icon и description на корне.">
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableSimpleApiDemo} source={expandableSimpleApiSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableSizesDemo} source={expandableSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная панель с hover-lift.">
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableGlossDemo} source={expandableGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Compound API" description="Trigger, Message, Icon, Title, Description и Panel.">
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableCompoundDemo} source={expandableCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Стек настроек, compound доставка и детали заказа — `demos/expandable/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableSettingsStackDemo} source={expandableSettingsStackSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableShippingCompoundDemo} source={expandableShippingCompoundSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableOrderDetailsDemo} source={expandableOrderDetailsSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Expandable" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="title, icon, description и children-панель на корне Expandable."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Trigger (Message: Title, Description, Icon) + Panel (Body). Content — внутри Trigger, Panel — раскрываемая область."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Иконка">
          <p>
            Передайте React-элемент в <code>icon</code> (Simple) или <code>Expandable.Icon</code> (Compound).
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
