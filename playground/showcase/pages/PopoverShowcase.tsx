import { PopoverClassNamesFullDemo } from "../demos/popover/PopoverClassNamesFull.demo";
import popoverClassNamesFullSource from "../demos/popover/PopoverClassNamesFull.demo.tsx?raw";
import { PopoverFilterPanelDemo } from "../demos/popover/PopoverFilterPanel.demo";
import popoverFilterPanelSource from "../demos/popover/PopoverFilterPanel.demo.tsx?raw";
import { PopoverGlossDemo } from "../demos/popover/PopoverGloss.demo";
import popoverGlossSource from "../demos/popover/PopoverGloss.demo.tsx?raw";
import { PopoverProfileCardDemo } from "../demos/popover/PopoverProfileCard.demo";
import popoverProfileCardSource from "../demos/popover/PopoverProfileCard.demo.tsx?raw";
import { PopoverShareMenuDemo } from "../demos/popover/PopoverShareMenu.demo";
import popoverShareMenuSource from "../demos/popover/PopoverShareMenu.demo.tsx?raw";
import { PopoverSimpleDemo } from "../demos/popover/PopoverSimple.demo";
import popoverSimpleSource from "../demos/popover/PopoverSimple.demo.tsx?raw";
import { PopoverSidesDemo } from "../demos/popover/PopoverSides.demo";
import popoverSidesSource from "../demos/popover/PopoverSides.demo.tsx?raw";
import { PopoverSizesDemo } from "../demos/popover/PopoverSizes.demo";
import popoverSizesSource from "../demos/popover/PopoverSizes.demo.tsx?raw";
import { PopoverWithHeaderDemo } from "../demos/popover/PopoverWithHeader.demo";
import popoverWithHeaderSource from "../demos/popover/PopoverWithHeader.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function PopoverShowcase() {
  return (
    <ShowcasePage
      title="Popover"
      description="Trigger click panel - for menus, forms and additional content."
      importPath='import { Popover } from "@/components/core/Popover";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection title="Simple" description="Minimal markup: Trigger + Content + Body.">
        <ShowcaseDemoFromFile Demo={PopoverSimpleDemo} source={popoverSimpleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={PopoverSizesDemo} source={popoverSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="With header" description="Header, Label, Hint and arrow showArrow.">
        <ShowcaseDemoFromFile Demo={PopoverWithHeaderDemo} source={popoverWithHeaderSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — glass pop-up panel.">
        <ShowcaseDemoFromFile Demo={PopoverGlossDemo} source={popoverGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Accommodation" description="side: top, right, bottom, left.">
        <ShowcaseDemoFromFile Demo={PopoverSidesDemo} source={popoverSidesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slots root (trigger), trigger, content, panel, glossPanel, label, hint and body — through prop classNames."
      >
        <ShowcaseDemoFromFile Demo={PopoverClassNamesFullDemo} source={popoverClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Profile card, Share menu and filter panel — `demos/popover/`."
      >
        <ShowcaseDemoFromFile Demo={PopoverProfileCardDemo} source={popoverProfileCardSource} />
        <ShowcaseDemoFromFile Demo={PopoverShareMenuDemo} source={popoverShareMenuSource} />
        <ShowcaseDemoFromFile Demo={PopoverFilterPanelDemo} source={popoverFilterPanelSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Popover" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Trigger, Content, Header, Body, Label, Hint and Arrow — slots for panel structure."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Arrow">
          <p>
            <code>showArrow</code> on Content includes Popover.Arrow — pointer to trigger.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
