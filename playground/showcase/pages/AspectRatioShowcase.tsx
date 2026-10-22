import { AspectRatioRatioDemo } from "../demos/aspect-ratio/AspectRatioRatio.demo";
import optionSource from "../demos/aspect-ratio/AspectRatioRatio.demo.tsx?raw";
import { AspectRatioClassNamesFullDemo } from "../demos/aspect-ratio/AspectRatioClassNamesFull.demo";
import classNamesSource from "../demos/aspect-ratio/AspectRatioClassNamesFull.demo.tsx?raw";
import { AspectRatioMotionControllerGalleryDemo } from "../demos/aspect-ratio/motionController/gallery";
import { AspectRatioSlotMotionGalleryDemo } from "../demos/aspect-ratio/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function AspectRatioShowcase() {
  return (
    <ShowcasePage
      title="AspectRatio"
      description="Box with a fixed ratio. Content fills the box."
      importPath='import { AspectRatio } from "@/components/core/AspectRatio";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Ratio" description="ratio is a number or a W/H string. Default 1.">
        <ShowcaseDemoFromFile align="stretch" Demo={AspectRatioRatioDemo} source={optionSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="Slot classes via classNames. className wins.">
        <ShowcaseDemoFromFile Demo={AspectRatioClassNamesFullDemo} source={classNamesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Slot motion" description="Opt-in enter. Defaults are empty.">
        <AspectRatioSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="play / set, namespaced events, events false, waitForComplete.">
        <AspectRatioMotionControllerGalleryDemo />
      </ShowcaseSection>
      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/AspectRatio" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow api="simple" description="ratio. A domain value, not size." />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
