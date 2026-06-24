import { AccordionCheckoutFaqDemo } from "../demos/accordion/AccordionCheckoutFaq.demo";
import accordionCheckoutFaqSource from "../demos/accordion/AccordionCheckoutFaq.demo.tsx?raw";
import { AccordionCompoundDemo } from "../demos/accordion/AccordionCompound.demo";
import accordionCompoundSource from "../demos/accordion/AccordionCompound.demo.tsx?raw";
import { AccordionDocsSectionsDemo } from "../demos/accordion/AccordionDocsSections.demo";
import accordionDocsSectionsSource from "../demos/accordion/AccordionDocsSections.demo.tsx?raw";
import { AccordionReleaseNotesDemo } from "../demos/accordion/AccordionReleaseNotes.demo";
import accordionReleaseNotesSource from "../demos/accordion/AccordionReleaseNotes.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function AccordionShowcase() {
  return (
    <ShowcasePage
      title="Accordion"
      description="Аккордеон с compound API — несколько связанных раскрывающихся секций."
      importPath='import { Accordion } from "@/components/composite/Accordion";'
      tags={["composite", "disclosure"]}
    >
      <ShowcaseSection title="Compound" description="Item, Heading, Trigger, Message, Panel и Indicator.">
        <ShowcaseDemoFromFile align="stretch" Demo={AccordionCompoundDemo} source={accordionCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="FAQ оформления, секции документации и release notes — `demos/accordion/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={AccordionCheckoutFaqDemo} source={accordionCheckoutFaqSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AccordionDocsSectionsDemo} source={accordionDocsSectionsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AccordionReleaseNotesDemo} source={accordionReleaseNotesSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/composite/Accordion" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Item, Heading, Trigger, Message, Content, Title, Description, Icon, Indicator, Panel и Body."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Состояние">
          <p>
            <code>defaultOpenIndex</code> на корне — индекс открытого пункта при монтировании. Один открытый пункт
            за раз (аккордеон-поведение).
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
