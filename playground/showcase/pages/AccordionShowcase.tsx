import { AccordionCheckoutFaqDemo } from "../demos/accordion/AccordionCheckoutFaq.demo";
import accordionCheckoutFaqSource from "../demos/accordion/AccordionCheckoutFaq.demo.tsx?raw";
import { AccordionClassNamesFullDemo } from "../demos/accordion/AccordionClassNamesFull.demo";
import accordionClassNamesFullSource from "../demos/accordion/AccordionClassNamesFull.demo.tsx?raw";
import { AccordionCompoundDemo } from "../demos/accordion/AccordionCompound.demo";
import accordionCompoundSource from "../demos/accordion/AccordionCompound.demo.tsx?raw";
import { AccordionSizesDemo } from "../demos/accordion/AccordionSizes.demo";
import accordionSizesSource from "../demos/accordion/AccordionSizes.demo.tsx?raw";
import { AccordionDocsSectionsDemo } from "../demos/accordion/AccordionDocsSections.demo";
import accordionDocsSectionsSource from "../demos/accordion/AccordionDocsSections.demo.tsx?raw";
import { AccordionReleaseNotesDemo } from "../demos/accordion/AccordionReleaseNotes.demo";
import accordionReleaseNotesSource from "../demos/accordion/AccordionReleaseNotes.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function AccordionShowcase() {
  return (
    <ShowcasePage
      title="Accordion"
      description="Accordion with compound API — multiple linked drop-down sections."
      importPath='import { Accordion } from "@/components/composite/Accordion";'
      tags={["composite", "disclosure"]}
    >
      <ShowcaseSection title="Compound" description="Item, Heading, Trigger, Message, Panel and Indicator.">
        <ShowcaseDemoFromFile align="stretch" Demo={AccordionCompoundDemo} source={accordionCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={AccordionSizesDemo} source={accordionSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Full customization of slots (root, item, heading, Expandable slots) via classNames on Root."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={AccordionClassNamesFullDemo}
          source={accordionClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="FAQ registration, documentation sections and release notes — `demos/accordion/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={AccordionCheckoutFaqDemo} source={accordionCheckoutFaqSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AccordionDocsSectionsDemo} source={accordionDocsSectionsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AccordionReleaseNotesDemo} source={accordionReleaseNotesSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/composite/Accordion" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Accordion.Item → Heading (Trigger, Message with Content/Title/Description) → Panel (Body). Icon, Indicator — optional."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="State">
          <p>
            <code>defaultOpenIndex</code> on the root - the index of the open item when mounted. One open item
            at a time (accordion-behavior).
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization>
          <p>
            Panel opening — <code>configureMotion()</code> (<code>expandDuration</code>,{" "}
            <code>enableExpandable</code>). <code>classNames</code> on Root (root, item, heading, trigger,
            triggerLift, message, icon, content, title, description, chevron, panelShell, panel,
            glossContent) — locally overridable on <code>Accordion.Item</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
