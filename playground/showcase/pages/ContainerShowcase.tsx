import { ContainerSizeDemo, LayoutScreenDemo } from "../demos/container/ContainerSize.demo";
import containerSizeSource from "../demos/container/ContainerSize.demo.tsx?raw";
import { ContainerClassNamesFullDemo } from "../demos/container/ContainerClassNamesFull.demo";
import containerClassNamesSource from "../demos/container/ContainerClassNamesFull.demo.tsx?raw";
import screenSource from "../demos/container/ContainerSize.demo.tsx?raw";

import { ContainerMotionControllerGalleryDemo } from "../demos/container/motionController/gallery";
import { ContainerSlotMotionGalleryDemo } from "../demos/container/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function ContainerShowcase() {
  return (
    <ShowcasePage
      title="Container"
      description="Centered page column. Width is max-w-component-*. Not a surface."
      importPath='import { Container } from "@/components/core/Container";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Size" description="size maps to max-w-component-*. padding is a horizontal space step.">
        <ShowcaseDemoFromFile align="stretch" Demo={ContainerSizeDemo} source={containerSizeSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="Slot root via classNames. className wins.">
        <ShowcaseDemoFromFile Demo={ContainerClassNamesFullDemo} source={containerClassNamesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Screen" description="Container, Stack, Grid, and Surface. No extra flex or grid wrapper.">
        <ShowcaseDemoFromFile align="stretch" Demo={LayoutScreenDemo} source={screenSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Slot motion" description="Opt-in enter on root. Defaults are empty.">
        <ContainerSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="play / set, namespaced events, events false, waitForComplete.">
        <ContainerMotionControllerGalleryDemo />
      </ShowcaseSection>
      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Container" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow api="simple" description="size and padding. size is the measure scale, data-size on the root." />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
