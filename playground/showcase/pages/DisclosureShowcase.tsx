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
import { DisclosureOutlineFaqDemo } from "../demos/disclosure/DisclosureOutlineFaq.demo";
import disclosureOutlineFaqSource from "../demos/disclosure/DisclosureOutlineFaq.demo.tsx?raw";
import { DisclosureSettingsGroupDemo } from "../demos/disclosure/DisclosureSettingsGroup.demo";
import disclosureSettingsGroupSource from "../demos/disclosure/DisclosureSettingsGroup.demo.tsx?raw";
import { DisclosureSingleDemo } from "../demos/disclosure/DisclosureSingle.demo";
import disclosureSingleSource from "../demos/disclosure/DisclosureSingle.demo.tsx?raw";
import { DisclosureSizesDemo } from "../demos/disclosure/DisclosureSizes.demo";
import disclosureSizesSource from "../demos/disclosure/DisclosureSizes.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function DisclosureShowcase() {
  return (
    <ShowcasePage
      title="Disclosure"
      description="Expanding blocks with height animation - for FAQ and single sections."
      importPath='import { Disclosure, DisclosureGroup } from "@/components/core/Disclosure";'
      tags={["core", "disclosure"]}
    >
      <ShowcaseSection title="Single" description="One Disclosure without a group.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureSingleDemo} source={disclosureSingleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureSizesDemo} source={disclosureSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Card group" description="DisclosureGroup variant card — general card.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureCardGroupDemo} source={disclosureCardGroupSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Outline FAQ" description="DisclosureGroup variant outline with icons.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureOutlineFaqDemo} source={disclosureOutlineFaqSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass panel with hover-lift.">
        <ShowcaseDemoFromFile align="stretch" Demo={DisclosureGlossDemo} source={disclosureGlossSource} />
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
            description="Disclosure.Trigger and Disclosure.Content — block slots. DisclosureGroup combines several."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="root, trigger, triggerTitle, contentPanel, glossPanel, handle, group."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Groups">
          <p>
            <code>variant=&quot;card&quot;</code> and <code>variant=&quot;outline&quot;</code> on DisclosureGroup.
            <code>defaultValue</code> — open item by default.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
