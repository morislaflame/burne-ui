import { SidebarSideDemo } from "../demos/sidebar/SidebarSide.demo";
import optionSource from "../demos/sidebar/SidebarSide.demo.tsx?raw";
import { SidebarClassNamesFullDemo } from "../demos/sidebar/SidebarClassNamesFull.demo";
import classNamesSource from "../demos/sidebar/SidebarClassNamesFull.demo.tsx?raw";
import { SidebarMotionControllerGalleryDemo } from "../demos/sidebar/motionController/gallery";
import { SidebarSlotMotionGalleryDemo } from "../demos/sidebar/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function SidebarShowcase() {
  return (
    <ShowcasePage
      title="Sidebar"
      description="Side column. Width is a layout measure. Not a surface."
      importPath='import { Sidebar } from "@/components/core/Sidebar";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Side" description="size is a layout measure. side flips the edge border.">
        <ShowcaseDemoFromFile align="stretch" Demo={SidebarSideDemo} source={optionSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="Slot classes via classNames. className wins.">
        <ShowcaseDemoFromFile Demo={SidebarClassNamesFullDemo} source={classNamesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Slot motion" description="Opt-in enter. Defaults are empty.">
        <SidebarSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="play / set, namespaced events, events false, waitForComplete.">
        <SidebarMotionControllerGalleryDemo />
      </ShowcaseSection>
      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Sidebar" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow api="simple" description="size and side. Domain scales, not ComponentSize or variant." />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
