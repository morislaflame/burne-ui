import { HeaderStickyDemo } from "../demos/header/HeaderSticky.demo";
import optionSource from "../demos/header/HeaderSticky.demo.tsx?raw";
import { HeaderClassNamesFullDemo } from "../demos/header/HeaderClassNamesFull.demo";
import classNamesSource from "../demos/header/HeaderClassNamesFull.demo.tsx?raw";
import { HeaderMotionControllerGalleryDemo } from "../demos/header/motionController/gallery";
import { HeaderSlotMotionGalleryDemo } from "../demos/header/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function HeaderShowcase() {
  return (
    <ShowcasePage
      title="Header"
      description="Top bar of a screen. sticky pins it. Not a surface."
      importPath='import { Header } from "@/components/core/Header";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Sticky" description="sticky adds sticky top-0. The bar stays a header.">
        <ShowcaseDemoFromFile align="stretch" Demo={HeaderStickyDemo} source={optionSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="Slot classes via classNames. className wins.">
        <ShowcaseDemoFromFile Demo={HeaderClassNamesFullDemo} source={classNamesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Slot motion" description="Opt-in enter. Defaults are empty.">
        <HeaderSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="play / set, namespaced events, events false, waitForComplete.">
        <HeaderMotionControllerGalleryDemo />
      </ShowcaseSection>
      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Header" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow api="simple" description="sticky. A domain flag, not variant." />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
