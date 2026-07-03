import { ExpandableClassNamesFullDemo } from "../demos/expandable/ExpandableClassNamesFull.demo";
import expandableClassNamesFullSource from "../demos/expandable/ExpandableClassNamesFull.demo.tsx?raw";
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
      description="Drop-down panels with title, icon and description."
      importPath='import { Expandable } from "@/components/core/Expandable";'
      tags={["core", "disclosure"]}
    >
      <ShowcaseSection title="Simple API" description="title, icon and description on the root.">
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableSimpleApiDemo} source={expandableSimpleApiSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableSizesDemo} source={expandableSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass panel with hover-lift.">
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableGlossDemo} source={expandableGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Compound API" description="Trigger, Message, Icon, Title, Description and Panel.">
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableCompoundDemo} source={expandableCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Full customization of slots via classNames on Root."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={ExpandableClassNamesFullDemo}
          source={expandableClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Settings stack, compound delivery and order details — `demos/expandable/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableSettingsStackDemo} source={expandableSettingsStackSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableShippingCompoundDemo} source={expandableShippingCompoundSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableOrderDetailsDemo} source={expandableOrderDetailsSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Expandable" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="title, icon, description and children-root panel Expandable."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Trigger (Message: Title, Description, Icon) + Panel (Body). Content — inside Trigger, Panel — expandable area."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Icon">
          <p>
            Pass it on React-element in <code>icon</code> (Simple) or <code>Expandable.Icon</code> (Compound).
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
