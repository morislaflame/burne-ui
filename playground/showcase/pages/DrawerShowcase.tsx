import { DrawerBottomSheetHandleDemo } from "../demos/drawer/DrawerBottomSheetHandle.demo";
import drawerBottomSheetHandleSource from "../demos/drawer/DrawerBottomSheetHandle.demo.tsx?raw";
import { DrawerAsChildMergedPropsDemo } from "../demos/drawer/DrawerAsChildMergedProps.demo";
import drawerAsChildMergedPropsSource from "../demos/drawer/DrawerAsChildMergedProps.demo.tsx?raw";
import { DrawerClassNamesFullDemo } from "../demos/drawer/DrawerClassNamesFull.demo";
import drawerClassNamesFullSource from "../demos/drawer/DrawerClassNamesFull.demo.tsx?raw";
import { DrawerFilterSheetDemo } from "../demos/drawer/DrawerFilterSheet.demo";
import drawerFilterSheetSource from "../demos/drawer/DrawerFilterSheet.demo.tsx?raw";
import { DrawerHandleDemo } from "../demos/drawer/DrawerHandle.demo";
import drawerHandleSource from "../demos/drawer/DrawerHandle.demo.tsx?raw";
import { DrawerMobileNavDemo } from "../demos/drawer/DrawerMobileNav.demo";
import drawerMobileNavSource from "../demos/drawer/DrawerMobileNav.demo.tsx?raw";
import { DrawerNotificationPanelDemo } from "../demos/drawer/DrawerNotificationPanel.demo";
import drawerNotificationPanelSource from "../demos/drawer/DrawerNotificationPanel.demo.tsx?raw";
import { DrawerPlacementDemo } from "../demos/drawer/DrawerPlacement.demo";
import drawerPlacementSource from "../demos/drawer/DrawerPlacement.demo.tsx?raw";
import { DrawerPortalContainerDemo } from "../demos/drawer/DrawerPortalContainer.demo";
import drawerPortalContainerSource from "../demos/drawer/DrawerPortalContainer.demo.tsx?raw";
import { DrawerSlotMotionGalleryDemo } from "../demos/drawer/slotMotion/gallery";
import { DrawerMotionControllerGalleryDemo } from "../demos/drawer/motionController/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function DrawerShowcase() {
  return (
    <ShowcasePage
      title="Drawer"
      description="Retractable panel with four sides and adjustable size."
      importPath='import { Drawer } from "@/components/core/Drawer";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection title="Accommodation" description="placement: left, right, top, bottom.">
        <ShowcaseDemoFromFile Demo={DrawerPlacementDemo} source={drawerPlacementSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Handle"
        description="Drawer.Handle — swipe-to-dismiss for each placement; bottom sheet example."
      >
        <ShowcaseDemoFromFile Demo={DrawerHandleDemo} source={drawerHandleSource} />
        <ShowcaseDemoFromFile
          Demo={DrawerBottomSheetHandleDemo}
          source={drawerBottomSheetHandleSource}
        />
      </ShowcaseSection>
<ShowcaseSection title="Slot motion" description="One gallery: default slide, instant panel, title stagger, headingBlock, bounce factory.">
        <DrawerSlotMotionGalleryDemo />
      </ShowcaseSection>

      <ShowcaseSection
        title="MotionController"
        description="Handle on Drawer.Panel (portal host). play() skips — use playSlot(&quot;panel&quot;). Panel stays open in a contained portal."
      >
        <DrawerMotionControllerGalleryDemo />
      </ShowcaseSection>

      <ShowcaseSection
        title="portalContainer"
        description="Custom portal host — drawer stays inside the container."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={DrawerPortalContainerDemo} source={drawerPortalContainerSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="asChild — merged props"
        description="Trigger asChild merges id, data-*, className, and ref onto the child."
      >
        <ShowcaseDemoFromFile Demo={DrawerAsChildMergedPropsDemo} source={drawerAsChildMergedPropsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Full customization of slots via classNames on Root."
      >
        <ShowcaseDemoFromFile
          Demo={DrawerClassNamesFullDemo}
          source={drawerClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Filters, mobile navigation and notification panel — `demos/drawer/`."
      >
        <ShowcaseDemoFromFile Demo={DrawerFilterSheetDemo} source={drawerFilterSheetSource} />
        <ShowcaseDemoFromFile Demo={DrawerMobileNavDemo} source={drawerMobileNavSource} />
        <ShowcaseDemoFromFile
          Demo={DrawerNotificationPanelDemo}
          source={drawerNotificationPanelSource}
        />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Drawer" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Drawer.Header, Drawer.Body, Drawer.Footer, Drawer.Close, Drawer.Handle — panel structure."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Custom HTMLElement host for the portal (contained: show + absolute)."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization>
          <p>
            <code>placement</code>: left, right, top, bottom. <code>size</code> — width or height
            panels.             <code>Drawer.Handle</code> — swipe dismiss. Slot motion —{" "}
            <code>drawerSlideEnter</code> / <code>Leave</code> via <code>motion.panel</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
