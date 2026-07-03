import { TooltipFormHintDemo } from "../demos/tooltip/TooltipFormHint.demo";
import tooltipFormHintSource from "../demos/tooltip/TooltipFormHint.demo.tsx?raw";
import {
  TooltipClassNamesFullDemo,
  TooltipClassNamesGlossDemo,
} from "../demos/tooltip/TooltipClassNamesFull.demo";
import tooltipClassNamesFullSource from "../demos/tooltip/TooltipClassNamesFull.demo.tsx?raw";
import { TooltipGlossDemo } from "../demos/tooltip/TooltipGloss.demo";
import tooltipGlossSource from "../demos/tooltip/TooltipGloss.demo.tsx?raw";
import { TooltipIconToolbarDemo } from "../demos/tooltip/TooltipIconToolbar.demo";
import tooltipIconToolbarSource from "../demos/tooltip/TooltipIconToolbar.demo.tsx?raw";
import { TooltipShortcutGridDemo } from "../demos/tooltip/TooltipShortcutGrid.demo";
import tooltipShortcutGridSource from "../demos/tooltip/TooltipShortcutGrid.demo.tsx?raw";
import { TooltipSidesDemo } from "../demos/tooltip/TooltipSides.demo";
import tooltipSidesSource from "../demos/tooltip/TooltipSides.demo.tsx?raw";
import { TooltipSizesDemo } from "../demos/tooltip/TooltipSizes.demo";
import tooltipSizesSource from "../demos/tooltip/TooltipSizes.demo.tsx?raw";
import { TooltipVariantsDemo } from "../demos/tooltip/TooltipVariants.demo";
import tooltipVariantsSource from "../demos/tooltip/TooltipVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function TooltipShowcase() {
  return (
    <ShowcasePage
      title="Tooltip"
      description="Tooltips for hover and focus on the trigger."
      importPath='import { Tooltip } from "@/components/core/Tooltip";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection title="Options" description="Semantic variant for different contexts.">
        <ShowcaseDemoFromFile Demo={TooltipVariantsDemo} source={tooltipVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={TooltipSizesDemo} source={tooltipSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description='surface="gloss" — glass tip with hover-lift.'>
        <ShowcaseDemoFromFile Demo={TooltipGlossDemo} source={tooltipGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Accommodation" description="side: top, right, bottom, left.">
        <ShowcaseDemoFromFile Demo={TooltipSidesDemo} source={tooltipSidesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Customization classNames"
        description="Slots root (trigger), trigger, content, arrow, panel, glossContent, indicator, title and description."
      >
        <ShowcaseDemoFromFile Demo={TooltipClassNamesFullDemo} source={tooltipClassNamesFullSource} />
        <ShowcaseDemoFromFile Demo={TooltipClassNamesGlossDemo} source={tooltipClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Icon toolbar, field tooltip and hotkeys — `demos/tooltip/`."
      >
        <ShowcaseDemoFromFile Demo={TooltipIconToolbarDemo} source={tooltipIconToolbarSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TooltipFormHintDemo} source={tooltipFormHintSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TooltipShortcutGridDemo} source={tooltipShortcutGridSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Tooltip" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Tooltip.Trigger wraps an interactive element, Tooltip.Content — tooltip text."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Positioning">
          <p>
            Prop <code>side</code> on the root — <code>top</code>, <code>bottom</code>, <code>left</code>,{" "}
            <code>right</code>. Size — <code>small</code>, <code>base</code>, <code>mid</code>,{" "}
            <code>large</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss='surface="gloss"' />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
