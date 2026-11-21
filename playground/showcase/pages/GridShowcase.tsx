import { GridColumnsDemo } from "../demos/grid/GridColumns.demo";
import gridColumnsSource from "../demos/grid/GridColumns.demo.tsx?raw";
import { GridClassNamesFullDemo } from "../demos/grid/GridClassNamesFull.demo";
import gridClassNamesSource from "../demos/grid/GridClassNamesFull.demo.tsx?raw";

import { GridMotionControllerGalleryDemo } from "../demos/grid/motionController/gallery";
import { GridSlotMotionGalleryDemo } from "../demos/grid/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function GridShowcase() {
  return (
    <ShowcasePage
      title="Grid"
      description="Fixed columns or auto-fit tracks. Not a surface and not role=grid."
      importPath='import { Grid } from "@/components/core/Grid";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Columns" description="1, 2, 3, 4, 6, 12, or auto with minTrack.">
        <ShowcaseDemoFromFile align="stretch" Demo={GridColumnsDemo} source={gridColumnsSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="Slot root via classNames. className wins.">
        <ShowcaseDemoFromFile Demo={GridClassNamesFullDemo} source={gridClassNamesSource} />
      </ShowcaseSection>
      
      <ShowcaseSection title="Slot motion" description="Opt-in enter on root. Defaults are empty.">
        <GridSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="play / set, namespaced events, events false, waitForComplete.">
        <GridMotionControllerGalleryDemo />
      </ShowcaseSection>
      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Grid" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow api="simple" description="columns, minTrack, gap, align. Column count is a domain prop." />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
