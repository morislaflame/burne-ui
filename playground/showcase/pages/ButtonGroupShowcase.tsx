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
      description="Glued buttons and labels: single stroke, segments and nested controls."
      importPath='import { ButtonGroup, ButtonGroupText } from "@/components/composite/ButtonGroup";'
      tags={["composite", "actions"]}
    >
      <ShowcaseSection
        title="Horizontal group"
        description="ButtonGroupText, segments groupSegment and Dropdown in the last segment."
      >
        <ShowcaseDemoFromFile Demo={ButtonGroupHorizontalDemo} source={buttonGroupHorizontalSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Buttons only" description="Some outline-buttons without signature.">
        <ShowcaseDemoFromFile Demo={ButtonGroupButtonsOnlyDemo} source={buttonGroupButtonsOnlySource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="buttonSize: small, base, mid, large — height of all segments.">
        <ShowcaseDemoFromFile Demo={ButtonGroupSizesDemo} source={buttonGroupSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; — common glass surface of the group.">
        <ShowcaseDemoFromFile Demo={ButtonGroupGlossDemo} source={buttonGroupGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Vertical panels and colored segments — demo-files in `demos/button-group/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ButtonGroupVerticalMenuDemo} source={buttonGroupVerticalMenuSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ButtonGroupPricingTierDemo} source={buttonGroupPricingTierSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/composite/ButtonGroup" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="aria-label, buttonSize, orientation, variant, segmented on the root ButtonGroup. Child Button and ButtonGroupText; groupSegment for buttons is specified by the group context."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="ButtonGroupText — segment signature; nested Input/ComboBox inherit variant groups."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            Segment positions: <code>first</code>, <code>middle</code>, <code>last</code>,{" "}
            <code>only</code>. For vertical group — <code>orientation=&quot;vertical&quot;</code> on
            root.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
