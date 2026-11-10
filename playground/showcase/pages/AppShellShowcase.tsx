import { AppShellScreenDemo } from "../demos/app-shell/AppShellScreen.demo";
import optionSource from "../demos/app-shell/AppShellScreen.demo.tsx?raw";
import { AppShellClassNamesFullDemo } from "../demos/app-shell/AppShellClassNamesFull.demo";
import classNamesSource from "../demos/app-shell/AppShellClassNamesFull.demo.tsx?raw";
import { AppShellMotionControllerGalleryDemo } from "../demos/app-shell/motionController/gallery";
import { AppShellSlotMotionGalleryDemo } from "../demos/app-shell/slotMotion/gallery";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function AppShellShowcase() {
  return (
    <ShowcasePage
      title="AppShell"
      description="Places Header and Sidebar. The rest goes in main."
      importPath='import { AppShell } from "@/components/core/AppShell";'
      tags={["core", "layout"]}
    >
      <ShowcaseSection title="Screen" description="Direct Header and Sidebar children are placed. Each Sidebar sets its own side.">
        <ShowcaseDemoFromFile align="stretch" Demo={AppShellScreenDemo} source={optionSource} />
      </ShowcaseSection>
      <ShowcaseSection title="classNames" description="Slot classes via classNames. className wins.">
        <ShowcaseDemoFromFile Demo={AppShellClassNamesFullDemo} source={classNamesSource} />
      </ShowcaseSection>
      <ShowcaseSection title="Slot motion" description="Opt-in enter. Defaults are empty.">
        <AppShellSlotMotionGalleryDemo />
      </ShowcaseSection>
      <ShowcaseSection title="MotionController" description="play / set, namespaced events, events false, waitForComplete.">
        <AppShellMotionControllerGalleryDemo />
      </ShowcaseSection>
      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/AppShell" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow api="simple" description="Sidebar.side. Header and Sidebar are their own components." />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
