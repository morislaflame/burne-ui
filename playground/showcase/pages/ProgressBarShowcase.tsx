import { ProgressBarClassNamesFullDemo } from "../demos/progress-bar/ProgressBarClassNamesFull.demo";
import progressBarClassNamesFullSource from "../demos/progress-bar/ProgressBarClassNamesFull.demo.tsx?raw";
import { ProgressPipelineDemo } from "../demos/progress-bar/ProgressPipeline.demo";
import progressPipelineSource from "../demos/progress-bar/ProgressPipeline.demo.tsx?raw";
import { ProgressHorizontalDemo } from "../demos/progress-bar/ProgressHorizontal.demo";
import progressHorizontalSource from "../demos/progress-bar/ProgressHorizontal.demo.tsx?raw";
import { ProgressBarSizesDemo } from "../demos/progress-bar/ProgressBarSizes.demo";
import progressBarSizesSource from "../demos/progress-bar/ProgressBarSizes.demo.tsx?raw";
import { ProgressUploadCardDemo } from "../demos/progress-bar/ProgressUploadCard.demo";
import progressUploadCardSource from "../demos/progress-bar/ProgressUploadCard.demo.tsx?raw";
import { ProgressVerticalDemo } from "../demos/progress-bar/ProgressVertical.demo";
import progressVerticalSource from "../demos/progress-bar/ProgressVertical.demo.tsx?raw";
import { ProgressVerticalMetersDemo } from "../demos/progress-bar/ProgressVerticalMeters.demo";
import progressVerticalMetersSource from "../demos/progress-bar/ProgressVerticalMeters.demo.tsx?raw";
import { ProgressBarMotionInstantEnterDemo } from "../demos/progressBar/ProgressBarMotionInstantEnter.demo";
import progressBarMotionInstantEnterSource from "../demos/progressBar/ProgressBarMotionInstantEnter.demo.tsx?raw";
import { ProgressBarMotionTrackWaveDemo } from "../demos/progressBar/ProgressBarMotionTrackWave.demo";
import progressBarMotionTrackWaveSource from "../demos/progressBar/ProgressBarMotionTrackWave.demo.tsx?raw";
import { ProgressBarMotionChangeTintDemo } from "../demos/progressBar/ProgressBarMotionChangeTint.demo";
import progressBarMotionChangeTintSource from "../demos/progressBar/ProgressBarMotionChangeTint.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function ProgressBarShowcase() {
  return (
    <ShowcasePage
      title="ProgressBar"
      description="Progress indicator with definite and indefinite state."
      importPath='import { ProgressBar } from "@/components/core/ProgressBar";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Horizontal" description="label, value, indeterminate and color.">
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressHorizontalDemo} source={progressHorizontalSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressBarSizesDemo} source={progressBarSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Vertical" description="orientation=&quot;vertical&quot; with showValue.">
        <ShowcaseDemoFromFile Demo={ProgressVerticalDemo} source={progressVerticalSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slots root, header, value, track, fill, indeterminateFill, hint and error — through prop classNames."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressBarClassNamesFullDemo} source={progressBarClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Download card, pipeline and vertical meters — demo-files in `demos/progress-bar/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressUploadCardDemo} source={progressUploadCardSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressPipelineDemo} source={progressPipelineSource} />
        <ShowcaseDemoFromFile Demo={ProgressVerticalMetersDemo} source={progressVerticalMetersSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Slot motion" description="Instant enter skip, track timeline, change-phase tint. Fill geometry stays kit-internal.">
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressBarMotionInstantEnterDemo} source={progressBarMotionInstantEnterSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressBarMotionTrackWaveDemo} source={progressBarMotionTrackWaveSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ProgressBarMotionChangeTintDemo} source={progressBarMotionChangeTintSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/ProgressBar" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, value, min, max, indeterminate, orientation, showValue, color on the root."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization>
          <p>
            <code>color</code> — semantic key or CSS-fill color. <code>indeterminate</code> — animation
            without value. Smooth filling — <code>configureMotion()</code> (<code>enableProgressFill</code>,{" "}
            <code>progressFillDuration</code>).
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}
