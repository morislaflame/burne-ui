import { ToggleButtonGroupClassNamesFullDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupClassNamesFull.demo";
import toggleButtonGroupClassNamesFullSource from "../demos/toggleButtonGroup/ToggleButtonGroupClassNamesFull.demo.tsx?raw";
import { ToggleButtonGroupEditorBarDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupEditorBar.demo";
import toggleButtonGroupEditorBarSource from "../demos/toggleButtonGroup/ToggleButtonGroupEditorBar.demo.tsx?raw";
import { ToggleButtonGroupGlossDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupGloss.demo";
import toggleButtonGroupGlossSource from "../demos/toggleButtonGroup/ToggleButtonGroupGloss.demo.tsx?raw";
import { ToggleButtonGroupMultipleDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupMultiple.demo";
import toggleButtonGroupMultipleSource from "../demos/toggleButtonGroup/ToggleButtonGroupMultiple.demo.tsx?raw";
import { ToggleButtonGroupSegmentedDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupSegmented.demo";
import toggleButtonGroupSegmentedSource from "../demos/toggleButtonGroup/ToggleButtonGroupSegmented.demo.tsx?raw";
import { ToggleButtonGroupSingleDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupSingle.demo";
import toggleButtonGroupSingleSource from "../demos/toggleButtonGroup/ToggleButtonGroupSingle.demo.tsx?raw";
import { ToggleButtonGroupSizesDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupSizes.demo";
import toggleButtonGroupSizesSource from "../demos/toggleButtonGroup/ToggleButtonGroupSizes.demo.tsx?raw";
import { ToggleButtonGroupVerticalDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupVertical.demo";
import toggleButtonGroupVerticalSource from "../demos/toggleButtonGroup/ToggleButtonGroupVertical.demo.tsx?raw";
import { ToggleButtonGroupViewToolbarDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupViewToolbar.demo";
import toggleButtonGroupViewToolbarSource from "../demos/toggleButtonGroup/ToggleButtonGroupViewToolbar.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function ToggleButtonGroupShowcase() {
  return (
    <ShowcasePage
      title="ToggleButtonGroup"
      description="Group of radio buttons: single or multiple selection."
      importPath='import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";'
      tags={["composite", "forms"]}
    >
      <ShowcaseSection title="Single selection" description="type=&quot;single&quot; — list view.">
        <ShowcaseDemoFromFile Demo={ToggleButtonGroupSingleDemo} source={toggleButtonGroupSingleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large — forwarded to child ToggleButton.">
        <ShowcaseDemoFromFile Demo={ToggleButtonGroupSizesDemo} source={toggleButtonGroupSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Multiple Choice" description="type=&quot;multiple&quot; — text formatting.">
        <ShowcaseDemoFromFile Demo={ToggleButtonGroupMultipleDemo} source={toggleButtonGroupMultipleSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Segmented"
        description="segmented — gap between buttons, each with own radius (like ButtonGroup)."
      >
        <ShowcaseDemoFromFile Demo={ToggleButtonGroupSegmentedDemo} source={toggleButtonGroupSegmentedSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; — glass switch group.">
        <ShowcaseDemoFromFile Demo={ToggleButtonGroupGlossDemo} source={toggleButtonGroupGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="classNames" description="Slots root and separator via classNames.">
        <ShowcaseDemoFromFile
          Demo={ToggleButtonGroupClassNamesFullDemo}
          source={toggleButtonGroupClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="View toolbar, vertical group and format bar — `demos/toggleButtonGroup/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ToggleButtonGroupViewToolbarDemo} source={toggleButtonGroupViewToolbarSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ToggleButtonGroupVerticalDemo} source={toggleButtonGroupVerticalSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ToggleButtonGroupEditorBarDemo} source={toggleButtonGroupEditorBarSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/composite/ToggleButtonGroup" />
          <ShowcaseDoc.Import path="@/components/core/ToggleButton" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="type (single | multiple, default multiple), value, onValueChange, variant, size, segmented, orientation, aria-label on the root. Child ToggleButton with value."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Availability">
          <p>
            Required <code>aria-label</code> in the group. <code>icon</code> on ToggleButton — decorative
            icon with <code>aria-hidden</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
