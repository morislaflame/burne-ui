import { StackOrientationDemo } from "../demos/stack/StackOrientation.demo";
import stackOrientationSource from "../demos/stack/StackOrientation.demo.tsx?raw";
import { StackClassNamesFullDemo } from "../demos/stack/StackClassNamesFull.demo";
import stackClassNamesSource from "../demos/stack/StackClassNamesFull.demo.tsx?raw";

import { StackMotionControllerGalleryDemo } from "../demos/stack/motionController/gallery";
import { StackSlotMotionGalleryDemo } from "../demos/stack/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function StackShowcase() {
  return (
    <ShowcasePage
      title="Stack"
      description="Column or row. Gap uses the space scale. Not a surface."
      importPath='import { Stack } from "@/components/core/Stack";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Orientation" description="vertical by default. horizontal is a row. gap is a space step.">
        <ShowcaseDemoFromFile align="stretch" Demo={StackOrientationDemo} source={stackOrientationSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="Slot root via classNames. className wins.">
        <ShowcaseDemoFromFile Demo={StackClassNamesFullDemo} source={stackClassNamesSource} />
      </ShowcaseSection>
      
      <ShowcaseSection title="Slot motion" description="Opt-in enter on root. Defaults are empty.">
        <StackSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="play / set, namespaced events, events false, waitForComplete.">
        <StackMotionControllerGalleryDemo />
      </ShowcaseSection>
      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Stack" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow api="simple" description="orientation, gap, align, justify, wrap. Domain gap is the space scale." />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
