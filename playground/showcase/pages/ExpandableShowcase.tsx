import { ExpandableClassNamesFullDemo } from "../demos/expandable/ExpandableClassNamesFull.demo";
import expandableClassNamesFullSource from "../demos/expandable/ExpandableClassNamesFull.demo.tsx?raw";
import { ExpandableCompoundDemo } from "../demos/expandable/ExpandableCompound.demo";
import expandableCompoundSource from "../demos/expandable/ExpandableCompound.demo.tsx?raw";
import { ExpandableGlossDemo } from "../demos/expandable/ExpandableGloss.demo";
import expandableGlossSource from "../demos/expandable/ExpandableGloss.demo.tsx?raw";
import { ExpandableMotionChevronDemo } from "../demos/expandable/ExpandableMotionChevron.demo";
import expandableMotionChevronSource from "../demos/expandable/ExpandableMotionChevron.demo.tsx?raw";
import { ExpandableMotionDefaultDemo } from "../demos/expandable/ExpandableMotionDefault.demo";
import expandableMotionDefaultSource from "../demos/expandable/ExpandableMotionDefault.demo.tsx?raw";
import { ExpandableMotionInstantPanelDemo } from "../demos/expandable/ExpandableMotionInstantPanel.demo";
import expandableMotionInstantPanelSource from "../demos/expandable/ExpandableMotionInstantPanel.demo.tsx?raw";
import { ExpandableMotionBounceHeightDemo } from "../demos/expandable/ExpandableMotionBounceHeight.demo";
import expandableMotionBounceHeightSource from "../demos/expandable/ExpandableMotionBounceHeight.demo.tsx?raw";
import { ExpandableMotionClipWipeDemo } from "../demos/expandable/ExpandableMotionClipWipe.demo";
import expandableMotionClipWipeSource from "../demos/expandable/ExpandableMotionClipWipe.demo.tsx?raw";
import { ExpandableMotionPanelInnerDemo } from "../demos/expandable/ExpandableMotionPanelInner.demo";
import expandableMotionPanelInnerSource from "../demos/expandable/ExpandableMotionPanelInner.demo.tsx?raw";
import { ExpandableMotionTitleColorDemo } from "../demos/expandable/ExpandableMotionTitleColor.demo";
import expandableMotionTitleColorSource from "../demos/expandable/ExpandableMotionTitleColor.demo.tsx?raw";
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
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

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
        title="Slot motion"
        description="Each card is a separate copyable example — default recipes, instant panel, custom panelShell expand, chevron factory, classNames."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableMotionDefaultDemo} source={expandableMotionDefaultSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableMotionInstantPanelDemo} source={expandableMotionInstantPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableMotionChevronDemo} source={expandableMotionChevronSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableMotionBounceHeightDemo} source={expandableMotionBounceHeightSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableMotionClipWipeDemo} source={expandableMotionClipWipeSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableMotionPanelInnerDemo} source={expandableMotionPanelInnerSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ExpandableMotionTitleColorDemo} source={expandableMotionTitleColorSource} />
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
