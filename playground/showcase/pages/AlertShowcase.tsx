import { AlertCompactStackDemo } from "../demos/alert/AlertCompactStack.demo";
import alertCompactStackSource from "../demos/alert/AlertCompactStack.demo.tsx?raw";
import { AlertClassNamesFullDemo } from "../demos/alert/AlertClassNamesFull.demo";
import alertClassNamesFullSource from "../demos/alert/AlertClassNamesFull.demo.tsx?raw";
import { AlertCompoundBannerDemo } from "../demos/alert/AlertCompoundBanner.demo";
import alertCompoundBannerSource from "../demos/alert/AlertCompoundBanner.demo.tsx?raw";
import { AlertGlossDemo } from "../demos/alert/AlertGloss.demo";
import alertGlossSource from "../demos/alert/AlertGloss.demo.tsx?raw";
import { AlertSizesDemo } from "../demos/alert/AlertSizes.demo";
import alertSizesSource from "../demos/alert/AlertSizes.demo.tsx?raw";
import { AlertStatusesDemo } from "../demos/alert/AlertStatuses.demo";
import alertStatusesSource from "../demos/alert/AlertStatuses.demo.tsx?raw";
import { AlertWithActionDemo } from "../demos/alert/AlertWithAction.demo";
import alertWithActionSource from "../demos/alert/AlertWithAction.demo.tsx?raw";
import { AlertMotionCompoundTitleDemo } from "../demos/alert/AlertMotionCompoundTitle.demo";
import alertMotionCompoundTitleSource from "../demos/alert/AlertMotionCompoundTitle.demo.tsx?raw";
import { AlertMotionOrchestratedDemo } from "../demos/alert/AlertMotionOrchestrated.demo";
import alertMotionOrchestratedSource from "../demos/alert/AlertMotionOrchestrated.demo.tsx?raw";
import { AlertMotionPerPartDemo } from "../demos/alert/AlertMotionPerPart.demo";
import alertMotionPerPartSource from "../demos/alert/AlertMotionPerPart.demo.tsx?raw";
import { AlertMotionTimelineDemo } from "../demos/alert/AlertMotionTimeline.demo";
import alertMotionTimelineSource from "../demos/alert/AlertMotionTimeline.demo.tsx?raw";
import { AlertMotionControllerDemo } from "../demos/alert/AlertMotionController.demo";
import alertMotionControllerSource from "../demos/alert/AlertMotionController.demo.tsx?raw";
import { AlertMotionControllerPlayVsSlotDemo } from "../demos/alert/AlertMotionControllerPlayVsSlot.demo";
import alertMotionControllerPlayVsSlotSource from "../demos/alert/AlertMotionControllerPlayVsSlot.demo.tsx?raw";
import { AlertMotionControllerInsideDemo } from "../demos/alert/AlertMotionControllerInside.demo";
import alertMotionControllerInsideSource from "../demos/alert/AlertMotionControllerInside.demo.tsx?raw";
import { AlertMotionControllerStaggerDemo } from "../demos/alert/AlertMotionControllerStagger.demo";
import alertMotionControllerStaggerSource from "../demos/alert/AlertMotionControllerStagger.demo.tsx?raw";
import { AlertMotionControllerExcludeDemo } from "../demos/alert/AlertMotionControllerExclude.demo";
import alertMotionControllerExcludeSource from "../demos/alert/AlertMotionControllerExclude.demo.tsx?raw";
import { AlertMotionControllerCancelDemo } from "../demos/alert/AlertMotionControllerCancel.demo";
import alertMotionControllerCancelSource from "../demos/alert/AlertMotionControllerCancel.demo.tsx?raw";
import { AlertMotionControllerSignalDemo } from "../demos/alert/AlertMotionControllerSignal.demo";
import alertMotionControllerSignalSource from "../demos/alert/AlertMotionControllerSignal.demo.tsx?raw";
import { AlertMotionEventsPingDemo } from "../demos/alert/AlertMotionEventsPing.demo";
import alertMotionEventsPingSource from "../demos/alert/AlertMotionEventsPing.demo.tsx?raw";
import { AlertMotionEventsSaveDemo } from "../demos/alert/AlertMotionEventsSave.demo";
import alertMotionEventsSaveSource from "../demos/alert/AlertMotionEventsSave.demo.tsx?raw";
import { AlertMotionEventsFinishedDemo } from "../demos/alert/AlertMotionEventsFinished.demo";
import alertMotionEventsFinishedSource from "../demos/alert/AlertMotionEventsFinished.demo.tsx?raw";
import { AlertMotionEventsTargetsDemo } from "../demos/alert/AlertMotionEventsTargets.demo";
import alertMotionEventsTargetsSource from "../demos/alert/AlertMotionEventsTargets.demo.tsx?raw";
import { AlertMotionEventsOffDemo } from "../demos/alert/AlertMotionEventsOff.demo";
import alertMotionEventsOffSource from "../demos/alert/AlertMotionEventsOff.demo.tsx?raw";
import { AlertMotionTitleColorDemo } from "../demos/alert/AlertMotionTitleColor.demo";
import alertMotionTitleColorSource from "../demos/alert/AlertMotionTitleColor.demo.tsx?raw";
import { AlertMotionTitleLiftDemo } from "../demos/alert/AlertMotionTitleLift.demo";
import alertMotionTitleLiftSource from "../demos/alert/AlertMotionTitleLift.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function AlertShowcase() {
  return (
    <ShowcasePage
      title="Alert"
      description="Information messages with title, description and statuses."
      importPath='import { Alert } from "@/components/core/Alert";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Statuses" description="title and description on the root — Simple API.">
        <ShowcaseDemoFromFile align="stretch" Demo={AlertStatusesDemo} source={alertStatusesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={AlertSizesDemo} source={alertSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="Glass panel with hover-lift.">
        <ShowcaseDemoFromFile align="stretch" Demo={AlertGlossDemo} source={alertGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Slot motion"
        description="Each card is a separate copyable example — vars, part props, root orchestration, color, per-part hover, timeline."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionTitleLiftDemo} source={alertMotionTitleLiftSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionCompoundTitleDemo} source={alertMotionCompoundTitleSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionOrchestratedDemo} source={alertMotionOrchestratedSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionTitleColorDemo} source={alertMotionTitleColorSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionPerPartDemo} source={alertMotionPerPartSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionTimelineDemo} source={alertMotionTimelineSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="MotionController"
        description="Imperative play / playSlot / playAll / set / cancel / signal — handle from outside, or useMotionController() inside."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionControllerDemo} source={alertMotionControllerSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionControllerPlayVsSlotDemo} source={alertMotionControllerPlayVsSlotSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionControllerInsideDemo} source={alertMotionControllerInsideSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionControllerStaggerDemo} source={alertMotionControllerStaggerSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionControllerExcludeDemo} source={alertMotionControllerExcludeSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionControllerCancelDemo} source={alertMotionControllerCancelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionControllerSignalDemo} source={alertMotionControllerSignalSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="motion.events"
        description="Namespaced app commands (notify:ping, save:saving) — not hoverIn and not MOTION_PHASE_NAMES."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionEventsPingDemo} source={alertMotionEventsPingSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionEventsSaveDemo} source={alertMotionEventsSaveSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionEventsFinishedDemo} source={alertMotionEventsFinishedSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionEventsTargetsDemo} source={alertMotionEventsTargetsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertMotionEventsOffDemo} source={alertMotionEventsOffSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Action, notification stack and compound-marking — demo-files in `demos/alert/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={AlertClassNamesFullDemo} source={alertClassNamesFullSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertWithActionDemo} source={alertWithActionSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertCompactStackDemo} source={alertCompactStackSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertCompoundBannerDemo} source={alertCompoundBannerSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Alert" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="title, description, status, variant (including. gloss), size, icon, action on the root."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Message, Indicator, Content, Title, Description, Action — for complex markup."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Availability">
          <p>
            For <code>danger</code> and <code>warning</code> — <code>role=&quot;alert&quot;</code>. Auto-id
            For <code>aria-labelledby</code> / <code>aria-describedby</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Next step">
          <p>
            The next step is to go through and unify the names of the slots (
            <code>root</code>/<code>content</code>/<code>message</code> etc.) in the general guideline,
            so that they are called the same everywhere in China.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
