import { ToastPortalContainerDemo } from "../demos/toast/ToastPortalContainer.demo";
import toastPortalContainerSource from "../demos/toast/ToastPortalContainer.demo.tsx?raw";
import { ToastClassNamesCompoundDemo, ToastClassNamesFullDemo } from "../demos/toast/ToastClassNamesFull.demo";
import toastClassNamesFullSource from "../demos/toast/ToastClassNamesFull.demo.tsx?raw";
import { ToastDefaultDemo } from "../demos/toast/ToastDefault.demo";
import toastDefaultSource from "../demos/toast/ToastDefault.demo.tsx?raw";
import { ToastDeployPanelDemo } from "../demos/toast/ToastDeployPanel.demo";
import toastDeployPanelSource from "../demos/toast/ToastDeployPanel.demo.tsx?raw";
import { ToastModificationsDemo } from "../demos/toast/ToastModifications.demo";
import toastModificationsSource from "../demos/toast/ToastModifications.demo.tsx?raw";
import { ToastPlacementsDemo } from "../demos/toast/ToastPlacements.demo";
import toastPlacementsSource from "../demos/toast/ToastPlacements.demo.tsx?raw";
import { ToastPromiseFlowDemo } from "../demos/toast/ToastPromiseFlow.demo";
import toastPromiseFlowSource from "../demos/toast/ToastPromiseFlow.demo.tsx?raw";
import { ToastSizesDemo } from "../demos/toast/ToastSizes.demo";
import toastSizesSource from "../demos/toast/ToastSizes.demo.tsx?raw";
import { ToastUndoActionDemo } from "../demos/toast/ToastUndoAction.demo";
import toastUndoActionSource from "../demos/toast/ToastUndoAction.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function ToastShowcase() {
  return (
    <ShowcasePage
      title="Toast"
      description="Imperative notifications via useToast — stack up to 3 visible toasts."
      importPath='import { Toast, useToast } from "@/components/core/Toast";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Base" description="toast.show with title and description — status and variant default.">
        <ShowcaseDemoFromFile Demo={ToastDefaultDemo} source={toastDefaultSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large — padding, typography and width viewport.">
        <ShowcaseDemoFromFile Demo={ToastSizesDemo} source={toastSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Modifications"
        description="status, variant gloss, action, loading and timeout: 0."
      >
        <ShowcaseDemoFromFile Demo={ToastModificationsDemo} source={toastModificationsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Full customization classNames"
        description="Slots root, indicator, title, description, action, close, viewport, scrim, stack."
      >
        <ShowcaseDemoFromFile Demo={ToastClassNamesFullDemo} source={toastClassNamesFullSource} />
        <ShowcaseDemoFromFile Demo={ToastClassNamesCompoundDemo} source={toastClassNamesFullSource} />
      </ShowcaseSection>


      <ShowcaseSection
        title="portalContainer"
        description="Toast.Provider portalContainer — viewport mounts into a custom host."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ToastPortalContainerDemo} source={toastPortalContainerSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Accommodation"
        description="placement: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right."
      >
        <ShowcaseDemoFromFile Demo={ToastPlacementsDemo} source={toastPlacementsSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Undo-action, deployment panel and toast.promise — demo-files in `demos/toast/`."
      >
        <ShowcaseDemoFromFile Demo={ToastUndoActionDemo} source={toastUndoActionSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ToastDeployPanelDemo} source={toastDeployPanelSource} />
        <ShowcaseDemoFromFile Demo={ToastPromiseFlowDemo} source={toastPromiseFlowSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Toast" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <p>
            Imperative API: <code>useToast()</code> → <code>toast.show</code>, <code>toast.success</code>,{" "}
            <code>toast.danger</code>, <code>toast.promise</code> etc. Parameters: <code>title</code>,{" "}
            <code>description</code>, <code>status</code>, <code>variant</code>, <code>size</code>,{" "}
            <code>placement</code>, <code>timeout</code>, <code>action</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Provider">
          <p>
            <code>Toast.Provider</code> should wrap the application (layout). Without him{" "}
            <code>useToast</code> will not be able to display notifications.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            Stack and reposition — <code>configureMotion()</code> (<code>enableToastStack</code>). Scrim
            density - tokens <code>--toast-scrim-size</code>, <code>--toast-scrim-density</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
