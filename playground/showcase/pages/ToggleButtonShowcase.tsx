import { ToggleButtonClassNamesFullDemo } from "../demos/toggle-button/ToggleButtonClassNamesFull.demo";
import toggleButtonClassNamesFullSource from "../demos/toggle-button/ToggleButtonClassNamesFull.demo.tsx?raw";
import { ToggleButtonControlledDemo } from "../demos/toggle-button/ToggleButtonControlled.demo";
import toggleButtonControlledSource from "../demos/toggle-button/ToggleButtonControlled.demo.tsx?raw";
import { ToggleButtonGlossDemo } from "../demos/toggle-button/ToggleButtonGloss.demo";
import toggleButtonGlossSource from "../demos/toggle-button/ToggleButtonGloss.demo.tsx?raw";
import { ToggleButtonMotionFillFromBottomDemo } from "../demos/toggle-button/ToggleButtonMotionFillFromBottom.demo";
import toggleButtonMotionFillFromBottomSource from "../demos/toggle-button/ToggleButtonMotionFillFromBottom.demo.tsx?raw";
import { ToggleButtonMotionIconSpinDemo } from "../demos/toggle-button/ToggleButtonMotionIconSpin.demo";
import toggleButtonMotionIconSpinSource from "../demos/toggle-button/ToggleButtonMotionIconSpin.demo.tsx?raw";
import { ToggleButtonMotionInstantFillDemo } from "../demos/toggle-button/ToggleButtonMotionInstantFill.demo";
import toggleButtonMotionInstantFillSource from "../demos/toggle-button/ToggleButtonMotionInstantFill.demo.tsx?raw";
import { ToggleButtonMotionTextTintDemo } from "../demos/toggle-button/ToggleButtonMotionTextTint.demo";
import toggleButtonMotionTextTintSource from "../demos/toggle-button/ToggleButtonMotionTextTint.demo.tsx?raw";
import { ToggleButtonReactionBarDemo } from "../demos/toggle-button/ToggleButtonReactionBar.demo";
import toggleButtonReactionBarSource from "../demos/toggle-button/ToggleButtonReactionBar.demo.tsx?raw";
import { ToggleButtonSizesDemo } from "../demos/toggle-button/ToggleButtonSizes.demo";
import toggleButtonSizesSource from "../demos/toggle-button/ToggleButtonSizes.demo.tsx?raw";
import { ToggleButtonUncontrolledDemo } from "../demos/toggle-button/ToggleButtonUncontrolled.demo";
import toggleButtonUncontrolledSource from "../demos/toggle-button/ToggleButtonUncontrolled.demo.tsx?raw";
import { ToggleButtonVariantsDemo } from "../demos/toggle-button/ToggleButtonVariants.demo";
import toggleButtonVariantsSource from "../demos/toggle-button/ToggleButtonVariants.demo.tsx?raw";
import { ToggleButtonViewSwitchDemo } from "../demos/toggle-button/ToggleButtonViewSwitch.demo";
import toggleButtonViewSwitchSource from "../demos/toggle-button/ToggleButtonViewSwitch.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function ToggleButtonShowcase() {
  return (
    <ShowcasePage
      title="ToggleButton"
      description="Button with the “pressed” state: likes, bookmarks and other toggle actions."
      importPath='import { ToggleButton } from "@/components/core/ToggleButton";'
      tags={["core", "actions"]}
    >
      <ShowcaseSection
        title="Controlled"
        description="pressed and onPressedChange — controlled mode."
      >
        <ShowcaseDemoFromFile Demo={ToggleButtonControlledDemo} source={toggleButtonControlledSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Uncontrolled"
        description="defaultPressed — initial state without external state."
      >
        <ShowcaseDemoFromFile Demo={ToggleButtonUncontrolledDemo} source={toggleButtonUncontrolledSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Options" description="variant: default, outline, ghost, gloss.">
        <ShowcaseDemoFromFile Demo={ToggleButtonVariantsDemo} source={toggleButtonVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={ToggleButtonSizesDemo} source={toggleButtonSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="Glass surface in pressed and resting state.">
        <ShowcaseDemoFromFile Demo={ToggleButtonGlossDemo} source={toggleButtonGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Slot motion"
        description="Each card is a separate copyable example — instant fill, fill from bottom, icon spin on check, text tint."
      >
        <ShowcaseDemoFromFile Demo={ToggleButtonMotionInstantFillDemo} source={toggleButtonMotionInstantFillSource} />
        <ShowcaseDemoFromFile Demo={ToggleButtonMotionFillFromBottomDemo} source={toggleButtonMotionFillFromBottomSource} />
        <ShowcaseDemoFromFile Demo={ToggleButtonMotionIconSpinDemo} source={toggleButtonMotionIconSpinSource} />
        <ShowcaseDemoFromFile Demo={ToggleButtonMotionTextTintDemo} source={toggleButtonMotionTextTintSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Full customization classNames"
        description="Slots root, fill, content, icon, label through classNames."
      >
        <ShowcaseDemoFromFile Demo={ToggleButtonClassNamesFullDemo} source={toggleButtonClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Reaction panels and view switches — state inside demo-files."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ToggleButtonReactionBarDemo} source={toggleButtonReactionBarSource} />
        <ShowcaseDemoFromFile Demo={ToggleButtonViewSwitchDemo} source={toggleButtonViewSwitchSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/ToggleButton" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="pressed, defaultPressed, onPressedChange, variant, size, icon, value (in a group)."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Groups">
          <p>
            For mutually exclusive or multiple selection use{" "}
            <code>ToggleButtonGroup</code> from <code>@/components/composite/ToggleButtonGroup</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
