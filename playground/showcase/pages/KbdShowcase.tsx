import { KbdClassNamesFullDemo } from "../demos/kbd/KbdClassNamesFull.demo";
import kbdClassNamesFullSource from "../demos/kbd/KbdClassNamesFull.demo.tsx?raw";
import { KbdGlossDemo } from "../demos/kbd/KbdGloss.demo";
import kbdGlossSource from "../demos/kbd/KbdGloss.demo.tsx?raw";
import { KbdMotionInstantHoverDemo } from "../demos/kbd/KbdMotionInstantHover.demo";
import kbdMotionInstantHoverSource from "../demos/kbd/KbdMotionInstantHover.demo.tsx?raw";
import { KbdMotionKeyBounceDemo } from "../demos/kbd/KbdMotionKeyBounce.demo";
import kbdMotionKeyBounceSource from "../demos/kbd/KbdMotionKeyBounce.demo.tsx?raw";
import { KbdMotionRootTiltDemo } from "../demos/kbd/KbdMotionRootTilt.demo";
import kbdMotionRootTiltSource from "../demos/kbd/KbdMotionRootTilt.demo.tsx?raw";
import { KbdMotionTextPopDemo } from "../demos/kbd/KbdMotionTextPop.demo";
import kbdMotionTextPopSource from "../demos/kbd/KbdMotionTextPop.demo.tsx?raw";
import { KbdVariantsDemo } from "../demos/kbd/KbdVariants.demo";
import kbdVariantsSource from "../demos/kbd/KbdVariants.demo.tsx?raw";
import { KbdSizesDemo } from "../demos/kbd/KbdSizes.demo";
import kbdSizesSource from "../demos/kbd/KbdSizes.demo.tsx?raw";
import { KbdGroupDemo } from "../demos/kbd/KbdGroup.demo";
import kbdGroupSource from "../demos/kbd/KbdGroup.demo.tsx?raw";
import { KbdShortcutsDemo } from "../demos/kbd/KbdShortcuts.demo";
import kbdShortcutsSource from "../demos/kbd/KbdShortcuts.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function KbdShowcase() {
  return (
    <ShowcasePage
      title="Kbd"
      description="Displaying keys and shortcuts - options as in Badge, without status."
      importPath='import { Kbd } from "@/components/core/Kbd";'
      tags={["core", "typography"]}
    >
      <ShowcaseSection title="Options" description="default, primary, secondary, outline, gloss.">
        <ShowcaseDemoFromFile Demo={KbdVariantsDemo} source={kbdVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={KbdSizesDemo} source={kbdSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description='variant="gloss" — glass key with hover-lift.'>
        <ShowcaseDemoFromFile Demo={KbdGlossDemo} source={kbdGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Slot motion"
        description="Each card is a separate copyable example — instant hover, root tilt, text pop, key bounce."
      >
        <ShowcaseDemoFromFile Demo={KbdMotionInstantHoverDemo} source={kbdMotionInstantHoverSource} />
        <ShowcaseDemoFromFile Demo={KbdMotionRootTiltDemo} source={kbdMotionRootTiltSource} />
        <ShowcaseDemoFromFile Demo={KbdMotionTextPopDemo} source={kbdMotionTextPopSource} />
        <ShowcaseDemoFromFile Demo={KbdMotionKeyBounceDemo} source={kbdMotionKeyBounceSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Kbd.Group" description="Multiple keys with separator «+».">
        <ShowcaseDemoFromFile Demo={KbdGroupDemo} source={kbdGroupSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Shortcuts" description="Kbd in buttons and action lists.">
        <ShowcaseDemoFromFile Demo={KbdShortcutsDemo} source={kbdShortcutsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="classNames" description="Slot customization root through classNames.">
        <ShowcaseDemoFromFile Demo={KbdClassNamesFullDemo} source={kbdClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Kbd" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant, size, hoverLift on the root. Kbd.Group — compound for keyboard shortcuts."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Customization">
          <p>
            Slots <code>classNames.root</code>, <code>classNames.group</code>,{" "}
            <code>classNames.separator</code>. Group separator — prop <code>separator</code> (
            <code>null</code> hides).
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss='variant="gloss"' />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
