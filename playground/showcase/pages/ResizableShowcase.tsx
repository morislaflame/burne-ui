import { ResizableSplitDemo } from "../demos/resizable/ResizableSplit.demo";
import optionSource from "../demos/resizable/ResizableSplit.demo.tsx?raw";
import { ResizableClassNamesFullDemo } from "../demos/resizable/ResizableClassNamesFull.demo";
import classNamesSource from "../demos/resizable/ResizableClassNamesFull.demo.tsx?raw";
import { ResizableMotionControllerGalleryDemo } from "../demos/resizable/motionController/gallery";
import { ResizableSlotMotionGalleryDemo } from "../demos/resizable/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function ResizableShowcase() {
  return (
    <ShowcasePage
      title="Resizable"
      description="Drag or arrow-key split. The handle is a separator."
      importPath='import { Resizable } from "@/components/core/Resizable";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Split" description="Drag the handle or focus it and press Arrow keys. Size is percent, not motion.">
        <ShowcaseDemoFromFile align="stretch" Demo={ResizableSplitDemo} source={optionSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="Slot classes via classNames. className wins.">
        <ShowcaseDemoFromFile Demo={ResizableClassNamesFullDemo} source={classNamesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Slot motion" description="Opt-in enter. Defaults are empty.">
        <ResizableSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="play / set, namespaced events, events false, waitForComplete.">
        <ResizableMotionControllerGalleryDemo />
      </ShowcaseSection>
      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Resizable" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow api="simple" description="orientation, Panel defaultSize and minSize. Drag writes layout size, not a MotionVar." />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
