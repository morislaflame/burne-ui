import { DrawerBottomSheetHandleDemo } from "../demos/drawer/DrawerBottomSheetHandle.demo";
import drawerBottomSheetHandleSource from "../demos/drawer/DrawerBottomSheetHandle.demo.tsx?raw";
import { DrawerAsChildMergedPropsDemo } from "../demos/drawer/DrawerAsChildMergedProps.demo";
import drawerAsChildMergedPropsSource from "../demos/drawer/DrawerAsChildMergedProps.demo.tsx?raw";
import { DrawerClassNamesFullDemo } from "../demos/drawer/DrawerClassNamesFull.demo";
import drawerClassNamesFullSource from "../demos/drawer/DrawerClassNamesFull.demo.tsx?raw";
import { DrawerFilterSheetDemo } from "../demos/drawer/DrawerFilterSheet.demo";
import drawerFilterSheetSource from "../demos/drawer/DrawerFilterSheet.demo.tsx?raw";
import { DrawerGlossDemo } from "../demos/drawer/DrawerGloss.demo";
import drawerGlossSource from "../demos/drawer/DrawerGloss.demo.tsx?raw";
import { DrawerMotionDefaultDemo } from "../demos/drawer/DrawerMotionDefault.demo";
import drawerMotionDefaultSource from "../demos/drawer/DrawerMotionDefault.demo.tsx?raw";
import { DrawerMotionInstantPanelDemo } from "../demos/drawer/DrawerMotionInstantPanel.demo";
import drawerMotionInstantPanelSource from "../demos/drawer/DrawerMotionInstantPanel.demo.tsx?raw";
import { DrawerMotionTitleStaggerDemo } from "../demos/drawer/DrawerMotionTitleStagger.demo";
import drawerMotionTitleStaggerSource from "../demos/drawer/DrawerMotionTitleStagger.demo.tsx?raw";
import { DrawerMotionBounceSlideDemo } from "../demos/drawer/DrawerMotionBounceSlide.demo";
import drawerMotionBounceSlideSource from "../demos/drawer/DrawerMotionBounceSlide.demo.tsx?raw";
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

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; — glass side panel.">
        <ShowcaseDemoFromFile Demo={DrawerGlossDemo} source={drawerGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Slot motion"
        description="Each card is a separate copyable example — default slide, instant panel, title stagger, bounce factory."
      >
        <ShowcaseDemoFromFile Demo={DrawerMotionDefaultDemo} source={drawerMotionDefaultSource} />
        <ShowcaseDemoFromFile Demo={DrawerMotionInstantPanelDemo} source={drawerMotionInstantPanelSource} />
        <ShowcaseDemoFromFile Demo={DrawerMotionTitleStaggerDemo} source={drawerMotionTitleStaggerSource} />
        <ShowcaseDemoFromFile Demo={DrawerMotionBounceSlideDemo} source={drawerMotionBounceSlideSource} />
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
        <ShowcaseDoc.Customization gloss>
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
