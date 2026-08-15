import { DisclosureClassNamesFullDemo } from "../demos/disclosure/DisclosureClassNamesFull.demo";
import disclosureClassNamesFullSource from "../demos/disclosure/DisclosureClassNamesFull.demo.tsx?raw";
import { DisclosureCardGroupDemo } from "../demos/disclosure/DisclosureCardGroup.demo";
import disclosureCardGroupSource from "../demos/disclosure/DisclosureCardGroup.demo.tsx?raw";
import { DisclosureChangelogDemo } from "../demos/disclosure/DisclosureChangelog.demo";
import disclosureChangelogSource from "../demos/disclosure/DisclosureChangelog.demo.tsx?raw";
import { DisclosureCheckoutStepsDemo } from "../demos/disclosure/DisclosureCheckoutSteps.demo";
import disclosureCheckoutStepsSource from "../demos/disclosure/DisclosureCheckoutSteps.demo.tsx?raw";
import { DisclosureGlossDemo } from "../demos/disclosure/DisclosureGloss.demo";
import disclosureGlossSource from "../demos/disclosure/DisclosureGloss.demo.tsx?raw";
import { DisclosureMotionGroupChevronDemo } from "../demos/disclosure/DisclosureMotionGroupChevron.demo";
import disclosureMotionGroupChevronSource from "../demos/disclosure/DisclosureMotionGroupChevron.demo.tsx?raw";
import { DisclosureMotionInstantPanelDemo } from "../demos/disclosure/DisclosureMotionInstantPanel.demo";
import disclosureMotionInstantPanelSource from "../demos/disclosure/DisclosureMotionInstantPanel.demo.tsx?raw";
import { DisclosureMotionTitleLiftQuietDemo } from "../demos/disclosure/DisclosureMotionTitleLiftQuiet.demo";
import disclosureMotionTitleLiftQuietSource from "../demos/disclosure/DisclosureMotionTitleLiftQuiet.demo.tsx?raw";
import { DisclosureMotionTitleLiftTiltDemo } from "../demos/disclosure/DisclosureMotionTitleLiftTilt.demo";
import disclosureMotionTitleLiftTiltSource from "../demos/disclosure/DisclosureMotionTitleLiftTilt.demo.tsx?raw";
import { DisclosureOutlineFaqDemo } from "../demos/disclosure/DisclosureOutlineFaq.demo";
import disclosureOutlineFaqSource from "../demos/disclosure/DisclosureOutlineFaq.demo.tsx?raw";
import { DisclosureSettingsGroupDemo } from "../demos/disclosure/DisclosureSettingsGroup.demo";
import disclosureSettingsGroupSource from "../demos/disclosure/DisclosureSettingsGroup.demo.tsx?raw";
import { DisclosureSingleDemo } from "../demos/disclosure/DisclosureSingle.demo";
import disclosureSingleSource from "../demos/disclosure/DisclosureSingle.demo.tsx?raw";
import { DisclosureSizesDemo } from "../demos/disclosure/DisclosureSizes.demo";
import disclosureSizesSource from "../demos/disclosure/DisclosureSizes.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function DisclosureShowcase() {
  return (
    <ShowcasePage
      title="Disclosure"
      description="Expanding blocks with height animation - for FAQ and single sections."
      importPath='import { Disclosure } from "@/components/core/Disclosure";'
      tags={["core", "disclosure"]}
    >
      <ShowcaseSection title="Single" description="One Disclosure without a group.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureSingleDemo} source={disclosureSingleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureSizesDemo} source={disclosureSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Card group" description="Disclosure.Group variant card — general card.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureCardGroupDemo} source={disclosureCardGroupSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Outline FAQ" description="Disclosure.Group variant outline with icons.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureOutlineFaqDemo} source={disclosureOutlineFaqSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass panel with hover-lift.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureGlossDemo} source={disclosureGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Slot motion"
        description="Each card is a separate copyable example — instant height, titleLift tilt, quiet hover, group chevron snap."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureMotionInstantPanelDemo} source={disclosureMotionInstantPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureMotionTitleLiftTiltDemo} source={disclosureMotionTitleLiftTiltSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureMotionTitleLiftQuietDemo} source={disclosureMotionTitleLiftQuietSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureMotionGroupChevronDemo} source={disclosureMotionGroupChevronSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slot customization trigger, content and group through classNames."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={DisclosureClassNamesFullDemo}
          source={disclosureClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Design steps, group of settings and changelog — `demos/disclosure/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureCheckoutStepsDemo} source={disclosureCheckoutStepsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureSettingsGroupDemo} source={disclosureSettingsGroupSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureChangelogDemo} source={disclosureChangelogSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Disclosure" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Disclosure.Trigger and Disclosure.Content — block slots. Disclosure.Group combines several."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="root, trigger, title, contentPanel, glossPanel, handle, group."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Groups">
          <p>
            <code>variant=&quot;card&quot;</code> and <code>variant=&quot;outline&quot;</code> on Disclosure.Group.
            <code>defaultValue</code> — open item by default.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            Slot motion — <code>motion.contentShell</code> / <code>collapsibleHeight</code>. Handle-drag is kit-internal.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
